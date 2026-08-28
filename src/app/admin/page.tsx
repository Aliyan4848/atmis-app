"use client";

import * as React from "react";
import { toast } from "sonner";
import { ShieldCheck, ArrowUpDown, MessageSquareText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SEED_APPLICATIONS, TIMELINE_STAGES, DEVICE_TYPES } from "@/lib/mock-data";

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

const INITIAL_QUEUE: QueueApp[] = [
  ...SEED_APPLICATIONS.map((a) => ({
    id: a.id, fullName: a.fullName, cnic: a.cnic, phone: a.phone, email: a.email,
    province: a.province, deviceType: a.deviceType, currentStageIndex: a.currentStageIndex,
    submittedAt: a.submittedAt,
  })),
  {
    id: "ATMIS-2026-48301", fullName: "Sana Malik", cnic: "42101-1122334-5", phone: "0321-4455667",
    email: "sana.malik.demo@example.com", province: "Sindh", deviceType: "rollator",
    currentStageIndex: 1, submittedAt: "2026-08-01",
  },
  {
    id: "ATMIS-2026-48287", fullName: "Usman Tariq", cnic: "35202-9988776-2", phone: "0345-1122334",
    email: "usman.tariq.demo@example.com", province: "Balochistan", deviceType: "power-wheelchair",
    currentStageIndex: 0, submittedAt: "2026-08-05",
  },
];

function statusVariant(stageIndex: number): "warning" | "secondary" | "success" {
  if (stageIndex >= TIMELINE_STAGES.length - 1) return "success";
  if (stageIndex <= 1) return "warning";
  return "secondary";
}

export default function AdminPage() {
  const [queue, setQueue] = React.useState<QueueApp[]>(INITIAL_QUEUE);
  const [updating, setUpdating] = React.useState<string | null>(null);

  async function handleStatusChange(app: QueueApp, newIndex: number) {
    if (newIndex === app.currentStageIndex) return;
    const previousStatus = TIMELINE_STAGES[app.currentStageIndex];
    const newStatus = TIMELINE_STAGES[newIndex];

    setUpdating(app.id);
    setQueue((prev) => prev.map((a) => (a.id === app.id ? { ...a, currentStageIndex: newIndex } : a)));

    try {
      const res = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "status-change",
          application: { id: app.id, fullName: app.fullName, email: app.email, phone: app.phone },
          previousStatus,
          newStatus,
        }),
      });
      const result = await res.json();

      toast.success(`${app.id} moved to "${newStatus}"`, {
        description: result.email?.success
          ? "Email sent."
          : result.email?.configured === false
            ? "Email not sent — RESEND_API_KEY isn't configured (expected in this prototype)."
            : "Email failed to send.",
      });

      if (result.sms) {
        toast.message("Mock SMS generated (demo)", {
          icon: <MessageSquareText className="size-4" />,
          description: result.sms.message,
        });
      }
    } catch {
      toast.error("Could not reach the notification service.");
    } finally {
      setUpdating(null);
    }
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
            Change a status to trigger a real email attempt + a mock SMS — no real backend or auth here.
          </p>
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="p-0">
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
        </CardContent>
      </Card>

      <p className="mt-4 text-xs text-text-secondary">
        Preview only — this queue is not connected to a real backend or authentication. Status
        changes here update in-memory state and attempt a real email (via Resend, if configured)
        plus a mock SMS log entry — nothing is written to a database.
      </p>
    </div>
  );
}
