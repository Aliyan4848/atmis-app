"use client";

import * as React from "react";

export type AtmisUser = {
  fullName: string;
  cnic: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  password: string; // mock only — never do this in production
};

const USERS_KEY = "atmis-mock-users";
const SESSION_KEY = "atmis-mock-session";

function getUsers(): AtmisUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: AtmisUser[]) {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {}
}

type AuthContextType = {
  user: AtmisUser | null;
  loading: boolean;
  register: (u: AtmisUser) => { ok: boolean; error?: string };
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AtmisUser | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SESSION_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const register = React.useCallback((u: AtmisUser) => {
    const users = getUsers();
    if (users.some((x) => x.email.toLowerCase() === u.email.toLowerCase())) {
      return { ok: false, error: "An account with this email already exists." };
    }
    if (users.some((x) => x.cnic === u.cnic)) {
      return { ok: false, error: "An account with this CNIC already exists." };
    }
    saveUsers([...users, u]);
    setUser(u);
    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    } catch {}
    return { ok: true };
  }, []);

  const login = React.useCallback((email: string, password: string) => {
    const users = getUsers();
    const found = users.find((x) => x.email.toLowerCase() === email.toLowerCase());
    if (!found || found.password !== password) {
      return { ok: false, error: "Incorrect email or password." };
    }
    setUser(found);
    try {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(found));
    } catch {}
    return { ok: true };
  }, []);

  const logout = React.useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(SESSION_KEY);
    } catch {}
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
