import express from "express";
import {
  getEnrolledEvents,
  getNextEvent,
  postInterest,
} from "../controllers/vDashController.js";

const router = express.Router();

router.get("/:userID", getNextEvent);
router.post("/interest/:eventID", postInterest);
router.get("/enrolled-events/:userID", getEnrolledEvents);

export default router;
