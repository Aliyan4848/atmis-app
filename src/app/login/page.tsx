"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { loginSchema, type LoginValues } from "@/lib/validation";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setSubmitting(true);
    setServerError("");
    const result = await login(values.email, values.password);
    setSubmitting(false);
    if (!result.ok) {
      setServerError(result.error ?? "Login failed.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary-light">
          <LogIn className="size-6 text-primary" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-text-primary">Log in to ATMIS</h1>
        <p className="mt-1.5 text-sm text-text-secondary">Access your dashboard and applications.</p>
      </div>

      <Card className="mt-6">
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="you@example.com" aria-invalid={!!errors.email} {...register("email")} />
              {errors.email && <p className="mt-1.5 text-xs font-medium text-danger">{errors.email.message}</p>}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="!mb-0">Password *</Label>
                <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input id="password" type="password" className="mt-1.5" aria-invalid={!!errors.password} {...register("password")} />
              {errors.password && <p className="mt-1.5 text-xs font-medium text-danger">{errors.password.message}</p>}
            </div>

            {serverError && (
              <p className="rounded-lg bg-danger/8 px-3 py-2 text-sm font-medium text-danger">{serverError}</p>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />}
              {submitting ? "Logging in…" : "Log In"}
            </Button>

            <p className="text-center text-xs text-text-secondary">
              This checks against a real account created via Supabase Auth — not a government identity system.
            </p>
          </form>
        </CardContent>
      </Card>

      <p className="mt-5 text-center text-sm text-text-secondary">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
