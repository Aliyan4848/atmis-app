"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Armchair, Gauge, Bike, PersonStanding, ArrowUpFromLine, Ellipsis } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useWizard } from "@/lib/wizard-context";
import { deviceSelectionSchema, type DeviceSelectionValues } from "@/lib/validation";
import { DEVICE_TYPES } from "@/lib/mock-data";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "manual-wheelchair": Armchair,
  "power-wheelchair": Gauge,
  scooter: Bike,
  rollator: PersonStanding,
  lift: ArrowUpFromLine,
  other: Ellipsis,
};

export function StepDevice({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { data, update } = useWizard();

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<DeviceSelectionValues>({
    resolver: zodResolver(deviceSelectionSchema),
    defaultValues: { deviceType: data.deviceType, reason: data.reason },
  });

  const deviceType = watch("deviceType");

  function onSubmit(values: DeviceSelectionValues) {
    update(values);
    onNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Label>Which device do you need? *</Label>
      <div className="grid gap-3 sm:grid-cols-3">
        {DEVICE_TYPES.map((d) => {
          const Icon = ICONS[d.value];
          const selected = deviceType === d.value;
          return (
            <button
              key={d.value}
              type="button"
              onClick={() => setValue("deviceType", d.value, { shouldValidate: true })}
              className={cn(
                "flex flex-col items-center gap-2.5 rounded-xl border-2 p-4 text-center transition-colors",
                selected ? "border-primary bg-primary-light" : "border-border bg-card hover:border-primary/40"
              )}
              aria-pressed={selected}
            >
              <Icon className={cn("size-7", selected ? "text-primary" : "text-text-secondary")} />
              <span className={cn("text-sm font-semibold", selected ? "text-primary-dark" : "text-text-primary")}>
                {d.label}
              </span>
            </button>
          );
        })}
      </div>
      {errors.deviceType && <p className="mt-2 text-xs font-medium text-danger">{errors.deviceType.message}</p>}

      <div className="mt-6">
        <Label htmlFor="reason">Tell us why you need this device *</Label>
        <Textarea
          id="reason"
          placeholder="Describe your daily mobility needs, current challenges, and how this device would help (min. 20 characters)"
          aria-invalid={!!errors.reason}
          {...register("reason")}
        />
        {errors.reason && <p className="mt-1.5 text-xs font-medium text-danger">{errors.reason.message}</p>}
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
