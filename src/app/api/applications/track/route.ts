import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ success: false, error: "Missing query." }, { status: 400 });
  }

  const db = createServiceClient();
  const { data, error } = await db
    .from("applications")
    .select("id, full_name, cnic, phone, current_stage_index, submitted_at")
    .or(`id.ilike.${q},cnic.eq.${q},phone.eq.${q}`)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ success: true, application: null });
  }

  return NextResponse.json({
    success: true,
    application: {
      id: data.id,
      fullName: data.full_name,
      currentStageIndex: data.current_stage_index,
      submittedAt: data.submitted_at,
    },
  });
}
