import express from "express";

import authRoutes from "./auth.js";
import workspaceRouters from "./workspace.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/workspaces", workspaceRouters);

export default router;
