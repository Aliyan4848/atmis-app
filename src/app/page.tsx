import Link from "next/link";
import {
  Accessibility, ArrowRight, Search, ShieldCheck, MapPinned, Clock,
  FileCheck2, Fingerprint, Bike, PersonStanding, Armchair, Gauge,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Faq } from "@/components/faq";

const DEVICES = [
  { icon: Armchair, name: "Manual Wheelchair", desc: "Everyday mobility support, fitted to your measurements." },
  { icon: Gauge, name: "Power Wheelchair", desc: "Motorized mobility for greater independence." },
  { icon: Bike, name: "Mobility Scooter", desc: "For longer distances and outdoor use." },
  { icon: PersonStanding, name: "Rollator", desc: "Walking support with seating and storage." },
];

const BENEFITS = [
  { icon: ShieldCheck, title: "Transparent Process", desc: "Every step of your application is visible — no guesswork, no middlemen." },
  { icon: MapPinned, title: "Nationwide Support", desc: "Regional application portals for KP, Punjab, Sindh, and Balochistan." },
  { icon: Clock, title: "Track in Real Time", desc: "Follow your request from submission through delivery with a live timeline." },
  { icon: Fingerprint, title: "Secure & Verified", desc: "Your CNIC and medical certificate are verified before approval." },
];

const ELIGIBILITY = [
  "Pakistani citizen with a valid CNIC or B-Form",
  "Documented physical or mobility-related disability",
  "Medical or disability certificate from a recognized authority",
  "Resident of a province currently covered by ATMIS (KP, Punjab, Sindh, Balochistan)",
];

const DOCUMENTS = [
  { icon: Fingerprint, label: "CNIC or B-Form copy" },
  { icon: FileCheck2, label: "Medical / disability certificate" },
  { icon: Accessibility, label: "Passport-size photograph" },
  { icon: ShieldCheck, label: "Guardian ID (if applicant is a minor)" },
];

export default function Home() {
  return (
    <div>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light to-bg">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-card px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-primary shadow-sm">
              <Accessibility className="size-3.5" /> Government-backed · Free for eligible applicants
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] text-text-primary sm:text-5xl">
              Mobility support,{" "}
              <span className="text-primary">delivered with dignity.</span>
            </h1>
            <p className="mt-5 max-w-md text-[15.5px] leading-relaxed text-text-secondary">
              ATMIS connects persons with disabilities across Pakistan to wheelchairs and
              assistive devices — through a professional needs assessment, transparent
              tracking, and nationwide vendor delivery.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/apply">
                  Apply Now <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/track">
                  <Search className="size-4" /> Track Application
                </Link>
              </Button>
            </div>
            <a href="#eligibility" className="mt-4 inline-block text-sm font-semibold text-secondary hover:underline">
              Check eligibility criteria →
            </a>
          </div>

          <div className="relative mx-auto w-full max-w-sm animate-fade-in">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-primary/10 blur-2xl" />
            <div className="rounded-[1.75rem] border border-border bg-card p-6 shadow-xl">
              <div className="flex items-center justify-center rounded-2xl bg-primary-light py-10">
                <Accessibility className="size-24 text-primary" strokeWidth={1.4} />
              </div>
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-bg px-3.5 py-2.5">
                  <span className="text-xs font-semibold text-text-secondary">Request ID</span>
                  <span className="font-mono text-xs font-bold text-text-primary">ATMIS-2026-48213</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-bg px-3.5 py-2.5">
                  <span className="text-xs font-semibold text-text-secondary">Status</span>
                  <span className="rounded-full bg-success/12 px-2.5 py-0.5 text-xs font-bold text-success">Approved</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- DEVICES ---------------- */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Devices we support</h2>
        <p className="mt-2 max-w-lg text-text-secondary">
          Every applicant receives a professional assessment to match the right device to their needs.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DEVICES.map((d) => (
            <Card key={d.name} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary-light">
                  <d.icon className="size-5.5 text-primary" strokeWidth={2} />
                </div>
                <h3 className="mt-4 font-semibold text-text-primary">{d.name}</h3>
                <p className="mt-1 text-sm text-text-secondary">{d.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------------- BENEFITS ---------------- */}
      <section className="bg-secondary-light/50 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Why apply through ATMIS?</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BENEFITS.map((b) => (
              <div key={b.title}>
                <div className="flex size-11 items-center justify-center rounded-xl bg-secondary text-white">
                  <b.icon className="size-5.5" strokeWidth={2} />
                </div>
                <h3 className="mt-4 font-semibold text-text-primary">{b.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- ELIGIBILITY ---------------- */}
      <section id="eligibility" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Eligibility criteria</h2>
            <p className="mt-2 text-text-secondary">
              ATMIS is open to applicants who meet the following requirements.
            </p>
            <ul className="mt-6 space-y-3">
              {ELIGIBILITY.map((e) => (
                <li key={e} className="flex items-start gap-3 text-[15px] text-text-primary">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" />
                  {e}
                </li>
              ))}
            </ul>
          </div>

          <div id="documents">
            <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Required documents</h2>
            <p className="mt-2 text-text-secondary">
              Have these ready before starting your application — you&apos;ll upload them in step 5.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {DOCUMENTS.map((d) => (
                <div key={d.label} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                  <d.icon className="size-5 shrink-0 text-secondary" />
                  <span className="text-sm font-medium text-text-primary">{d.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section id="faq" className="bg-primary-light/40 py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 className="text-center text-2xl font-bold text-text-primary sm:text-3xl">
            Frequently asked questions
          </h2>
          <Faq />
        </div>
      </section>

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="bg-primary p-8 text-white sm:p-10">
              <h2 className="text-2xl font-bold">Need help applying?</h2>
              <p className="mt-2 text-white/85">
                Our team at the Peshawar Disability Resource Centre can walk you through the
                process, in person or by phone.
              </p>
              <div className="mt-6 space-y-2 text-sm">
                <div>📍 Opposite PHA Housing Society, Near Northern Bypass, Peshawar</div>
                <div>📞 +92 336 9313484</div>
                <div>✉️ atmispk@gmail.com</div>
              </div>
            </div>
            <div className="p-8 sm:p-10">
              <h3 className="font-semibold text-text-primary">Ready to start?</h3>
              <p className="mt-2 text-sm text-text-secondary">
                The application takes about 10–15 minutes and can be saved and resumed at any time.
              </p>
              <Button className="mt-5 w-full" size="lg" asChild>
                <Link href="/apply">Start Application <ArrowRight className="size-4" /></Link>
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
