import express from "express";
import {
  getAllNotifications,
  getNotificationsByUserId,
  createNotification,
} from "../controllers/notificationsController.js";

const router = express.Router();

router.get("/", getAllNotifications); // GET all notifications
router.get("/:userId", getNotificationsByUserId); // GET by user ID
router.post("/", createNotification); // POST a new notification

export default router;