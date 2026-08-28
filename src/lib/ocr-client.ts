"use client";

// Fully client-side OCR — no server, no API key, no external OCR service.
// Tesseract.js downloads its worker/wasm/language-data files from its own
// CDN the first time it runs in the browser, then caches them; nothing here
// talks to any backend we control.

import type { Worker } from "tesseract.js";

let workerPromise: Promise<Worker> | null = null;

/** Lazily creates a single reusable Tesseract worker instead of one per upload. */
function getWorker(onProgress?: (status: string, progress: number) => void): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = (async () => {
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng", 1, {
        logger: (m) => {
          if (onProgress && m.status) onProgress(m.status, m.progress ?? 0);
        },
      });
      return worker;
    })();
  }
  return workerPromise;
}

export type OcrOutcome =
  | { ok: true; text: string; confidence: number }
  | { ok: false; reason: "unsupported-type" | "empty-file" | "worker-error" };

const SUPPORTED_TYPES = ["image/jpeg", "image/jpg", "image/png"];

/**
 * Runs OCR on a single image file in the browser. Returns a discriminated
 * result instead of throwing, so callers can always show a graceful message
 * rather than crashing the page.
 */
export async function recognizeImage(
  file: File,
  onProgress?: (status: string, progress: number) => void
): Promise<OcrOutcome> {
  if (!SUPPORTED_TYPES.includes(file.type)) {
    return { ok: false, reason: "unsupported-type" };
  }
  if (file.size === 0) {
    return { ok: false, reason: "empty-file" };
  }

  try {
    const worker = await getWorker(onProgress);
    const { data } = await worker.recognize(file);
    return { ok: true, text: data.text ?? "", confidence: (data.confidence ?? 0) / 100 };
  } catch {
    return { ok: false, reason: "worker-error" };
  }
}

/** Call once when the app is done needing OCR (e.g. unmount) to free memory. Safe to skip. */
export async function terminateOcrWorker() {
  if (workerPromise) {
    const worker = await workerPromise;
    await worker.terminate();
    workerPromise = null;
  }
}
