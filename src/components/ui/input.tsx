import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-lg border-1.5 border-border bg-card px-3.5 py-2 text-[15px] text-text-primary placeholder:text-text-secondary/70 shadow-xs transition-colors outline-none",
        "focus-visible:border-secondary focus-visible:ring-4 focus-visible:ring-secondary/12",
        "aria-invalid:border-danger aria-invalid:ring-4 aria-invalid:ring-danger/10",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
