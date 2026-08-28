"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWizard } from "@/lib/wizard-context";
import { addressInfoSchema, type AddressInfoValues } from "@/lib/validation";
import { PROVINCES } from "@/lib/mock-data";

export function StepAddress({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { data, update } = useWizard();

  const {
    handleSubmit,
    setValue,
    watch,
    register,
    formState: { errors },
  } = useForm<AddressInfoValues>({
    resolver: zodResolver(addressInfoSchema),
    defaultValues: {
      province: data.province,
      district: data.district,
      tehsil: data.tehsil,
      address: data.address,
    },
  });

  const province = watch("province");
  const district = watch("district");
  const tehsil = watch("tehsil");

  const provinceObj = PROVINCES.find((p) => p.name === province);
  const districtNames = provinceObj ? Object.keys(provinceObj.districts) : [];
  const tehsilNames =
    provinceObj && district
      ? (provinceObj.districts as Record<string, readonly string[]>)[district] ?? []
      : [];

  function onSubmit(values: AddressInfoValues) {
    update(values);
    onNext();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="province">Province *</Label>
          <Select
            value={province}
            onValueChange={(v) => {
              setValue("province", v, { shouldValidate: true });
              setValue("district", "");
              setValue("tehsil", "");
            }}
          >
            <SelectTrigger id="province" aria-invalid={!!errors.province}>
              <SelectValue placeholder="Select province" />
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
            value={district}
            disabled={!province}
            onValueChange={(v) => {
              setValue("district", v, { shouldValidate: true });
              setValue("tehsil", "");
            }}
          >
            <SelectTrigger id="district" aria-invalid={!!errors.district}>
              <SelectValue placeholder={province ? "Select district" : "Select a province first"} />
            </SelectTrigger>
            <SelectContent>
              {districtNames.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.district && <p className="mt-1.5 text-xs font-medium text-danger">{errors.district.message}</p>}
        </div>

        <div>
          <Label htmlFor="tehsil">Tehsil *</Label>
          <Select
            value={tehsil}
            disabled={!district}
            onValueChange={(v) => setValue("tehsil", v, { shouldValidate: true })}
          >
            <SelectTrigger id="tehsil" aria-invalid={!!errors.tehsil}>
              <SelectValue placeholder={district ? "Select tehsil" : "Select a district first"} />
            </SelectTrigger>
            <SelectContent>
              {tehsilNames.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tehsil && <p className="mt-1.5 text-xs font-medium text-danger">{errors.tehsil.message}</p>}
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="address">Full Address *</Label>
          <Textarea id="address" placeholder="House #, street, nearest landmark" aria-invalid={!!errors.address} {...register("address")} />
          {errors.address && <p className="mt-1.5 text-xs font-medium text-danger">{errors.address.message}</p>}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="size-4" /> Back
        </Button>
        <Button type="submit">
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </form>
  );
}
