import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/** Session-aware server client — reads the logged-in user from cookies. Respects RLS. */
export async function createServerSupabase() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // called from a Server Component without write access — safe to ignore,
            // middleware handles session refresh instead
          }
        },
      },
    }
  );
}

/**
 * Privileged client using the service role key — bypasses RLS entirely.
 * Server-only. Never import this in a "use client" file or expose the key
 * via NEXT_PUBLIC_*. Used for duplicate detection, tracking, and admin
 * operations that need to see across all applicants.
 */
export function createServiceClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

/**
 * Checks whether the current request comes from a logged-in admin.
 * Returns null if not — callers should respond 401/403 in that case.
 * This is the real security boundary; the /admin page's own UI check is
 * just a convenience, not something a determined caller couldn't bypass by
 * hitting the API routes directly.
 */
export async function requireAdmin(): Promise<{ id: string; email: string } | null> {
  const authClient = await createServerSupabase();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return null;

  const service = createServiceClient();
  const { data: profile } = await service
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) return null;
  return { id: user.id, email: user.email ?? "" };
}
