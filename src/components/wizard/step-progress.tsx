"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

const STEPS = [
  "Personal Info",
  "Disability Info",
  "Address",
  "Device Selection",
  "Documents",
  "Review",
];

export function StepProgress({ current }: { current: number }) {
  const pct = Math.round((current / (STEPS.length - 1)) * 100);

  return (
    <div>
      {/* mobile: compact progress bar + label */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
          <span>Step {current + 1} of {STEPS.length}</span>
          <span>{STEPS[current]}</span>
        </div>
        <Progress value={pct} className="mt-2" />
      </div>

      {/* desktop: full stepper */}
      <div className="hidden sm:flex sm:items-center">
        {STEPS.map((label, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div key={label} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex size-9 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                    done && "border-primary bg-primary text-white",
                    active && "border-primary bg-white text-primary ring-4 ring-primary/15",
                    !done && !active && "border-border bg-card text-text-secondary"
                  )}
                >
                  {done ? <Check className="size-4" strokeWidth={3} /> : i + 1}
                </div>
                <span
                  className={cn(
                    "w-20 text-center text-[11px] font-semibold leading-tight",
                    (done || active) ? "text-text-primary" : "text-text-secondary"
                  )}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("mx-1 h-0.5 flex-1", done ? "bg-primary" : "bg-border")} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { STEPS };
