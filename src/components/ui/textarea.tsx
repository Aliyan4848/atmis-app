import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[90px] w-full rounded-lg border-1.5 border-border bg-card px-3.5 py-2.5 text-[15px] text-text-primary placeholder:text-text-secondary/70 shadow-xs transition-colors outline-none",
        "focus-visible:border-secondary focus-visible:ring-4 focus-visible:ring-secondary/12",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
