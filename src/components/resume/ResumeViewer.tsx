"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

type Doc = import("pdfjs-dist").PDFDocumentProxy;

const ZOOMS = [1, 1.25, 1.5, 2];

/**
 * The résumé PDF drawn onto canvases with pdf.js, rather than handed to the
 * browser's own viewer — which doesn't render inside a page on most phones.
 * pdf.js is loaded only here, when the page opens.
 *
 * Each page is rendered at the width it's shown at times the screen's pixel
 * density (and the zoom), so the text stays sharp on any display.
 */
export function ResumeViewer({ src, title }: { src: string; title: string }) {
  const [doc, setDoc] = useState<Doc | null>(null);
  const [text, setText] = useState("");
  const [failed, setFailed] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [width, setWidth] = useState(0);
  const frame = useRef<HTMLDivElement>(null);
  const canvases = useRef<(HTMLCanvasElement | null)[]>([]);

  // Load the document once.
  useEffect(() => {
    let cancelled = false;
    let loaded: Doc | null = null;
    (async () => {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();
        loaded = await pdfjs.getDocument(src).promise;
        if (cancelled) return;
        setDoc(loaded);
        // The words on the page, for screen readers (the canvas is a picture).
        const pages = await Promise.all(
          Array.from({ length: loaded.numPages }, (_, i) => loaded!.getPage(i + 1)),
        );
        const contents = await Promise.all(pages.map((p) => p.getTextContent()));
        if (!cancelled) {
          setText(
            contents
              .map((c) => c.items.map((it) => ("str" in it ? it.str : "")).join(" "))
              .join("\n\n"),
          );
        }
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
      loaded?.destroy();
    };
  }, [src]);

  // Track the space available, so the page fills it.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Draw (and redraw on resize or zoom).
  useEffect(() => {
    if (!doc || !width) return;
    let cancelled = false;
    const tasks: { cancel: () => void }[] = [];
    (async () => {
      for (let i = 0; i < doc.numPages; i++) {
        const page = await doc.getPage(i + 1);
        const canvas = canvases.current[i];
        if (!canvas || cancelled) return;
        const base = page.getViewport({ scale: 1 });
        const cssWidth = width * ZOOMS[zoom];
        const ratio = Math.min(window.devicePixelRatio || 1, 3);
        const viewport = page.getViewport({ scale: (cssWidth / base.width) * ratio });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${cssWidth}px`;
        canvas.style.height = `${(cssWidth / base.width) * base.height}px`;
        const task = page.render({ canvas, viewport });
        tasks.push(task);
        await task.promise.catch(() => {});
      }
    })();
    return () => {
      cancelled = true;
      tasks.forEach((t) => t.cancel());
    };
  }, [doc, width, zoom]);

  const pages = doc?.numPages ?? 1;

  return (
    <div className="flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 border-b border-rule px-4 py-2.5">
        <p className="text-[13px] text-ink-2">
          {pages} {pages === 1 ? "page" : "pages"} · PDF
        </p>
        <div role="group" aria-label="Zoom" className="flex items-center gap-1 rounded-lg bg-bg p-0.5">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0, z - 1))}
            disabled={zoom === 0}
            aria-label="Zoom out"
            className="flex h-7 w-7 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-surface hover:text-ink disabled:opacity-30"
          >
            <Minus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          </button>
          <span className="eyebrow w-11 text-center text-ink-2 tabular-nums" aria-live="polite">
            {Math.round(ZOOMS[zoom] * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(ZOOMS.length - 1, z + 1))}
            disabled={zoom === ZOOMS.length - 1}
            aria-label="Zoom in"
            className="flex h-7 w-7 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-surface hover:text-ink disabled:opacity-30"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>

      {/* Pages: a sheet of paper on the grey, scrolling sideways when zoomed */}
      <div className="overflow-auto bg-bg-raised p-3 sm:p-6">
        <div ref={frame} className="mx-auto w-full max-w-[52rem]">
          {failed ? (
            <div className="flex aspect-[1/1.414] flex-col items-center justify-center gap-2 rounded-sm bg-white p-6 text-center">
              <p className="font-medium text-black">The preview couldn&apos;t load.</p>
              <a href={src} target="_blank" rel="noopener noreferrer" className="text-sm text-black underline underline-offset-4">
                Open the PDF instead
              </a>
            </div>
          ) : (
            <div className={cn("flex flex-col gap-4", zoom > 0 && "w-max")}>
              {Array.from({ length: pages }, (_, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden rounded-sm bg-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_40px_-12px_rgba(0,0,0,0.25)]"
                >
                  {!doc && (
                    <div className="flex aspect-[1/1.414] w-full items-center justify-center">
                      <Loader2 className="h-5 w-5 animate-spin text-black/40" aria-hidden />
                      <span className="sr-only">Loading résumé</span>
                    </div>
                  )}
                  <canvas
                    ref={(c) => void (canvases.current[i] = c)}
                    role="img"
                    aria-label={`${title}, page ${i + 1}`}
                    className={cn("block", !doc && "hidden")}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {text && <div className="sr-only">{text}</div>}
    </div>
  );
}
