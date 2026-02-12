import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
  createWorkspace,
  getWorkspaceProject,
  getWorkspaces,
  getWorkspaceSingle,
} from "../controllers/workspace-controllers.js";
import { createWorkspaceSchema } from "../libs/validate-schema.js";
import authMiddleware from "../middleware/auth-middleware.js";

const router = express.Router();

router.post(
  "/create-workspace",
  authMiddleware,
  validateRequest({ body: createWorkspaceSchema }),
  createWorkspace,
);

router.get("/", authMiddleware, getWorkspaces);
router.get("/:workspaceId", authMiddleware, getWorkspaceSingle);
router.get("/:workspaceId/projects", authMiddleware, getWorkspaceProject);

export default router;
