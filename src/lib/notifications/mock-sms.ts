export type SmsRecord = {
  id: string;
  to: string;
  message: string;
  sentAt: string;
  demo: true; // always true here — this is never a real send
};

// in-memory log for this server process — purely for the admin demo view.
// In production this would not exist; a real provider call would replace sendSms's body.
const smsLog: SmsRecord[] = [];

export const mockSmsService = {
  /**
   * Simulates sending an SMS. Never contacts a real gateway or costs money.
   * Swap the implementation of this function for a real provider (e.g. Twilio,
   * a local Pakistani SMS gateway) later — callers don't need to change.
   */
  async sendSms(to: string, message: string): Promise<SmsRecord> {
    const record: SmsRecord = {
      id: `sms_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      to,
      message,
      sentAt: new Date().toISOString(),
      demo: true,
    };
    smsLog.unshift(record);
    if (smsLog.length > 50) smsLog.length = 50;
    return record;
  },

  getLog(): SmsRecord[] {
    return smsLog;
  },
};
