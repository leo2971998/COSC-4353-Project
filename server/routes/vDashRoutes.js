import express from "express";
import {
  getEnrolledEvents,
  getNextEvent,
  postInterest,
  withdrawEnrolledEvent,
} from "../controllers/vDashController.js";

const router = express.Router();

router.get("/:userID", getNextEvent);
router.post("/interest/:eventID", postInterest);
router.get("/enrolled-events/:userID", getEnrolledEvents);
router.put("/enrolled-events/:userID/:eventID", withdrawEnrolledEvent);

export default router;
