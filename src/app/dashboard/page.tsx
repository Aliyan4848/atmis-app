"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Search, Plus, CheckCircle2, ArrowRight, Loader2, FileQuestion,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth-context";
import { TIMELINE_STAGES, DEVICE_TYPES } from "@/lib/mock-data";

type MyApp = {
  id: string;
  fullName: string;
  deviceType: string;
  currentStageIndex: number;
  submittedAt: string;
};

async function fetchMine(): Promise<MyApp[]> {
  const res = await fetch("/api/applications/mine");
  if (res.status === 401) return [];
  const data = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.applications;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  const { data: applications, isLoading } = useQuery({
    queryKey: ["my-applications", user?.id],
    queryFn: fetchMine,
    enabled: !!user,
  });

  if (loading || !user) {
    return <div className="py-24 text-center text-text-secondary">Loading…</div>;
  }

  const mostRecent = applications?.[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">
            Welcome back, {user.fullName.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-text-secondary">Here&apos;s what&apos;s happening with your applications.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/track"><Search className="size-4" /> Track</Link>
          </Button>
          <Button asChild>
            <Link href="/apply"><Plus className="size-4" /> New Application</Link>
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-text-secondary">
          <Loader2 className="size-4 animate-spin" /> Loading your applications…
        </div>
      )}

      {!isLoading && applications && applications.length === 0 && (
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <FileQuestion className="size-10 text-text-secondary" />
            <p className="font-semibold text-text-primary">No applications yet</p>
            <p className="max-w-sm text-sm text-text-secondary">
              Once you submit an application, it&apos;ll show up here with live status tracking.
            </p>
            <Button asChild className="mt-2">
              <Link href="/apply"><Plus className="size-4" /> Start an Application</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {mostRecent && (
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-text-primary">Most Recent Application</h2>
                <Badge variant={mostRecent.currentStageIndex >= TIMELINE_STAGES.length - 1 ? "success" : "secondary"}>
                  {TIMELINE_STAGES[mostRecent.currentStageIndex]}
                </Badge>
              </div>
              <div className="mt-4 flex items-center justify-between rounded-xl bg-bg p-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Request ID</span>
                  <p className="font-mono text-lg font-bold text-text-primary">{mostRecent.id}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {DEVICE_TYPES.find((d) => d.value === mostRecent.deviceType)?.label ?? mostRecent.deviceType} · submitted {mostRecent.submittedAt}
                  </p>
                </div>
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/track?id=${mostRecent.id}`}>
                    View Timeline <ArrowRight className="size-3.5" />
                  </Link>
                </Button>
              </div>
              <div className="mt-5">
                <div className="flex justify-between text-xs font-semibold text-text-secondary">
                  <span>Progress</span>
                  <span>{Math.round((mostRecent.currentStageIndex / (TIMELINE_STAGES.length - 1)) * 100)}%</span>
                </div>
                <Progress value={(mostRecent.currentStageIndex / (TIMELINE_STAGES.length - 1)) * 100} className="mt-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5 sm:p-6">
              <h2 className="font-semibold text-text-primary">All Applications</h2>
              <ul className="mt-4 space-y-3">
                {applications!.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-2 rounded-lg bg-bg px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-xs font-semibold text-text-primary">{a.id}</p>
                      <p className="text-[11px] text-text-secondary">{a.submittedAt}</p>
                    </div>
                    <CheckCircle2
                      className={`size-4 shrink-0 ${a.currentStageIndex >= TIMELINE_STAGES.length - 1 ? "text-success" : "text-border"}`}
                    />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
