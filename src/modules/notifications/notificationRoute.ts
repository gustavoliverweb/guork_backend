import { Router } from "express";

import { authMiddleware } from "../../shared/middlewares/authMiddleware";
import NotificationController from "./notificationController";

const router = Router();
const ntfC = new NotificationController();
router.get("/", authMiddleware, ntfC.getAllNtfs);


export default router;