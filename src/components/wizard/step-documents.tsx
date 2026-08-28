"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWizard } from "@/lib/wizard-context";
import { UploadField } from "@/components/wizard/upload-field";

export function StepDocuments({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { data, update } = useWizard();
  const [error, setError] = React.useState("");

  function handleContinue() {
    if (!data.cnicDocName || !data.medicalCertName) {
      setError("Both documents are required before continuing.");
      return;
    }
    setError("");
    onNext();
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2">
        <UploadField
          label="CNIC / B-Form Copy *"
          hint="JPG, PNG or PDF, up to 5MB"
          fileName={data.cnicDocName}
          onUploaded={(name) => update({ cnicDocName: name })}
          onRemoved={() => update({ cnicDocName: "" })}
          documentType="cnic"
          enteredCnic={data.cnic}
        />
        <UploadField
          label="Medical / Disability Certificate *"
          hint="JPG, PNG or PDF, up to 5MB"
          fileName={data.medicalCertName}
          onUploaded={(name) => update({ medicalCertName: name })}
          onRemoved={() => update({ medicalCertName: "" })}
          documentType="medical"
        />
      </div>

      {error && <p className="mt-4 text-sm font-medium text-danger">{error}</p>}

      <p className="mt-6 text-xs text-text-secondary">
        Documents are checked with automatic OCR verification where available. This assists
        review — it does not replace it. A human always makes the final decision on document
        authenticity. Files stay in your browser and are not permanently stored by this prototype.
      </p>

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="size-4" /> Back
        </Button>
        <Button type="button" onClick={handleContinue}>
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
