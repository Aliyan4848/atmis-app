"use client";

import * as React from "react";

export type WizardData = {
  // Step 1 — Personal
  fullName: string;
  fatherName: string;
  cnic: string;
  dob: string;
  gender: string;
  phone: string;
  email: string;
  // Step 2 — Disability
  disabilityType: string;
  disabilityPercentage: number | undefined;
  guardianName: string;
  guardianPhone: string;
  medicalNotes: string;
  // Step 3 — Address
  province: string;
  district: string;
  tehsil: string;
  address: string;
  // Step 4 — Device
  deviceType: string;
  reason: string;
  // Step 5 — Documents (mock uploads, just filenames)
  cnicDocName: string;
  medicalCertName: string;
  // Step 6 — Review
  confirmed: boolean;
};

const emptyData: WizardData = {
  fullName: "",
  fatherName: "",
  cnic: "",
  dob: "",
  gender: "",
  phone: "",
  email: "",
  disabilityType: "",
  disabilityPercentage: undefined,
  guardianName: "",
  guardianPhone: "",
  medicalNotes: "",
  province: "",
  district: "",
  tehsil: "",
  address: "",
  deviceType: "",
  reason: "",
  cnicDocName: "",
  medicalCertName: "",
  confirmed: false,
};

const STORAGE_KEY = "atmis-wizard-draft";

type WizardContextType = {
  data: WizardData;
  update: (patch: Partial<WizardData>) => void;
  step: number;
  setStep: (n: number) => void;
  reset: () => void;
  hasDraft: boolean;
};

const WizardContext = React.createContext<WizardContextType | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<WizardData>(emptyData);
  const [step, setStep] = React.useState(0);
  const [hasDraft, setHasDraft] = React.useState(false);
  const [hydrated, setHydrated] = React.useState(false);

  // load draft on mount
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setData(parsed.data ?? emptyData);
        setStep(parsed.step ?? 0);
        setHasDraft(true);
      }
    } catch {
      // ignore corrupted draft
    }
    setHydrated(true);
  }, []);

  // persist on change
  React.useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, step }));
    } catch {
      // storage unavailable — draft simply won't persist
    }
  }, [data, step, hydrated]);

  const update = React.useCallback((patch: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const reset = React.useCallback(() => {
    setData(emptyData);
    setStep(0);
    setHasDraft(false);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  return (
    <WizardContext.Provider value={{ data, update, step, setStep, reset, hasDraft }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = React.useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}
