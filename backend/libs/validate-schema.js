import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, "Token is required"),
});

export const recoveryEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters long"),
  confirmPassword: z
    .string()
    .min(8, "Confirm password must be at least 8 characters long"),
});
