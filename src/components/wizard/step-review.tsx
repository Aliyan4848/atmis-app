"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Loader2, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useWizard } from "@/lib/wizard-context";
import { DEVICE_TYPES, DISABILITY_TYPES } from "@/lib/mock-data";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2 text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className="text-right font-medium text-text-primary">{value || "—"}</span>
    </div>
  );
}

function Section({
  title,
  stepIndex,
  onEdit,
  children,
}: {
  title: string;
  stepIndex: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-text-primary">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(stepIndex)}
          className="flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
        >
          <Pencil className="size-3.5" /> Edit
        </button>
      </div>
      <div className="mt-1 divide-y divide-border">{children}</div>
    </div>
  );
}

export function StepReview({ onBack, onEdit }: { onBack: () => void; onEdit: (step: number) => void }) {
  const { data, reset } = useWizard();
  const router = useRouter();

  const [confirmed, setConfirmed] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [duplicate, setDuplicate] = React.useState<{ id: string; fullName: string } | null>(null);
  const [confirmError, setConfirmError] = React.useState("");

  const deviceLabel = DEVICE_TYPES.find((d) => d.value === data.deviceType)?.label ?? data.deviceType;
  const disabilityLabel = DISABILITY_TYPES.find((d) => d.value === data.disabilityType)?.label ?? data.disabilityType;

  async function handleSubmit() {
    if (!confirmed) {
      setConfirmError("Please confirm the information is accurate before submitting.");
      return;
    }
    setConfirmError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.fullName,
          fatherName: data.fatherName,
          cnic: data.cnic,
          phone: data.phone,
          email: data.email,
          province: data.province,
          district: data.district,
          tehsil: data.tehsil,
          address: data.address,
          disabilityType: data.disabilityType,
          disabilityPercentage: data.disabilityPercentage,
          deviceType: data.deviceType,
          reason: data.reason,
          cnicDocName: data.cnicDocName,
          medicalCertName: data.medicalCertName,
        }),
      });
      const result = await res.json();

      if (!result.success && result.duplicate) {
        setDuplicate(result.duplicate);
        setSubmitting(false);
        return;
      }
      if (!result.success) {
        setConfirmError(result.error ?? "Something went wrong submitting your application. Please try again.");
        setSubmitting(false);
        return;
      }

      reset();
      router.push(`/apply/success?id=${result.id}`);
    } catch {
      setConfirmError("Could not reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="space-y-4">
        <Section title="Personal Information" stepIndex={0} onEdit={onEdit}>
          <Row label="Full Name" value={data.fullName} />
          <Row label="Father's Name" value={data.fatherName} />
          <Row label="CNIC" value={data.cnic} />
          <Row label="Date of Birth" value={data.dob} />
          <Row label="Gender" value={data.gender} />
          <Row label="Phone" value={data.phone} />
          <Row label="Email" value={data.email} />
        </Section>

        <Section title="Disability Information" stepIndex={1} onEdit={onEdit}>
          <Row label="Type" value={disabilityLabel} />
          <Row label="Percentage" value={data.disabilityPercentage ? `${data.disabilityPercentage}%` : ""} />
          <Row label="Guardian" value={data.guardianName} />
        </Section>

        <Section title="Address" stepIndex={2} onEdit={onEdit}>
          <Row label="Province" value={data.province} />
          <Row label="District" value={data.district} />
          <Row label="Tehsil" value={data.tehsil} />
          <Row label="Address" value={data.address} />
        </Section>

        <Section title="Device Selection" stepIndex={3} onEdit={onEdit}>
          <Row label="Device" value={deviceLabel} />
          <Row label="Reason" value={data.reason} />
        </Section>

        <Section title="Documents" stepIndex={4} onEdit={onEdit}>
          <Row label="CNIC / B-Form" value={data.cnicDocName} />
          <Row label="Medical Certificate" value={data.medicalCertName} />
        </Section>
      </div>

      {duplicate && (
        <div className="mt-6 rounded-xl border border-danger/30 bg-danger/8 p-4">
          <div className="flex items-center gap-2 text-sm font-bold text-danger">
            <ShieldAlert className="size-4.5" /> Possible duplicate application
          </div>
          <p className="mt-1.5 text-sm text-text-primary">
            An existing application already matches this CNIC, phone number, or email address:
          </p>
          <p className="mt-1 font-mono text-sm font-semibold text-text-primary">
            {duplicate.id} — {duplicate.fullName}
          </p>
          <p className="mt-1.5 text-xs text-text-secondary">
            If this is you, please use the Track Application page instead of submitting again.
            If you believe this is an error, contact the DRC listed in the footer.
          </p>
        </div>
      )}

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-border bg-bg p-4">
        <Checkbox
          id="confirm"
          checked={confirmed}
          onCheckedChange={(v) => setConfirmed(v === true)}
          className="mt-0.5"
        />
        <label htmlFor="confirm" className="text-sm text-text-primary">
          I confirm that the information provided above is accurate to the best of my knowledge,
          and I understand that false information may delay or invalidate my application.
        </label>
      </div>
      {confirmError && <p className="mt-2 text-xs font-medium text-danger">{confirmError}</p>}

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="outline" onClick={onBack} disabled={submitting}>
          <ArrowLeft className="size-4" /> Back
        </Button>
        <Button type="button" onClick={handleSubmit} disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Submitting…
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4" /> Submit Application
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
