"use client";

import * as React from "react";
import { RotateCcw, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StepProgress } from "@/components/wizard/step-progress";
import { StepPersonal } from "@/components/wizard/step-personal";
import { StepDisability } from "@/components/wizard/step-disability";
import { StepAddress } from "@/components/wizard/step-address";
import { StepDevice } from "@/components/wizard/step-device";
import { StepDocuments } from "@/components/wizard/step-documents";
import { StepReview } from "@/components/wizard/step-review";
import { useWizard } from "@/lib/wizard-context";

export default function ApplyPage() {
  const { step, setStep, hasDraft, reset } = useWizard();
  const [dismissedDraftBanner, setDismissedDraftBanner] = React.useState(false);

  function goNext() {
    setStep(Math.min(step + 1, 5));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function goBack() {
    setStep(Math.max(step - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function goTo(n: number) {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary sm:text-3xl">Apply for an Assistive Device</h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          Your progress is saved automatically — you can close this and come back later.
        </p>
      </div>

      {hasDraft && !dismissedDraftBanner && step === 0 && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-secondary/30 bg-secondary-light p-4">
          <div className="flex items-center gap-2.5 text-sm text-text-primary">
            <Info className="size-4.5 shrink-0 text-secondary" />
            Welcome back — we restored your saved draft.
          </div>
          <button
            type="button"
            onClick={() => {
              reset();
              setDismissedDraftBanner(true);
            }}
            className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-secondary hover:underline"
          >
            <RotateCcw className="size-3.5" /> Start over
          </button>
        </div>
      )}

      <Card>
        <CardContent className="p-5 sm:p-8">
          <StepProgress current={step} />

          <div className="mt-8 animate-fade-in" key={step}>
            {step === 0 && <StepPersonal onNext={goNext} />}
            {step === 1 && <StepDisability onNext={goNext} onBack={goBack} />}
            {step === 2 && <StepAddress onNext={goNext} onBack={goBack} />}
            {step === 3 && <StepDevice onNext={goNext} onBack={goBack} />}
            {step === 4 && <StepDocuments onNext={goNext} onBack={goBack} />}
            {step === 5 && <StepReview onBack={goBack} onEdit={goTo} />}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
