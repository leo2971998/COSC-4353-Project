import express from "express";
import {
  getEnrolledEvents,
  getNextEvent,
  postInterest,
  withdrawEnrolledEvent,
  getBrowseEvents,
  postBrowseEnroll,
  getCalendarInformation,
} from "../controllers/vDashController.js";

const router = express.Router();

router.get("/:userID", getNextEvent);
router.post("/interest/:eventID", postInterest);
router.post("/browse-enroll/:userID/:eventID", postBrowseEnroll);
router.get("/enrolled-events/:userID", getEnrolledEvents);
router.put("/enrolled-events/:userID/:eventID", withdrawEnrolledEvent);
router.get("/browse-events/:userID", getBrowseEvents);
router.get("/calendar/:userID", getCalendarInformation);

export default router;
