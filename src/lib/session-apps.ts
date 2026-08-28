export type SessionApp = {
  id: string;
  fullName: string;
  cnic: string;
  phone: string;
  email: string;
  deviceType: string;
  submittedAt: string;
  currentStageIndex: number;
};

const KEY = "atmis-session-apps";

export function getSessionApps(): SessionApp[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addSessionApp(app: SessionApp) {
  if (typeof window === "undefined") return;
  try {
    const list = getSessionApps();
    list.push(app);
    window.sessionStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    // storage unavailable — session lookup simply won't include this record
  }
}
