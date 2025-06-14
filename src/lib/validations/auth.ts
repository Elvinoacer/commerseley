import { z } from "zod";

// Common password requirements for both login and signup
const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" })
  .max(50, { message: "Password must be less than 50 characters" })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number" })
  .regex(/[^A-Za-z0-9]/, {
    message: "Password must contain at least one special character",
  });

export const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: passwordSchema,
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters long" })
      .max(50, { message: "Name must be less than 50 characters" })
      .regex(/^[a-zA-Z\s'-]+$/, {
        message: "Name can only contain letters, spaces, hyphens, and apostrophes",
      }),

    email: z
      .string()
      .email({ message: "Please enter a valid email address" })
      .max(100, { message: "Email must be less than 100 characters" })
      .transform((val) => val.toLowerCase()), // Normalize email to lowercase

    password: passwordSchema,

    confirmPassword: z.string(),

    // Optional fields that match your Prisma schema
    image: z.string().url().optional(),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: "You must accept the terms and conditions" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;

// Additional schemas that match your Prisma models
export const addressSchema = z.object({
  name: z.string().min(2).max(100),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  postalCode: z.string().min(3).max(20),
  phone: z.string().min(5).max(20),
  isDefault: z.boolean().optional(),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().email().optional(),
  image: z.string().url().optional(),
});

export const passwordUpdateSchema = z
  .object({
    currentPassword: passwordSchema,
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, "New password must be different from current password");

// For admin-specific forms
export const adminUserUpdateSchema = z.object({
  role: z.enum(["USER", "SUPER_ADMIN"]),
  isActive: z.boolean(),
});

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
