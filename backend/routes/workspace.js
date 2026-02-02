import express from "express";
import { validateRequest } from "zod-express-middleware";
import {
  createWorkspace,
  getWorkspaces,
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

export default router;
