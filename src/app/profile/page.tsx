"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, MapPin, Phone, Mail, Fingerprint, Plus, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

function Row({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-border py-3 last:border-0">
      <Icon className="size-4.5 shrink-0 text-primary" />
      <div>
        <div className="text-xs font-semibold uppercase tracking-wide text-text-secondary">{label}</div>
        <div className="text-sm font-medium text-text-primary">{value}</div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="py-24 text-center text-text-secondary">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary-light text-lg font-bold text-primary-dark">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-xl font-bold text-text-primary">{user.fullName}</h1>
          <p className="text-sm text-text-secondary">Applicant Profile</p>
        </div>
      </div>

      <Card className="mt-6">
        <CardContent className="p-5 sm:p-6">
          <Row icon={Fingerprint} label="CNIC" value={user.cnic} />
          <Row icon={Phone} label="Phone" value={user.phone} />
          <Row icon={Mail} label="Email" value={user.email} />
          <Row icon={MapPin} label="Location" value={`${user.district}, ${user.province}`} />
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button asChild>
          <Link href="/apply"><Plus className="size-4" /> New Application</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/track"><Search className="size-4" /> Track Application</Link>
        </Button>
      </div>

      <button
        onClick={async () => {
          await logout();
          router.push("/");
        }}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-border py-2.5 text-sm font-semibold text-danger hover:bg-danger/5"
      >
        <LogOut className="size-4" /> Log Out
      </button>
    </div>
  );
}
