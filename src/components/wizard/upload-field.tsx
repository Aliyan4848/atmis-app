"use client";

import * as React from "react";
import { UploadCloud, FileText, X, CheckCircle2, ShieldCheck, ShieldAlert, ShieldQuestion, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { formatCnic, compareCnic } from "@/lib/cnic";
import { recognizeImage } from "@/lib/ocr-client";

type OcrVerification =
  | { result: "verified"; matched: string }
  | { result: "mismatch"; extracted: string[] }
  | { result: "manual_review"; reason: string };

type OcrState =
  | { phase: "idle" }
  | { phase: "preparing" | "reading" | "extracting" | "verifying-cnic" }
  | { phase: "unavailable"; message: string }
  | { phase: "pdf-unsupported" }
  | { phase: "done-cnic"; verification: OcrVerification }
  | { phase: "done-medical"; keywordsDetected: string[]; textDetected: boolean };

type UploadFieldProps = {
  label: string;
  hint?: string;
  onUploaded: (fileName: string) => void;
  onRemoved: () => void;
  fileName: string;
  accept?: string;
  /** When set, runs Tesseract.js OCR verification in-browser after upload completes. */
  documentType?: "cnic" | "medical";
  /** Required when documentType is "cnic" — the CNIC entered earlier in the form. */
  enteredCnic?: string;
};

const LOW_CONFIDENCE_THRESHOLD = 0.35;

// disability/medical certificate keyword hints — purely assistive, not authoritative
const CERT_KEYWORDS = [
  "disability", "disabled", "medical certificate", "certificate no",
  "issuing authority", "hospital", "physician", "doctor", "diagnosis",
  "impairment", "percentage", "board", "PWD",
];

export function UploadField({
  label, hint, onUploaded, onRemoved, fileName, accept = "image/*,.pdf",
  documentType, enteredCnic,
}: UploadFieldProps) {
  const [dragOver, setDragOver] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [uploading, setUploading] = React.useState(false);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [ocr, setOcr] = React.useState<OcrState>({ phase: "idle" });
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function runOcr(file: File) {
    if (!documentType) return;

    // Tesseract.js works on raster images — PDFs need a separate rendering
    // step we deliberately don't add (per spec: don't fake PDF OCR support).
    if (file.type === "application/pdf") {
      setOcr({ phase: "pdf-unsupported" });
      return;
    }

    setOcr({ phase: "preparing" });
    await new Promise((r) => setTimeout(r, 200)); // readable pacing, not instant flash

    setOcr({ phase: "reading" });

    const result = await recognizeImage(file, (status) => {
      // Tesseract reports granular internal statuses (loading model, recognizing
      // text, etc.) — we only need to know we're mid-recognition for the UI.
      if (status.includes("recognizing")) {
        setOcr({ phase: "extracting" });
      }
    });

    if (!result.ok) {
      setOcr({
        phase: "unavailable",
        message: "Automatic verification could not be completed. Your document can still be submitted for manual review.",
      });
      return;
    }

    if (result.confidence < LOW_CONFIDENCE_THRESHOLD) {
      if (documentType === "cnic") {
        setOcr({ phase: "done-cnic", verification: { result: "manual_review", reason: "The document image is too unclear for reliable automatic reading." } });
      } else {
        setOcr({ phase: "done-medical", keywordsDetected: [], textDetected: false });
      }
      return;
    }

    if (documentType === "cnic") {
      setOcr({ phase: "verifying-cnic" });
      await new Promise((r) => setTimeout(r, 250));
      const verification = compareCnic(enteredCnic ?? "", result.text);
      setOcr({ phase: "done-cnic", verification });
    } else {
      const lower = result.text.toLowerCase();
      const keywordsDetected = CERT_KEYWORDS.filter((k) => lower.includes(k.toLowerCase()));
      setOcr({ phase: "done-medical", keywordsDetected, textDetected: result.text.trim().length > 0 });
    }
  }

  function handleFile(file: File) {
    setUploading(true);
    setProgress(0);
    setOcr({ phase: "idle" });
    if (file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }

    // simulated upload progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          onUploaded(file.name);
          runOcr(file);
          return 100;
        }
        return p + 20;
      });
    }, 120);
  }

  function reset() {
    onRemoved();
    setPreview(null);
    setProgress(0);
    setUploading(false);
    setOcr({ phase: "idle" });
    if (inputRef.current) inputRef.current.value = "";
  }

  const done = !!fileName && !uploading;

  return (
    <div>
      <label className="mb-1.5 block text-[12.5px] font-semibold uppercase tracking-wide text-text-secondary">
        {label}
      </label>

      {!fileName && !uploading && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition-colors",
            dragOver ? "border-primary bg-primary-light" : "border-border bg-bg hover:border-primary/40"
          )}
        >
          <UploadCloud className="size-7 text-text-secondary" />
          <p className="text-sm font-semibold text-text-primary">Drag & drop, or click to browse</p>
          {hint && <p className="text-xs text-text-secondary">{hint}</p>}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
      )}

      {uploading && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
            <FileText className="size-4 text-secondary" /> Uploading…
          </div>
          <Progress value={progress} className="mt-3" />
        </div>
      )}

      {done && (
        <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/8 p-3.5">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="size-11 rounded-lg object-cover" />
          ) : (
            <div className="flex size-11 items-center justify-center rounded-lg bg-success/15">
              <FileText className="size-5 text-success" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="size-4 text-success" />
              <span className="truncate text-sm font-semibold text-text-primary">{fileName}</span>
            </div>
            <span className="text-xs text-text-secondary">Uploaded successfully</span>
          </div>
          <button
            type="button"
            onClick={reset}
            className="rounded-md p-1.5 text-text-secondary hover:bg-black/5"
            aria-label={`Remove ${label}`}
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {done && documentType && <OcrPanel state={ocr} />}
    </div>
  );
}

