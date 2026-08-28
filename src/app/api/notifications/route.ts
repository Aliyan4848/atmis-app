import { NextRequest, NextResponse } from "next/server";
import { notifyApplicationSubmitted, notifyStatusChange, type ApplicationForNotify } from "@/lib/notifications";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: {
    event?: "submitted" | "status-change";
    application?: ApplicationForNotify;
    previousStatus?: string;
    newStatus?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Malformed request body." }, { status: 400 });
  }

  const { event, application, previousStatus, newStatus } = body;

  if (!application?.id || !application.email || !application.phone || !application.fullName) {
    return NextResponse.json({ success: false, error: "Missing application details." }, { status: 400 });
  }

  try {
    if (event === "submitted") {
      const result = await notifyApplicationSubmitted(application);
      return NextResponse.json({ success: true, ...result });
    }

    if (event === "status-change") {
      if (!previousStatus || !newStatus) {
        return NextResponse.json({ success: false, error: "previousStatus and newStatus are required." }, { status: 400 });
      }
      const result = await notifyStatusChange(application, previousStatus, newStatus);
      return NextResponse.json({ success: true, ...result });
    }

    return NextResponse.json({ success: false, error: "Unknown event type." }, { status: 400 });
  } catch (err) {
    // notifications are best-effort — never let a failure here look like a crash to the caller
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Notification failed unexpectedly.",
    });
  }
}
