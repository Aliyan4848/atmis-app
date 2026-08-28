import Link from "next/link";
import {
  Bell, FileCheck2, User, Search, Plus, Download, CheckCircle2,
  Clock, ArrowRight, Fingerprint,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SEED_APPLICATIONS, TIMELINE_STAGES } from "@/lib/mock-data";

const NOTIFICATIONS = [
  { id: 1, unread: true, text: "Your application ATMIS-2026-48213 has been approved for device provision.", time: "2 days ago" },
  { id: 2, unread: true, text: "Regional review completed — moving to approvals committee.", time: "5 days ago" },
  { id: 3, unread: false, text: "Documents verified successfully. No action needed.", time: "1 week ago" },
  { id: 4, unread: false, text: "Application received. Request ID: ATMIS-2026-48213.", time: "2 weeks ago" },
];

const PROFILE_ITEMS = [
  { label: "Personal information", done: true },
  { label: "Disability certificate uploaded", done: true },
  { label: "CNIC verified", done: true },
  { label: "Guardian contact added", done: false },
];

export default function DashboardPage() {
  const application = SEED_APPLICATIONS[0];
  const unreadCount = NOTIFICATIONS.filter((n) => n.unread).length;
  const profileCompletion = Math.round(
    (PROFILE_ITEMS.filter((p) => p.done).length / PROFILE_ITEMS.length) * 100
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Welcome back, Ayesha</h1>
          <p className="mt-1 text-sm text-text-secondary">Here&apos;s what&apos;s happening with your application.</p>
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

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Application status — spans 2 cols */}
        <Card className="lg:col-span-2">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-text-primary">Application Status</h2>
              <Badge variant="secondary">{TIMELINE_STAGES[application.currentStageIndex]}</Badge>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl bg-bg p-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Request ID</span>
                <p className="font-mono text-lg font-bold text-text-primary">{application.id}</p>
              </div>
              <Button size="sm" variant="outline" asChild>
                <Link href={`/track?id=${application.id}`}>
                  View Timeline <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
            <div className="mt-5">
              <div className="flex justify-between text-xs font-semibold text-text-secondary">
                <span>Progress</span>
                <span>{Math.round((application.currentStageIndex / (TIMELINE_STAGES.length - 1)) * 100)}%</span>
              </div>
              <Progress value={(application.currentStageIndex / (TIMELINE_STAGES.length - 1)) * 100} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        {/* Profile completion */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <User className="size-4.5 text-secondary" />
              <h2 className="font-semibold text-text-primary">Profile Completion</h2>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <span className="text-2xl font-bold text-text-primary">{profileCompletion}%</span>
              <Progress value={profileCompletion} className="flex-1" />
            </div>
            <ul className="mt-4 space-y-2">
              {PROFILE_ITEMS.map((item) => (
                <li key={item.label} className="flex items-center gap-2 text-sm">
                  <CheckCircle2
                    className={`size-4 shrink-0 ${item.done ? "text-success" : "text-border"}`}
                  />
                  <span className={item.done ? "text-text-primary" : "text-text-secondary"}>{item.label}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="size-4.5 text-secondary" />
                <h2 className="font-semibold text-text-primary">Notifications</h2>
              </div>
              {unreadCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-danger text-[11px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </div>
            <ul className="mt-4 space-y-3.5">
              {NOTIFICATIONS.map((n) => (
                <li key={n.id} className="flex gap-2.5">
                  <span
                    className={`mt-1.5 size-1.5 shrink-0 rounded-full ${n.unread ? "bg-secondary" : "bg-border"}`}
                  />
                  <div>
                    <p className={`text-[13px] leading-snug ${n.unread ? "font-medium text-text-primary" : "text-text-secondary"}`}>
                      {n.text}
                    </p>
                    <span className="flex items-center gap-1 text-[11px] text-text-secondary">
                      <Clock className="size-3" /> {n.time}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Documents */}
        <Card className="lg:col-span-2">
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <FileCheck2 className="size-4.5 text-secondary" />
              <h2 className="font-semibold text-text-primary">Uploaded Documents</h2>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { name: "CNIC-copy.pdf", verified: true },
                { name: "medical-certificate.pdf", verified: true },
              ].map((doc) => (
                <div key={doc.name} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Fingerprint className="size-4.5 shrink-0 text-primary" />
                    <span className="truncate text-sm font-medium text-text-primary">{doc.name}</span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {doc.verified && <Badge variant="success">Verified</Badge>}
                    <button className="rounded-md p-1.5 text-text-secondary hover:bg-black/5" aria-label={`Download ${doc.name}`}>
                      <Download className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
