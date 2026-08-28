import Link from "next/link";
import { Accessibility, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Accessibility className="size-4.5 text-white" strokeWidth={2.3} />
            </div>
            <span className="text-[15px] font-bold text-text-primary">ATMIS</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-text-secondary">
            Assistive Technology Management Information System — connecting persons with
            disabilities across Pakistan to the devices they need.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-text-primary">Services</h4>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li><Link href="/apply" className="hover:text-primary">Apply for a Device</Link></li>
            <li><Link href="/track" className="hover:text-primary">Track Application</Link></li>
            <li><Link href="/dashboard" className="hover:text-primary">Applicant Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-text-primary">Quick Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-text-secondary">
            <li><Link href="/#eligibility" className="hover:text-primary">Eligibility Criteria</Link></li>
            <li><Link href="/#documents" className="hover:text-primary">Required Documents</Link></li>
            <li><Link href="/#faq" className="hover:text-primary">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-text-primary">Contact Us</h4>
          <ul className="mt-3 space-y-2.5 text-sm text-text-secondary">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              Opposite PHA Housing Society, Near Northern Bypass, Sufaid Sang Road, Peshawar
            </li>
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" /> +92 336 9313484
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-primary" /> atmispk@gmail.com
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-text-secondary">
        © 2026 ATMIS.PK — All rights reserved. Prototype for evaluation purposes.
      </div>
    </footer>
  );
}
