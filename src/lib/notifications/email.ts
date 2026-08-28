import { Resend } from "resend";

export type EmailResult =
  | { success: true; id: string }
  | { success: false; error: string; configured: boolean };

let client: Resend | null = null;
function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!client) client = new Resend(key);
  return client;
}

const FROM_ADDRESS = process.env.RESEND_FROM_EMAIL ?? "ATMIS <onboarding@resend.dev>";

/**
 * Sends a real email via Resend. If RESEND_API_KEY isn't set (e.g. running
 * locally without configuring it, or in this evaluation sandbox), this
 * returns a clear "not configured" result instead of throwing — callers
 * should treat email as best-effort and never block the user's flow on it.
 */
export async function sendEmail(params: { to: string; subject: string; html: string }): Promise<EmailResult> {
  const resend = getClient();
  if (!resend) {
    return { success: false, error: "RESEND_API_KEY is not configured.", configured: false };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_ADDRESS,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    if (error) {
      return { success: false, error: error.message, configured: true };
    }
    return { success: true, id: data?.id ?? "unknown" };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error sending email.",
      configured: true,
    };
  }
}
