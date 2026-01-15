import { Router } from "express";
import * as userController from './user.controller';
import { authenticate } from "../../shared/middleware/authMiddleware";
import { validate } from "../../shared/middleware/validationMiddleware";
import { createUserSchema, updateUserSchema } from "./user.schema";

const router = Router();
router.use(authenticate);

router.post("/", validate(createUserSchema), userController.create);
router.get("/", userController.list);
router.get("/:userId", userController.getMe);
router.put("/:id", validate(updateUserSchema), userController.update);
router.delete("/:id", userController.remove);

export default router;