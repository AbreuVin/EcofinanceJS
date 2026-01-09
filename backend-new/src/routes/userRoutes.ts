import { Router } from "express";
import * as userController from '../controllers/userController';
import { authenticate } from "../middleware/authMiddleware";

const router = Router()

router.post("/create-user", authenticate, userController.createUser)
router.get("/:userId", authenticate, userController.getLoggedUser)

export default router