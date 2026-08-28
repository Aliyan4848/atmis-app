"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWizard } from "@/lib/wizard-context";
import { disabilityInfoSchema, type DisabilityInfoValues } from "@/lib/validation";
import { DISABILITY_TYPES } from "@/lib/mock-data";

export function StepDisability({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { data, update } = useWizard();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DisabilityInfoValues>({
    resolver: zodResolver(disabilityInfoSchema),
    defaultValues: {
      disabilityType: data.disabilityType,
      disabilityPercentage: data.disabilityPercentage,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      medicalNotes: data.medicalNotes,
    },
  });

  const disabilityType = watch("disabilityType");

  function onSubmit(values: DisabilityInfoValues) {
    update(values);
    onNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="disabilityType">Disability Type *</Label>
          <Select
            value={disabilityType}
            onValueChange={(v) => setValue("disabilityType", v, { shouldValidate: true })}
          >
            <SelectTrigger id="disabilityType" aria-invalid={!!errors.disabilityType}>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {DISABILITY_TYPES.map((d) => (
                <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.disabilityType && <p className="mt-1.5 text-xs font-medium text-danger">{errors.disabilityType.message}</p>}
        </div>

        <div>
          <Label htmlFor="disabilityPercentage">Disability Percentage *</Label>
          <Input
            id="disabilityPercentage"
            type="number"
            min={1}
            max={100}
            placeholder="e.g. 60"
            aria-invalid={!!errors.disabilityPercentage}
            {...register("disabilityPercentage", { valueAsNumber: true })}
          />
          {errors.disabilityPercentage ? (
            <p className="mt-1.5 text-xs font-medium text-danger">{errors.disabilityPercentage.message}</p>
          ) : (
            <p className="mt-1.5 text-xs text-text-secondary">As stated on your medical certificate</p>
          )}
        </div>

        <div>
          <Label htmlFor="guardianName">Guardian Name (if applicable)</Label>
          <Input id="guardianName" placeholder="Optional" {...register("guardianName")} />
        </div>

        <div>
          <Label htmlFor="guardianPhone">Guardian Phone (if applicable)</Label>
          <Input id="guardianPhone" placeholder="0300-1234567" aria-invalid={!!errors.guardianPhone} {...register("guardianPhone")} />
          {errors.guardianPhone && <p className="mt-1.5 text-xs font-medium text-danger">{errors.guardianPhone.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="medicalNotes">Additional Medical Notes</Label>
          <Textarea
            id="medicalNotes"
            placeholder="Any additional context that would help the assessment (optional)"
            {...register("medicalNotes")}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="size-4" /> Back
        </Button>
        <Button type="submit">
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
