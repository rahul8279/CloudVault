import { Router } from "express";
import {
  registerController,
  loginController,
  getMeController,
} from "./auth.controller.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/me", requireAuth, getMeController);


export default authRouter;