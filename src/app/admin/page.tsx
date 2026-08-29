"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShieldCheck, ArrowUpDown, MessageSquareText, Loader2, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TIMELINE_STAGES, DEVICE_TYPES } from "@/lib/mock-data";

type QueueApp = {
  id: string;
  fullName: string;
  cnic: string;
  phone: string;
  email: string;
  province: string;
  deviceType: string;
  currentStageIndex: number;
  submittedAt: string;
};

function statusVariant(stageIndex: number): "warning" | "secondary" | "success" {
  if (stageIndex >= TIMELINE_STAGES.length - 1) return "success";
  if (stageIndex <= 1) return "warning";
  return "secondary";
}

async function fetchQueue(): Promise<QueueApp[]> {
  const res = await fetch("/api/applications/admin");
  const data = await res.json();
  if (!data.success) throw new Error(data.error ?? "Could not load applications.");
  return data.applications;
}

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [updating, setUpdating] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  const { data: queue, isLoading, isError } = useQuery({
    queryKey: ["admin-queue"],
    queryFn: fetchQueue,
    enabled: !!user?.isAdmin, // never even call the API unless we already know they're an admin
  });

  async function handleStatusChange(app: QueueApp, newIndex: number) {
    if (newIndex === app.currentStageIndex) return;
    const newStatus = TIMELINE_STAGES[newIndex];

    setUpdating(app.id);
    try {
      const res = await fetch("/api/applications/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: app.id, newStageIndex: newIndex }),
      });
      const result = await res.json();

      if (!result.success) {
        toast.error(result.error ?? "Could not update status.");
        return;
      }

      queryClient.setQueryData<QueueApp[]>(["admin-queue"], (prev) =>
        prev?.map((a) => (a.id === app.id ? { ...a, currentStageIndex: newIndex } : a))
      );

      toast.success(`${app.id} moved to "${newStatus}"`, {
        description: result.email?.success
          ? "Email sent."
          : result.email?.configured === false
            ? "Email not sent — RESEND_API_KEY isn't configured."
            : "Email failed to send.",
      });

      if (result.sms) {
        toast.message("Mock SMS generated (demo)", {
          icon: <MessageSquareText className="size-4" />,
          description: result.sms.message,
        });
      }
    } catch {
      toast.error("Could not reach the server.");
    } finally {
      setUpdating(null);
    }
  }

  if (loading || !user) {
    return <div className="py-24 text-center text-text-secondary">Loading…</div>;
  }

  if (!user.isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center sm:px-6">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-danger/10">
          <ShieldAlert className="size-7 text-danger" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-text-primary">Access Denied</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Your account ({user.email}) doesn&apos;t have admin access. If you believe this is a
          mistake, contact whoever manages this ATMIS deployment.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-2.5">
        <div className="flex size-10 items-center justify-center rounded-xl bg-secondary-light">
          <ShieldCheck className="size-5 text-secondary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary sm:text-2xl">Admin Review Queue</h1>
          <p className="text-sm text-text-secondary">
            Backed by a real Supabase table — status changes persist and trigger email + mock SMS.
          </p>
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-16 text-sm text-text-secondary">
              <Loader2 className="size-4 animate-spin" /> Loading applications…
            </div>
          )}

          {isError && (
            <div className="p-6 text-sm text-danger">
              Could not load applications. Check that Supabase environment variables are configured.
            </div>
          )}

          {queue && queue.length === 0 && (
            <div className="p-8 text-center text-sm text-text-secondary">
              No applications yet. Submit one through the Apply flow to see it here.
            </div>
          )}

          {queue && queue.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead>
                  <tr className="border-b border-border bg-bg text-left text-xs font-semibold uppercase tracking-wide text-text-secondary">
                    <th className="px-5 py-3">
                      <span className="flex items-center gap-1">Request ID <ArrowUpDown className="size-3" /></span>
                    </th>
                    <th className="px-5 py-3">Applicant</th>
                    <th className="px-5 py-3">Province</th>
                    <th className="px-5 py-3">Device</th>
                    <th className="px-5 py-3">Submitted</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Change Status</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.map((app) => (
                    <tr key={app.id} className="border-b border-border last:border-0 hover:bg-bg/60">
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-text-primary">{app.id}</td>
                      <td className="px-5 py-3.5 font-medium text-text-primary">{app.fullName}</td>
                      <td className="px-5 py-3.5 text-text-secondary">{app.province}</td>
                      <td className="px-5 py-3.5 text-text-secondary">
                        {DEVICE_TYPES.find((d) => d.value === app.deviceType)?.label ?? app.deviceType}
                      </td>
                      <td className="px-5 py-3.5 text-text-secondary">{app.submittedAt}</td>
                      <td className="px-5 py-3.5">
                        <Badge variant={statusVariant(app.currentStageIndex)}>
                          {TIMELINE_STAGES[app.currentStageIndex]}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Select
                          value={String(app.currentStageIndex)}
                          onValueChange={(v) => handleStatusChange(app, Number(v))}
                          disabled={updating === app.id}
                        >
                          <SelectTrigger className="ml-auto h-9 w-[180px] text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {TIMELINE_STAGES.map((stage, i) => (
                              <SelectItem key={stage} value={String(i)}>{stage}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="mt-4 text-xs text-text-secondary">
        Gated by a real is_admin flag checked both here and server-side on every API call — not
        just a UI-level check. Data is real (Supabase), persisted across refreshes.
      </p>
    </div>
  );
}
