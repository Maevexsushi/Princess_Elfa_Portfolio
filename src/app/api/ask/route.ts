import { systemPromptFor } from "@/lib/ai/knowledge";

export const runtime = "nodejs";

/* ---------------------------------------------------------------------------
   Providers — both speak the OpenAI chat-completions protocol, so one request
   shape serves both. Groq answers first; Gemini is the fallback if Groq is
   missing, errors, or doesn't start answering in time.
--------------------------------------------------------------------------- */

type Provider = {
  name: string;
  url: string;
  key: string | undefined;
  model: string;
  timeoutMs: number;
  /** Provider-specific request options. */
  extra?: Record<string, unknown>;
};

function providers(): Provider[] {
  const groqKey = process.env.GROQ_API_TOKEN ?? process.env.GROQ_API_KEY;
  const geminiUrl = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
  return [
    {
      name: "groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: groqKey,
      model: process.env.GROQ_MODEL || "openai/gpt-oss-120b",
      timeoutMs: 10_000,
      // A reasoning model: think briefly, and keep the reasoning out of the reply.
      extra: { reasoning_effort: "low", include_reasoning: false },
    },
    // Each Groq model has its own per-minute budget, so the smaller one is a
    // real second chance when the first is busy.
    {
      name: "groq-small",
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: groqKey,
      model: "openai/gpt-oss-20b",
      timeoutMs: 10_000,
      extra: { reasoning_effort: "low", include_reasoning: false },
    },
    {
      name: "gemini",
      url: geminiUrl,
      key: process.env.GEMINI_API_KEY,
      // An alias that always points at the current Flash model, so a retired
      // version can't take the assistant down.
      model: process.env.GEMINI_MODEL || "gemini-flash-latest",
      timeoutMs: 15_000,
      extra: { reasoning_effort: "low" },
    },
    {
      name: "gemini-lite",
      url: geminiUrl,
      key: process.env.GEMINI_API_KEY,
      model: "gemini-flash-lite-latest",
      timeoutMs: 15_000,
      extra: { reasoning_effort: "low" },
    },
  ].filter((p) => p.key);
}

/* ---------------------------------------------------------------------------
   Limits — this endpoint spends real API credit, so keep it on a short leash.
--------------------------------------------------------------------------- */

const MAX_MESSAGES = 12;
const MAX_CHARS = 600;
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 20;

/**
 * Per-IP request counts. In memory, so it resets on a cold start and isn't
 * shared between serverless instances — a speed bump, not a wall.
 */
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5_000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

function parseMessages(body: unknown): ChatMessage[] | null {
  const raw = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  const messages = raw.slice(-MAX_MESSAGES).map((m) => {
    const role = (m as ChatMessage)?.role;
    const content = (m as ChatMessage)?.content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    return { role, content: content.trim().slice(0, MAX_CHARS * 3) };
  });
  if (messages.some((m) => m === null)) return null;
  const list = messages as ChatMessage[];
  const last = list[list.length - 1];
  if (last.role !== "user" || !last.content || last.content.length > MAX_CHARS) return null;
  return list;
}

const json = (error: string, status: number) => Response.json({ error }, { status });

/* ---------------------------------------------------------------------------
   Streaming: read the provider's server-sent events and pass only the text
   through, so the browser receives a plain stream of words.
--------------------------------------------------------------------------- */

async function openStream(p: Provider, messages: ChatMessage[], systemPrompt: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), p.timeoutMs);
  try {
    const res = await fetch(p.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${p.key}` },
      body: JSON.stringify({
        model: p.model,
        stream: true,
        temperature: 0.3,
        // Generous, because a reasoning model spends some of it thinking.
        max_tokens: 900,
        messages: [{ role: "system", content: systemPrompt }, ...messages],
        ...p.extra,
      }),
      signal: controller.signal,
    });
    if (!res.ok || !res.body) {
      console.error(`ask: ${p.name} responded ${res.status}`, await res.text().catch(() => ""));
      return null;
    }
    // Wait for the first chunk before committing to this provider.
    const reader = res.body.getReader();
    const first = await reader.read();
    clearTimeout(timer);
    if (first.done) return null;
    return { reader, first: first.value };
  } catch (err) {
    clearTimeout(timer);
    console.error(`ask: ${p.name} failed`, err instanceof Error ? err.message : err);
    return null;
  }
}

function toTextStream(reader: ReadableStreamDefaultReader<Uint8Array>, first: Uint8Array) {
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  return new ReadableStream<Uint8Array>({
    async start(out) {
      const handle = (chunk: Uint8Array) => {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.trim();
          if (!data.startsWith("data:")) continue;
          const payload = data.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const text = JSON.parse(payload)?.choices?.[0]?.delta?.content;
            if (typeof text === "string" && text) out.enqueue(encoder.encode(text));
          } catch {
            // A partial or keep-alive line: skip it.
          }
        }
      };
      try {
        handle(first);
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          handle(value);
        }
      } catch {
        out.enqueue(encoder.encode("\n\n(The answer was cut off — please try again.)"));
      }
      out.close();
    },
    cancel() {
      reader.cancel().catch(() => {});
    },
  });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (rateLimited(ip)) {
    return json("You've asked a lot of questions — please wait a few minutes and try again.", 429);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json("Invalid request.", 400);
  }
  const messages = parseMessages(body);
  if (!messages) return json(`Please ask a question of up to ${MAX_CHARS} characters.`, 400);

  const list = providers();
  if (list.length === 0) {
    console.error("ask: no GROQ_API_TOKEN or GEMINI_API_KEY configured");
    return json("The assistant isn't set up yet. Please email Princess directly.", 503);
  }

  // Full case studies only for the projects the visitor has been asking about.
  const recentQuestions = messages
    .filter((m) => m.role === "user")
    .slice(-3)
    .map((m) => m.content)
    .join(" ");
  const systemPrompt = systemPromptFor(recentQuestions);

  for (const p of list) {
    const stream = await openStream(p, messages, systemPrompt);
    if (stream) {
      return new Response(toTextStream(stream.reader, stream.first), {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Provider": p.name,
        },
      });
    }
  }
  return json("The assistant is unavailable right now. Please try again in a moment.", 502);
}
