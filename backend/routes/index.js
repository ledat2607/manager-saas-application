import express from "express";

import authRoutes from "./auth.js";
import workspaceRouters from "./workspace.js";
import projectRoutes from "./project.js";
import taskRoutes from "./task.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRouters);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);

export default router;
