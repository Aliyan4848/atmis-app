export const PROVINCES = [
  {
    name: "Khyber Pakhtunkhwa",
    districts: {
      Peshawar: ["Peshawar City", "Peshawar Cantt", "Chamkani"],
      Mardan: ["Mardan City", "Takht Bhai", "Katlang"],
      Abbottabad: ["Abbottabad City", "Havelian"],
    },
  },
  {
    name: "Punjab",
    districts: {
      Lahore: ["Lahore Cantt", "Model Town", "Shalimar"],
      Rawalpindi: ["Rawalpindi City", "Taxila"],
      Multan: ["Multan City", "Shujabad"],
    },
  },
  {
    name: "Sindh",
    districts: {
      Karachi: ["Karachi Central", "Karachi East", "Karachi South"],
      Hyderabad: ["Hyderabad City", "Latifabad"],
    },
  },
  {
    name: "Balochistan",
    districts: {
      Quetta: ["Quetta City", "Sariab"],
      Gwadar: ["Gwadar City"],
    },
  },
] as const;

export type ProvinceName = (typeof PROVINCES)[number]["name"];

export const DEVICE_TYPES = [
  { value: "manual-wheelchair", label: "Manual Wheelchair" },
  { value: "power-wheelchair", label: "Power Wheelchair" },
  { value: "scooter", label: "Mobility Scooter" },
  { value: "rollator", label: "Rollator" },
  { value: "lift", label: "Patient Lift" },
  { value: "other", label: "Other Assistive Device" },
] as const;

export const DISABILITY_TYPES = [
  { value: "physical", label: "Physical / Mobility Impairment" },
  { value: "cerebral-palsy", label: "Cerebral Palsy" },
  { value: "spinal-cord-injury", label: "Spinal Cord Injury" },
  { value: "amputation", label: "Amputation" },
  { value: "polio", label: "Polio" },
  { value: "stroke", label: "Stroke-related Impairment" },
  { value: "other", label: "Other" },
] as const;

export const TIMELINE_STAGES = [
  "Submitted",
  "Documents Verified",
  "Regional Review",
  "Pending Approval",
  "Approved",
  "Device Assigned",
  "Dispatched",
  "Completed",
] as const;

export type TimelineStage = (typeof TIMELINE_STAGES)[number];

export type TimelineEvent = {
  stage: TimelineStage;
  date: string;
  officer: string;
  remarks: string;
  status: "done" | "current" | "upcoming";
};

export type Application = {
  id: string;
  fullName: string;
  fatherName: string;
  cnic: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  disabilityType: string;
  deviceType: string;
  currentStageIndex: number;
  submittedAt: string;
};

// ---- in-memory "database" seeded with a few demo records so Track works out of the box ----
export const SEED_APPLICATIONS: Application[] = [
  {
    id: "ATMIS-2026-48213",
    fullName: "Ayesha Bibi",
    fatherName: "Muhammad Sharif",
    cnic: "17301-1234567-1",
    phone: "0300-1234567",
    email: "ayesha.demo@example.com",
    province: "Khyber Pakhtunkhwa",
    district: "Peshawar",
    disabilityType: "physical",
    deviceType: "manual-wheelchair",
    currentStageIndex: 4,
    submittedAt: "2026-07-14",
  },
  {
    id: "ATMIS-2026-48099",
    fullName: "Bilal Ahmed",
    fatherName: "Ghulam Rasool",
    cnic: "17301-7654321-3",
    phone: "0333-9876543",
    email: "bilal.demo@example.com",
    province: "Punjab",
    district: "Lahore",
    disabilityType: "spinal-cord-injury",
    deviceType: "power-wheelchair",
    currentStageIndex: 7,
    submittedAt: "2026-06-02",
  },
];

export function buildTimeline(currentStageIndex: number): TimelineEvent[] {
  const officers = [
    "Front Desk — Peshawar DRC",
    "Verification Officer, S. Khan",
    "Regional Coordinator, KP",
    "Approvals Committee",
    "Program Director",
    "Vendor Allocation Desk",
    "Logistics — Northern Bypass Hub",
    "Field Officer, confirmed delivery",
  ];
  const remarksByStage: Record<number, string> = {
    0: "Application received and Request ID issued.",
    1: "CNIC and disability certificate verified against submitted documents.",
    2: "Assessment reviewed by regional disability office.",
    3: "Awaiting sign-off from approvals committee.",
    4: "Application approved for device provision.",
    5: "Device matched to applicant's measurements and needs.",
    6: "Device handed to delivery partner.",
    7: "Device delivered and confirmed received by applicant.",
  };

  return TIMELINE_STAGES.map((stage, i) => ({
    stage,
    date: i <= currentStageIndex ? shiftDate(i) : "",
    officer: i <= currentStageIndex ? officers[i] : "",
    remarks: i <= currentStageIndex ? remarksByStage[i] : "Not yet reached.",
    status: i < currentStageIndex ? "done" : i === currentStageIndex ? "current" : "upcoming",
  }));
}

function shiftDate(daysAgoFromBase: number) {
  const base = new Date("2026-07-14");
  base.setDate(base.getDate() - (7 - daysAgoFromBase) * 2);
  return base.toISOString().slice(0, 10);
}

export function genApplicationId() {
  const n = Math.floor(10000 + Math.random() * 89999);
  return `ATMIS-2026-${n}`;
}
