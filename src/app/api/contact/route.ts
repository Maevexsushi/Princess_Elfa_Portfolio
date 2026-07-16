import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { siteConfig } from "@/data/siteConfig";

export const runtime = "nodejs";

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
  company?: string; // honeypot
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = data.name?.trim() ?? "";
  const email = data.email?.trim() ?? "";
  const message = data.message?.trim() ?? "";

  // Honeypot: silently accept but do nothing if a bot filled the hidden field.
  if (data.company && data.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Please fill in your name, email, and message." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }
  if (message.length > 5000) {
    return NextResponse.json(
      { error: "Message is too long." },
      { status: 400 },
    );
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.CONTACT_TO || user;

  if (!user || !pass) {
    console.error("Contact form: GMAIL_USER / GMAIL_APP_PASSWORD not configured.");
    return NextResponse.json(
      { error: "Email is not configured yet. Please email me directly." },
      { status: 500 },
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from: `"${siteConfig.name} Portfolio" <${user}>`,
      to,
      replyTo: `"${name}" <${email}>`,
      subject: `Portfolio contact from ${name}`,
      text: `New portfolio message\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: buildEmailHtml(name, email, message),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact form: failed to send email", err);
    return NextResponse.json(
      { error: "Failed to send your message. Please try again later." },
      { status: 502 },
    );
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Branded, email-client-safe HTML (table layout + inline styles).
function buildEmailHtml(name: string, email: string, message: string) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, "<br />");

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background-color:#eef2f8;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">New message from ${safeName} via your portfolio.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef2f8;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 6px 28px rgba(15,23,42,0.10);font-family:Arial,Helvetica,sans-serif;">
          <!-- Header -->
          <tr>
            <td style="background-color:#0d1424;padding:28px 32px;">
              <p style="margin:0;font-family:'Courier New',Courier,monospace;color:#3b82f6;font-size:14px;letter-spacing:1px;">&lt;PME /&gt;</p>
              <h1 style="margin:10px 0 0;color:#ffffff;font-size:20px;font-weight:bold;">New portfolio message</h1>
              <p style="margin:6px 0 0;color:#9fb0c7;font-size:13px;">${escapeHtml(
                siteConfig.name,
              )} &middot; Contact form</p>
            </td>
          </tr>
          <tr><td style="height:4px;line-height:4px;font-size:0;background-color:#2563eb;">&nbsp;</td></tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding-bottom:18px;">
                    <p style="margin:0 0 4px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px;">From</p>
                    <p style="margin:0;color:#0f172a;font-size:16px;font-weight:bold;">${safeName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding-bottom:18px;">
                    <p style="margin:0 0 4px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Email</p>
                    <a href="mailto:${safeEmail}" style="color:#2563eb;font-size:16px;text-decoration:none;">${safeEmail}</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <p style="margin:0 0 8px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1px;">Message</p>
                    <div style="background-color:#f1f5f9;border-left:3px solid #2563eb;border-radius:8px;padding:16px 18px;color:#0f172a;font-size:15px;line-height:1.65;">${safeMessage}</div>
                  </td>
                </tr>
              </table>
              <!-- Reply button -->
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:26px;">
                <tr>
                  <td style="border-radius:8px;background-color:#2563eb;">
                    <a href="mailto:${safeEmail}" style="display:inline-block;padding:12px 26px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">Reply to ${safeName}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:18px 32px;background-color:#f8fafc;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.5;">Sent from the contact form on your portfolio website. Reply directly to respond to ${safeName}.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