function OcrPanel({ state }: { state: OcrState }) {
  if (state.phase === "idle") return null;

  if (state.phase === "preparing" || state.phase === "reading" || state.phase === "extracting" || state.phase === "verifying-cnic") {
    const label = {
      preparing: "Preparing OCR…",
      reading: "Reading document…",
      extracting: "Extracting information…",
      "verifying-cnic": "Verifying CNIC…",
    }[state.phase];
    return (
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-bg px-3.5 py-3 text-sm font-medium text-text-secondary">
        <Loader2 className="size-4 animate-spin text-primary" /> {label}
      </div>
    );
  }

  if (state.phase === "pdf-unsupported") {
    return (
      <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning/8 px-3.5 py-3">
        <ShieldQuestion className="mt-0.5 size-4.5 shrink-0 text-warning" />
        <p className="text-sm text-text-primary">
          PDF automatic OCR is not currently supported. Please upload a clear JPG or PNG image for
          automatic verification — your PDF will still be submitted for manual review.
        </p>
      </div>
    );
  }

  if (state.phase === "unavailable") {
    return (
      <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning/8 px-3.5 py-3">
        <ShieldQuestion className="mt-0.5 size-4.5 shrink-0 text-warning" />
        <p className="text-sm text-text-primary">{state.message}</p>
      </div>
    );
  }

  if (state.phase === "done-cnic") {
    const v = state.verification;
    if (v.result === "verified") {
      return (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-success/30 bg-success/8 px-3.5 py-3">
          <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-success" />
          <div>
            <p className="text-sm font-semibold text-success">CNIC Verified</p>
            <p className="mt-0.5 text-xs text-text-secondary">
              The CNIC on this document matches the one entered in your application.
            </p>
          </div>
        </div>
      );
    }
    if (v.result === "mismatch") {
      return (
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-danger/30 bg-danger/8 px-3.5 py-3">
          <ShieldAlert className="mt-0.5 size-4.5 shrink-0 text-danger" />
          <div>
            <p className="text-sm font-semibold text-danger">CNIC Mismatch</p>
            <p className="mt-0.5 text-xs text-text-secondary">
              The CNIC detected on this document ({v.extracted.map(formatCnic).join(", ")}) does not match
              the CNIC entered in your application. Please double-check both before submitting.
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning/8 px-3.5 py-3">
        <ShieldQuestion className="mt-0.5 size-4.5 shrink-0 text-warning" />
        <div>
          <p className="text-sm font-semibold text-warning">Manual Verification Required</p>
          <p className="mt-0.5 text-xs text-text-secondary">{v.reason}</p>
        </div>
      </div>
    );
  }

  if (state.phase === "done-medical") {
    return (
      <div className="mt-3 rounded-xl border border-warning/30 bg-warning/8 px-3.5 py-3">
        <div className="flex items-start gap-2.5">
          <ShieldQuestion className="mt-0.5 size-4.5 shrink-0 text-warning" />
          <div>
            <p className="text-sm font-semibold text-text-primary">
              {state.textDetected ? "Document text detected" : "No readable text detected"}
            </p>
            {state.keywordsDetected.length > 0 && (
              <p className="mt-0.5 text-xs text-text-secondary">
                Certificate-related terms found: {state.keywordsDetected.join(", ")}
              </p>
            )}
            <p className="mt-1 text-xs font-medium text-warning">
              Verification: Manual review required — OCR does not confirm document authenticity.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
