import { NextResponse } from "next/server";
import { createServerSupabase, createServiceClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const authClient = await createServerSupabase();
  const { data: { user } } = await authClient.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Not logged in." }, { status: 401 });
  }

  const db = createServiceClient();
  const { data, error } = await db
    .from("applications")
    .select("id, full_name, device_type, current_stage_index, submitted_at")
    .eq("user_id", user.id)
    .order("submitted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: "Could not load applications." }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    applications: (data ?? []).map((a) => ({
      id: a.id,
      fullName: a.full_name,
      deviceType: a.device_type,
      currentStageIndex: a.current_stage_index,
      submittedAt: a.submitted_at,
    })),
  });
}
