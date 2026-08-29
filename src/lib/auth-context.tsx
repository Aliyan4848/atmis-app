"use client";

import * as React from "react";
import { createClient } from "@/lib/supabase/client";

export type AtmisUser = {
  id: string;
  fullName: string;
  cnic: string;
  phone: string;
  email: string;
  province: string;
  district: string;
};

export type RegisterInput = {
  fullName: string;
  cnic: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  password: string;
};

type AuthContextType = {
  user: AtmisUser | null;
  loading: boolean;
  register: (u: RegisterInput) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextType | null>(null);

async function loadProfile(supabase: ReturnType<typeof createClient>, userId: string, email: string): Promise<AtmisUser | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, cnic, phone, province, district")
    .eq("id", userId)
    .single();

  if (error || !data) return null;
  return {
    id: userId,
    fullName: data.full_name,
    cnic: data.cnic,
    phone: data.phone,
    province: data.province,
    district: data.district,
    email,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AtmisUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const supabase = React.useMemo(() => createClient(), []);

  React.useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!active) return;
      if (session?.user) {
        const profile = await loadProfile(supabase, session.user.id, session.user.email ?? "");
        if (active) setUser(profile);
      }
      if (active) setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const profile = await loadProfile(supabase, session.user.id, session.user.email ?? "");
        setUser(profile);
      } else {
        setUser(null);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const register = React.useCallback(
    async (input: RegisterInput) => {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
      });

      if (error) {
        return { ok: false, error: error.message };
      }
      if (!data.user) {
        return { ok: false, error: "Registration failed unexpectedly." };
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: input.fullName,
        cnic: input.cnic,
        phone: input.phone,
        province: input.province,
        district: input.district,
      });

      if (profileError) {
        const message = profileError.message.includes("duplicate key")
          ? profileError.message.includes("cnic")
            ? "An account with this CNIC already exists."
            : "An account with these details already exists."
          : profileError.message;
        return { ok: false, error: message };
      }

      setUser({
        id: data.user.id,
        fullName: input.fullName,
        cnic: input.cnic,
        phone: input.phone,
        province: input.province,
        district: input.district,
        email: input.email,
      });

      return { ok: true };
    },
    [supabase]
  );

  const login = React.useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { ok: false, error: error.message };
      }
      return { ok: true };
    },
    [supabase]
  );

  const logout = React.useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

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
