"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth-context";
import { registerSchema, type RegisterValues } from "@/lib/validation";
import { PROVINCES } from "@/lib/mock-data";

export default function RegisterPage() {
  const { register: doRegister } = useAuth();
  const router = useRouter();
  const [serverError, setServerError] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { province: "", district: "" },
  });

  const province = watch("province");
  const districtNames = PROVINCES.find((p) => p.name === province)
    ? Object.keys(PROVINCES.find((p) => p.name === province)!.districts)
    : [];

  async function onSubmit(values: RegisterValues) {
    setSubmitting(true);
    setServerError("");
    const result = await doRegister({
      fullName: values.fullName,
      cnic: values.cnic,
      phone: values.phone,
      email: values.email,
      province: values.province,
      district: values.district,
      password: values.password,
    });
    setSubmitting(false);
    if (!result.ok) {
      setServerError(result.error ?? "Registration failed.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary-light">
          <UserPlus className="size-6 text-primary" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-text-primary">Create your account</h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          Register to apply for a device and track your application.
        </p>
      </div>

      <Card className="mt-6">
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input id="fullName" placeholder="e.g. Muhammad Ahmed" aria-invalid={!!errors.fullName} {...register("fullName")} />
              {errors.fullName && <p className="mt-1.5 text-xs font-medium text-danger">{errors.fullName.message}</p>}
            </div>

            <div>
              <Label htmlFor="cnic">CNIC / B-Form *</Label>
              <Input id="cnic" placeholder="35202-1234567-1" aria-invalid={!!errors.cnic} {...register("cnic")} />
              {errors.cnic && <p className="mt-1.5 text-xs font-medium text-danger">{errors.cnic.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" placeholder="0300-1234567" aria-invalid={!!errors.phone} {...register("phone")} />
                {errors.phone && <p className="mt-1.5 text-xs font-medium text-danger">{errors.phone.message}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="you@example.com" aria-invalid={!!errors.email} {...register("email")} />
                {errors.email && <p className="mt-1.5 text-xs font-medium text-danger">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="province">Province *</Label>
                <Select
                  value={province}
                  onValueChange={(v) => {
                    setValue("province", v, { shouldValidate: true });
                    setValue("district", "");
                  }}
                >
                  <SelectTrigger id="province" aria-invalid={!!errors.province}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p.name} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.province && <p className="mt-1.5 text-xs font-medium text-danger">{errors.province.message}</p>}
              </div>
              <div>
                <Label htmlFor="district">District *</Label>
                <Select
                  value={watch("district")}
                  disabled={!province}
                  onValueChange={(v) => setValue("district", v, { shouldValidate: true })}
                >
                  <SelectTrigger id="district" aria-invalid={!!errors.district}>
                    <SelectValue placeholder={province ? "Select" : "Pick province"} />
                  </SelectTrigger>
                  <SelectContent>
                    {districtNames.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.district && <p className="mt-1.5 text-xs font-medium text-danger">{errors.district.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="password">Password *</Label>
                <Input id="password" type="password" aria-invalid={!!errors.password} {...register("password")} />
                {errors.password && <p className="mt-1.5 text-xs font-medium text-danger">{errors.password.message}</p>}
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm *</Label>
                <Input id="confirmPassword" type="password" aria-invalid={!!errors.confirmPassword} {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="mt-1.5 text-xs font-medium text-danger">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {serverError && (
              <p className="rounded-lg bg-danger/8 px-3 py-2 text-sm font-medium text-danger">{serverError}</p>
            )}

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <UserPlus className="size-4" />}
              {submitting ? "Creating account…" : "Create Account"}
            </Button>

            <p className="text-center text-xs text-text-secondary">
              Your account is created with Supabase Auth — a real account, not stored only in this browser.
            </p>
          </form>
        </CardContent>
      </Card>

      <p className="mt-5 text-center text-sm text-text-secondary">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
