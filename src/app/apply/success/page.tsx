"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { CheckCircle2, Download, Search, Home, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function SuccessContent() {
  const params = useSearchParams();
  const id = params.get("id") ?? "ATMIS-2026-00000";
  const trackUrl = typeof window !== "undefined" ? `${window.location.origin}/track?id=${id}` : `/track?id=${id}`;

  function downloadReceipt() {
    const text = [
      "ATMIS — Assistive Technology Management Information System",
      "Application Receipt",
      "----------------------------------------",
      `Request ID: ${id}`,
      `Submitted: ${new Date().toISOString().slice(0, 10)}`,
      "Status: Submitted — pending document verification",
      "",
      "Keep this ID safe. You can check your application status any time at:",
      trackUrl,
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${id}-receipt.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-14 text-center sm:px-6">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-success/12 animate-fade-in">
        <CheckCircle2 className="size-9 text-success" strokeWidth={2} />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-text-primary sm:text-3xl">
        Application Submitted <PartyPopper className="inline size-6 text-warning" />
      </h1>
      <p className="mt-2 text-text-secondary">
        Thank you — your request has been received. A confirmation has been sent to your email and phone.
      </p>

      <Card className="mt-8 text-left">
        <CardContent className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-start">
          <div className="rounded-xl border border-border bg-white p-3">
            <QRCodeSVG value={trackUrl} size={112} fgColor="#1F6B36" />
          </div>
          <div className="flex-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Request ID</span>
            <p className="mt-1 font-mono text-xl font-bold text-text-primary">{id}</p>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">
              Scan the QR code or use this ID on the Track Application page to follow your
              request from verification through delivery.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button variant="outline" onClick={downloadReceipt}>
          <Download className="size-4" /> Download Receipt
        </Button>
        <Button asChild>
          <Link href={`/track?id=${id}`}>
            <Search className="size-4" /> Track This Application
          </Link>
        </Button>
      </div>

      <Link href="/" className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline">
        <Home className="size-4" /> Back to homepage
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-text-secondary">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
