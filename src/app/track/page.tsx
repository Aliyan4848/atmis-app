"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, AlertCircle, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Timeline } from "@/components/wizard/timeline";
import { SEED_APPLICATIONS, buildTimeline, TIMELINE_STAGES } from "@/lib/mock-data";
import { getSessionApps } from "@/lib/session-apps";

// simulated network lookup — this is where a real API call would go
async function lookupApplication(query: string) {
  await new Promise((r) => setTimeout(r, 500));
  const q = query.trim().toLowerCase();
  if (!q) return null;

  const all = [...SEED_APPLICATIONS, ...getSessionApps()];
  const match = all.find(
    (a) =>
      a.id.toLowerCase() === q ||
      a.cnic.toLowerCase() === q ||
      a.phone.toLowerCase() === q
  );
  return match ?? null;
}

function TrackContent() {
  const params = useSearchParams();
  const [query, setQuery] = React.useState(params.get("id") ?? "");
  const [searchTerm, setSearchTerm] = React.useState(params.get("id") ?? "");

  const { data, isFetching, isFetched } = useQuery({
    queryKey: ["track", searchTerm],
    queryFn: () => lookupApplication(searchTerm),
    enabled: !!searchTerm,
  });

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearchTerm(query);
  }

  const timeline = data ? buildTimeline(data.currentStageIndex) : null;
  const statusLabel = data ? TIMELINE_STAGES[data.currentStageIndex] : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary-light">
          <FileSearch className="size-6 text-primary" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-text-primary sm:text-3xl">Track Your Application</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Search by Request ID, CNIC, or phone number to see live status.
        </p>
      </div>

      <Card className="mt-8">
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handleSearch} className="flex flex-col gap-3 sm:flex-row">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ATMIS-2026-48213, CNIC, or phone number"
              className="font-mono"
            />
            <Button type="submit" disabled={!query.trim()}>
              <Search className="size-4" /> Track
            </Button>
          </form>
          <p className="mt-3 text-xs text-text-secondary">
            Try a demo ID: <span className="font-mono font-semibold">ATMIS-2026-48213</span> or{" "}
            <span className="font-mono font-semibold">ATMIS-2026-48099</span>
          </p>
        </CardContent>
      </Card>

      {isFetching && (
        <div className="mt-6 text-center text-sm text-text-secondary">Searching…</div>
      )}

      {isFetched && !data && !isFetching && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-warning/30 bg-warning/8 p-4 text-sm text-text-primary">
          <AlertCircle className="size-5 shrink-0 text-warning" />
          No application found for &ldquo;{searchTerm}&rdquo;. Double-check the ID, CNIC, or phone
          number and try again.
        </div>
      )}

      {data && timeline && (
        <Card className="mt-6 animate-fade-in">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border pb-5">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Request ID
                </span>
                <p className="font-mono text-lg font-bold text-text-primary">{data.id}</p>
                <p className="mt-0.5 text-sm text-text-secondary">{data.fullName}</p>
              </div>
              <Badge variant={data.currentStageIndex >= TIMELINE_STAGES.length - 1 ? "success" : "secondary"}>
                {statusLabel}
              </Badge>
            </div>
            <div className="pt-6">
              <Timeline events={timeline} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-text-secondary">Loading…</div>}>
      <TrackContent />
    </Suspense>
  );
}
