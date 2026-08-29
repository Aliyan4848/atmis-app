import { NextRequest, NextResponse } from "next/server";
import { createServiceClient, requireAdmin } from "@/lib/supabase/server";
import { TIMELINE_STAGES } from "@/lib/mock-data";
import { notifyStatusChange } from "@/lib/notifications";

export const runtime = "nodejs";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Not authorized." }, { status: 403 });
  }

  const db = createServiceClient();
  const { data, error } = await db
    .from("applications")
    .select("id, full_name, cnic, phone, email, province, device_type, current_stage_index, submitted_at")
    .order("submitted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: "Could not load applications." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    applications: (data ?? []).map((a) => ({
      id: a.id,
      fullName: a.full_name,
      cnic: a.cnic,
      phone: a.phone,
      email: a.email,
      province: a.province,
      deviceType: a.device_type,
      currentStageIndex: a.current_stage_index,
      submittedAt: a.submitted_at,
    })),
  });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ success: false, error: "Not authorized." }, { status: 403 });
  }

  let body: { id?: string; newStageIndex?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Malformed request body." }, { status: 400 });
  }

  if (!body.id || typeof body.newStageIndex !== "number") {
    return NextResponse.json({ success: false, error: "id and newStageIndex are required." }, { status: 400 });
  }
  if (body.newStageIndex < 0 || body.newStageIndex >= TIMELINE_STAGES.length) {
    return NextResponse.json({ success: false, error: "Invalid status index." }, { status: 400 });
  }

  const db = createServiceClient();

  const { data: existing, error: fetchError } = await db
    .from("applications")
    .select("id, full_name, email, phone, current_stage_index")
    .eq("id", body.id)
    .single();

  if (fetchError || !existing) {
    return NextResponse.json({ success: false, error: "Application not found." }, { status: 404 });
  }

  const previousStatus = TIMELINE_STAGES[existing.current_stage_index];
  const newStatus = TIMELINE_STAGES[body.newStageIndex];

  const { error: updateError } = await db
    .from("applications")
    .update({ current_stage_index: body.newStageIndex })
    .eq("id", body.id);

  if (updateError) {
    return NextResponse.json({ success: false, error: "Could not update status." }, { status: 500 });
  }

  const notifyResult = await notifyStatusChange(
    { id: existing.id, fullName: existing.full_name, email: existing.email, phone: existing.phone },
    previousStatus,
    newStatus
  );

  return NextResponse.json({ success: true, ...notifyResult });
}
