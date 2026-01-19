import { Router } from "express";
import * as authController from "./auth.controller";

const router = Router()

router.post("/login", authController.handleLogin)

export default router