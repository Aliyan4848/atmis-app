import { sendEmail, type EmailResult } from "./email";
import { mockSmsService, type SmsRecord } from "./mock-sms";

export type ApplicationForNotify = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
};

export type NotifyResult = {
  email: EmailResult;
  sms: SmsRecord;
};

function wrapHtml(title: string, bodyLines: string[]): string {
  return `
    <div style="font-family: Inter, Arial, sans-serif; max-width: 480px; margin: 0 auto; color: #1F2937;">
      <div style="background: #1E5AA8; padding: 20px 24px; border-radius: 10px 10px 0 0;">
        <span style="color: #fff; font-weight: 700; font-size: 16px;">ATMIS</span>
      </div>
      <div style="border: 1px solid #D9E2EC; border-top: none; border-radius: 0 0 10px 10px; padding: 24px;">
        <h2 style="margin: 0 0 12px; font-size: 18px;">${title}</h2>
        ${bodyLines.map((l) => `<p style="margin: 6px 0; font-size: 14px; line-height: 1.6;">${l}</p>`).join("")}
        <p style="margin-top: 20px; font-size: 12px; color: #64748B;">
          This is an automated message from the ATMIS assistive-device portal. Do not reply to this email.
        </p>
      </div>
    </div>`;
}

/** Fired once, right after an application is successfully submitted. */
export async function notifyApplicationSubmitted(app: ApplicationForNotify): Promise<NotifyResult> {
  const email = await sendEmail({
    to: app.email,
    subject: "ATMIS Application Submitted",
    html: wrapHtml("Your ATMIS application has been successfully submitted.", [
      `<strong>Application ID:</strong> ${app.id}`,
      `<strong>Current status:</strong> Submitted`,
      `You can track your application through the ATMIS portal at any time.`,
    ]),
  });

  const sms = await mockSmsService.sendSms(
    app.phone,
    `ATMIS: Your application ${app.id} has been received and is now Submitted. Track it anytime on the ATMIS portal.`
  );

  return { email, sms };
}

/** Fired whenever an admin changes an application's status. */
export async function notifyStatusChange(
  app: ApplicationForNotify,
  previousStatus: string,
  newStatus: string
): Promise<NotifyResult> {
  const email = await sendEmail({
    to: app.email,
    subject: "ATMIS Application Status Update",
    html: wrapHtml("Your application status has been updated.", [
      `<strong>Application ID:</strong> ${app.id}`,
      `<strong>Previous status:</strong> ${previousStatus}`,
      `<strong>New status:</strong> ${newStatus}`,
      `Please log in to the ATMIS portal to view further details.`,
    ]),
  });

  const sms = await mockSmsService.sendSms(
    app.phone,
    `ATMIS: Your application ${app.id} is now ${newStatus}.`
  );

  return { email, sms };
}
