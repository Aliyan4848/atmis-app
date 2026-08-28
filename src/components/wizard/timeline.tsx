import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TimelineEvent } from "@/lib/mock-data";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative">
      {events.map((e, i) => (
        <li key={e.stage} className="relative flex gap-4 pb-8 last:pb-0">
          {i < events.length - 1 && (
            <span
              className={cn(
                "absolute left-[15px] top-8 h-full w-0.5",
                e.status === "done" ? "bg-primary" : "bg-border"
              )}
            />
          )}
          <span
            className={cn(
              "z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2",
              e.status === "done" && "border-primary bg-primary text-white",
              e.status === "current" && "border-primary bg-white text-primary ring-4 ring-primary/15",
              e.status === "upcoming" && "border-border bg-card text-text-secondary"
            )}
          >
            {e.status === "done" ? <Check className="size-4" strokeWidth={3} /> : <Circle className="size-2.5 fill-current" />}
          </span>
          <div className="min-w-0 flex-1 pt-0.5">
            <div className="flex flex-wrap items-center gap-2">
              <h4
                className={cn(
                  "font-semibold",
                  e.status === "upcoming" ? "text-text-secondary" : "text-text-primary"
                )}
              >
                {e.stage}
              </h4>
              {e.status === "current" && (
                <span className="rounded-full bg-warning/14 px-2 py-0.5 text-[11px] font-bold text-warning">
                  IN PROGRESS
                </span>
              )}
            </div>
            {e.date && (
              <p className="mt-0.5 text-xs font-medium text-text-secondary">
                {e.date} · {e.officer}
              </p>
            )}
            <p className={cn("mt-1 text-sm", e.status === "upcoming" ? "text-text-secondary/70 italic" : "text-text-secondary")}>
              {e.remarks}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
