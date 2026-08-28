"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWizard } from "@/lib/wizard-context";
import { personalInfoSchema, type PersonalInfoValues } from "@/lib/validation";

export function StepPersonal({ onNext }: { onNext: () => void }) {
  const { data, update } = useWizard();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      fullName: data.fullName,
      fatherName: data.fatherName,
      cnic: data.cnic,
      dob: data.dob,
      gender: data.gender as PersonalInfoValues["gender"],
      phone: data.phone,
      email: data.email,
    },
  });

  const gender = watch("gender");

  function onSubmit(values: PersonalInfoValues) {
    update(values);
    onNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input id="fullName" placeholder="e.g. Ayesha Bibi" aria-invalid={!!errors.fullName} {...register("fullName")} />
          {errors.fullName && <p className="mt-1.5 text-xs font-medium text-danger">{errors.fullName.message}</p>}
        </div>

        <div>
          <Label htmlFor="fatherName">Father&apos;s Name *</Label>
          <Input id="fatherName" placeholder="e.g. Muhammad Sharif" aria-invalid={!!errors.fatherName} {...register("fatherName")} />
          {errors.fatherName && <p className="mt-1.5 text-xs font-medium text-danger">{errors.fatherName.message}</p>}
        </div>

        <div>
          <Label htmlFor="cnic">CNIC / B-Form *</Label>
          <Input id="cnic" placeholder="12345-1234567-1" aria-invalid={!!errors.cnic} {...register("cnic")} />
          {errors.cnic ? (
            <p className="mt-1.5 text-xs font-medium text-danger">{errors.cnic.message}</p>
          ) : (
            <p className="mt-1.5 text-xs text-text-secondary">Format: 5 digits – 7 digits – 1 digit</p>
          )}
        </div>

        <div>
          <Label htmlFor="dob">Date of Birth *</Label>
          <Input id="dob" type="date" aria-invalid={!!errors.dob} {...register("dob")} />
          {errors.dob && <p className="mt-1.5 text-xs font-medium text-danger">{errors.dob.message}</p>}
        </div>

        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Select value={gender} onValueChange={(v) => setValue("gender", v as PersonalInfoValues["gender"], { shouldValidate: true })}>
            <SelectTrigger id="gender" aria-invalid={!!errors.gender}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="mt-1.5 text-xs font-medium text-danger">{errors.gender.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input id="phone" placeholder="0300-1234567" aria-invalid={!!errors.phone} {...register("phone")} />
          {errors.phone && <p className="mt-1.5 text-xs font-medium text-danger">{errors.phone.message}</p>}
        </div>

        <div>
          <Label htmlFor="email">Email Address *</Label>
          <Input id="email" type="email" placeholder="you@example.com" aria-invalid={!!errors.email} {...register("email")} />
          {errors.email && <p className="mt-1.5 text-xs font-medium text-danger">{errors.email.message}</p>}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button type="submit">
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
