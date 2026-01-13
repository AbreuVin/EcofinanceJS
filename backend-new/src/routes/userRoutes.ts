import { Router } from "express";
import * as userController from '../controllers/userController';
import { authenticate } from "../middleware/authMiddleware";

const router = Router()

router.post("/create-user", authenticate, userController.createUser)
router.get("/:userId", authenticate, userController.getLoggedUser)
router.get("/", authenticate, userController.getUsers)
router.put("/:id", authenticate, userController.updateUser)
router.delete("/:id", authenticate, userController.deleteUser)

export default router