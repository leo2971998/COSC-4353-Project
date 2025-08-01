import express from "express";
import {
  getVolunteerHistory,
  getVolunteerHistoryParams,
} from "../controllers/historyController.js";

const router = express.Router();

router.get("/", getVolunteerHistory);
router.get("/:userID", getVolunteerHistoryParams);

export default router;
