import express from "express";
import { validateRequest } from "zod-express-middleware";
import { loginSchema, registerSchema } from "../libs/validate-schema.js";
import { loginUser, registerUser } from "../controllers/auth-controller.js";

const router = express.Router();

router.post(
  "/register",
  validateRequest({ body: registerSchema }),
  async (req, res) => {
    registerUser;
  }
);

router.post(
  "/login",
  validateRequest({ body: loginSchema }),
  async (req, res) => {
    loginUser;
  }
);


export default router;
