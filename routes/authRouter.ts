import { Router } from "express";
const authRouter = Router();

import authController from "../controllers/authController";

authRouter.post("/login", authController.login);
authRouter.post("/sign-up", authController.sign_up);
authRouter.get("/logout", authController.logout);

export default authRouter;
