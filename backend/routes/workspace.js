import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
  acceptGenerateInvite,
  acceptInviteToken,
  createWorkspace,
  getWorkspaceProject,
  getWorkspaces,
  getWorkspaceSingle,
  getWorkspaceStats,
  inviteMember,
} from "../controllers/workspace-controllers.js";
import {
  createWorkspaceSchema,
  inviteMemberSchema,
} from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import z from "zod";

const router = express.Router();

router.post(
  "/create-workspace",
  authMiddleware,
  validateRequest({ body: createWorkspaceSchema }),
  createWorkspace,
);

router.post(
  "/accept-invite-token",
  authMiddleware,
  validateRequest({ body: z.object({ token: z.string() }) }),
  acceptInviteToken,
);

router.post(
  "/:workspaceId/invite-member",
  authMiddleware,
  validateRequest({
    params: z.object({ workspaceId: z.string() }),
    body: inviteMemberSchema,
  }),
  inviteMember,
);

router.post(
  "/:workspaceId/accept-generate-invite",
  authMiddleware,
  validateRequest({ body: z.object({ workspaceId: z.string() }) }),
  acceptGenerateInvite,
);

router.get("/", authMiddleware, getWorkspaces);
router.get("/:workspaceId", authMiddleware, getWorkspaceSingle);
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProject);
router.get("/:workspaceId/stats", authMiddleware, getWorkspaceStats);
export default router;
