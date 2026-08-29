import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, createServerSupabase } from "@/lib/supabase/server";
import { genApplicationId } from "@/lib/mock-data";
import { notifyApplicationSubmitted } from "@/lib/notifications";

export const runtime = "nodejs";

type SubmitBody = {
  fullName: string;
  fatherName?: string;
  cnic: string;
  phone: string;
  email: string;
  province: string;
  district?: string;
  tehsil?: string;
  address?: string;
  disabilityType?: string;
  disabilityPercentage?: number;
  deviceType?: string;
  reason?: string;
  cnicDocName?: string;
  medicalCertName?: string;
};

export async function POST(req: NextRequest) {
  let body: SubmitBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Malformed request body." }, { status: 400 });
  }

  if (!body.fullName || !body.cnic || !body.phone || !body.email) {
    return NextResponse.json({ success: false, error: "Missing required fields." }, { status: 400 });
  }

  const db = createServiceClient();

  // duplicate check — CNIC is the strongest identifier, phone/email are secondary
  const { data: existing } = await db
    .from("applications")
    .select("id, full_name, cnic, phone, email, submitted_at, device_type")
    .or(`cnic.eq.${body.cnic},phone.eq.${body.phone},email.ilike.${body.email}`)
    .limit(1)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({
      success: false,
      duplicate: {
        id: existing.id,
        fullName: existing.full_name,
        submittedAt: existing.submitted_at,
        deviceType: existing.device_type,
      },
    });
  }

  // attach the logged-in user's id if there is a session — applying doesn't require login
  const authClient = await createServerSupabase();
  const { data: { user } } = await authClient.auth.getUser();

  const id = genApplicationId();
  const { error: insertError } = await db.from("applications").insert({
    id,
    user_id: user?.id ?? null,
    full_name: body.fullName,
    father_name: body.fatherName ?? null,
    cnic: body.cnic,
    phone: body.phone,
    email: body.email,
    province: body.province,
    district: body.district ?? null,
    tehsil: body.tehsil ?? null,
    address: body.address ?? null,
    disability_type: body.disabilityType ?? null,
    disability_percentage: body.disabilityPercentage ?? null,
    device_type: body.deviceType ?? null,
    reason: body.reason ?? null,
    cnic_doc_name: body.cnicDocName ?? null,
    medical_cert_name: body.medicalCertName ?? null,
    current_stage_index: 0,
    submitted_at: new Date().toISOString().slice(0, 10),
  });

  if (insertError) {
    return NextResponse.json({ success: false, error: "Could not save application. Please try again." }, { status: 500 });
  }

  // best-effort — a notification failure should never fail the submission itself
  try {
    await notifyApplicationSubmitted({ id, fullName: body.fullName, email: body.email, phone: body.phone });
  } catch {
    // already logged inside the notification service
  }

  return NextResponse.json({ success: true, id });
}
