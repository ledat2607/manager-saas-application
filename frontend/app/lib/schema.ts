import { ProjectStatus } from "@/types";
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().min(1).email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const passwordRules = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^a-zA-Z0-9]/, "Must contain at least one special character");

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),

    email: z.string().min(1).email("Invalid email address"),

    password: passwordRules,

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
    confirmNewPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ["confirmNewPassword"],
    message: "Passwords do not match",
  });

export const forgortPasswordSchema = z.object({
  email: z.string().min(1).email("Invalid email address"),
});

export const CreateWorkspaceSchema = z.object({
  name: z.string().min(4, "Workspace name must be at least 4 characters long"),
  description: z.string(),
  color: z.string(),
  workspacePicture: z.string(),
});

export const ProjectSchema = z.object({
  title: z.string().min(4, "Project title must be at least 4 characters long"),
  description: z.string(),
  status: z.nativeEnum(ProjectStatus),
  startDate: z.string().min(10, "Start date is required"),
  dueDate: z.string().min(10, "End date is required"),
  members: z.array(
    z
      .object({
        user: z.string(),
        role: z.enum(["admin", "member", "owner", "viewer"]),
      })
      .optional(),
  ),
  tags: z.string().optional(),
});
