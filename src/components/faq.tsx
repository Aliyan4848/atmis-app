"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    q: "Is there a cost to apply for a device?",
    a: "No. Assessment and the disability certificate through ATMIS are free. If you choose the vendor bidding path, the device itself is procured through the program at no direct cost to eligible applicants.",
  },
  {
    q: "How long does the process take from application to delivery?",
    a: "Most applications move from submission to approval within 1–2 weeks, and dispatch typically follows within a further 1–3 weeks depending on vendor availability in your region.",
  },
  {
    q: "Can I apply on behalf of a family member?",
    a: "Yes. If the applicant is a minor or is unable to complete the form themselves, a guardian can fill it out on their behalf using the guardian information fields in Step 2.",
  },
  {
    q: "What happens if I don't want to go through vendor bidding?",
    a: "You can choose to receive only your assessment certificate, which you're free to take to any local provider — you are not obligated to enter the ATMIS vendor system.",
  },
  {
    q: "I don't have internet access at home — can someone else apply for me?",
    a: "Yes. Applications can be submitted at any Disability Resource Centre (DRC) with staff assistance, or by a family member/guardian on your behalf.",
  },
];

export function Faq() {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <div className="mt-8 space-y-3">
      {ITEMS.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="overflow-hidden rounded-xl border border-border bg-card">
            <button
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="text-[15px] font-semibold text-text-primary">{item.q}</span>
              <ChevronDown
                className={cn(
                  "size-5 shrink-0 text-text-secondary transition-transform duration-200",
                  isOpen && "rotate-180 text-primary"
                )}
              />
            </button>
            {isOpen && (
              <div className="animate-slide-up px-5 pb-4 text-sm leading-relaxed text-text-secondary">
                {item.a}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
