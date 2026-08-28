import { z } from "zod";

const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
const phoneRegex = /^0\d{3}-\d{7}$/;

export const personalInfoSchema = z.object({
  fullName: z.string().trim().min(3, "Full name must be at least 3 characters"),
  fatherName: z.string().trim().min(3, "Father's name must be at least 3 characters"),
  cnic: z
    .string()
    .trim()
    .regex(cnicRegex, "Use the format 12345-1234567-1"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a gender",
  }),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Use the format 0300-1234567"),
  email: z.string().trim().email("Enter a valid email address"),
});

export const disabilityInfoSchema = z.object({
  disabilityType: z.string().min(1, "Please select a disability type"),
  disabilityPercentage: z
    .number({ message: "Enter a percentage between 1 and 100" })
    .min(1)
    .max(100),
  guardianName: z.string().trim().optional(),
  guardianPhone: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || phoneRegex.test(v), "Use the format 0300-1234567"),
  medicalNotes: z.string().trim().max(500).optional(),
});

export const addressInfoSchema = z.object({
  province: z.string().min(1, "Select a province"),
  district: z.string().min(1, "Select a district"),
  tehsil: z.string().min(1, "Select a tehsil"),
  address: z.string().trim().min(10, "Enter a fuller address (10+ characters)"),
});

export const deviceSelectionSchema = z.object({
  deviceType: z.string().min(1, "Select a device"),
  reason: z.string().trim().min(20, "Please describe your need in at least 20 characters"),
});

export const documentsSchema = z.object({
  cnicDocUploaded: z.literal(true, {
    message: "CNIC / B-Form copy is required",
  }),
  medicalCertUploaded: z.literal(true, {
    message: "Medical / disability certificate is required",
  }),
});

export const reviewSchema = z.object({
  confirmed: z.literal(true, {
    message: "Please confirm the information is accurate before submitting",
  }),
});

export const registerSchema = z
  .object({
    fullName: z.string().trim().min(3, "Full name must be at least 3 characters"),
    cnic: z.string().trim().regex(cnicRegex, "Use the format 12345-1234567-1"),
    phone: z.string().trim().regex(phoneRegex, "Use the format 0300-1234567"),
    email: z.string().trim().email("Enter a valid email address"),
    province: z.string().min(1, "Select a province"),
    district: z.string().min(1, "Select a district"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export type RegisterValues = z.infer<typeof registerSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
export type DisabilityInfoValues = z.infer<typeof disabilityInfoSchema>;
export type AddressInfoValues = z.infer<typeof addressInfoSchema>;
export type DeviceSelectionValues = z.infer<typeof deviceSelectionSchema>;
export type DocumentsValues = z.infer<typeof documentsSchema>;
export type ReviewValues = z.infer<typeof reviewSchema>;
