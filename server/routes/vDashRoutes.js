import express from "express";
import {
  deleteEnrolledEvent,
  getEnrolledEvents,
  getNextEvent,
  postInterest,
} from "../controllers/vDashController.js";

const router = express.Router();

router.get("/:userID", getNextEvent);
router.post("/interest/:eventID", postInterest);
router.get("/enrolled-events/:userID", getEnrolledEvents);
router.delete("/enrolled-events/:userID/:eventID", deleteEnrolledEvent);

export default router;
