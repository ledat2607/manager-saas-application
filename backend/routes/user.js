import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import { validateRequest } from "zod-express-middleware";
import {
  changePassword,
  getNotifications,
  getUserProfile,
  setup2FA,
  updatePicture,
  updateUserAdvancedDetails,
  updateUserProfile,
  verifyAndEnable2FA,
} from "../controllers/user-controller.js";
import { z } from "zod";

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.put(
  "/change-profile",
  authMiddleware,
  validateRequest({
    body: z.object({
      name: z.string().min(2).max(100),
      profilePicture: z.string().optional(),
    }),
  }),
  updateUserProfile,
);

router.put(
  "/change-password",
  authMiddleware,
  validateRequest({
    body: z.object({
      currentPassword: z.string().min(6),
      newPassword: z.string().min(6),
      confirmPassword: z.string().min(6),
    }),
  }),
  changePassword,
);

router.get(
  "/notifications/:workspaceId",
  authMiddleware,
  validateRequest({
    params: z.object({
      workspaceId: z.string(),
    }),
  }),
  getNotifications,
);

router.put(
  "/update-advanced-details",
  authMiddleware,
  validateRequest({
    body: z.object({
      skills: z.array(z.string()).optional(),
      preferences: z
        .object({
          language: z.string().optional(),
          timezone: z.string().optional(),
          theme: z.enum(["light", "dark", "system"]).optional(),
        })
        .optional(),
      bio: z.string().max(200).optional(),
    }),
  }),
  updateUserAdvancedDetails,
);

router.put(
  "/update-picture",
  authMiddleware,
  validateRequest({
    body: z.object({
      profilePicture: z.string().url(),
      type: z.enum(["avatar", "background"]),
    }),
  }),
  updatePicture,
);

router.post("/setup-2fa", authMiddleware, setup2FA);
router.post(
  "/verify-2fa",
  authMiddleware,
  validateRequest({ body: z.object({ otp: z.string().length(6) }) }),
  verifyAndEnable2FA,
);

export default router;
