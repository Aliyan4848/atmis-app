"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2, MailCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/validation";

export default function ForgotPasswordPage() {
  const [sent, setSent] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) });

  function onSubmit() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSent(true);
    }, 600);
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary-light">
          <KeyRound className="size-6 text-primary" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-text-primary">Reset your password</h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          We&apos;ll send a reset link to your registered email.
        </p>
      </div>

      <Card className="mt-6">
        <CardContent className="p-5 sm:p-6">
          {!sent ? (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="you@example.com" aria-invalid={!!errors.email} {...register("email")} />
                {errors.email && <p className="mt-1.5 text-xs font-medium text-danger">{errors.email.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? <Loader2 className="size-4 animate-spin" /> : <MailCheck className="size-4" />}
                {submitting ? "Sending…" : "Send Reset Link"}
              </Button>
              <p className="text-center text-xs text-text-secondary">
                Prototype only — no email is actually sent.
              </p>
            </form>
          ) : (
            <div className="text-center">
              <MailCheck className="mx-auto size-9 text-success" />
              <p className="mt-3 text-sm font-semibold text-text-primary">Check your email</p>
              <p className="mt-1 text-sm text-text-secondary">
                If an account exists for <span className="font-medium text-text-primary">{getValues("email")}</span>,
                a reset link has been sent (simulated).
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Link href="/login" className="mt-5 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:underline">
        <ArrowLeft className="size-4" /> Back to login
      </Link>
    </div>
  );
}
