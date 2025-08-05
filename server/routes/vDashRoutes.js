import express from "express";
import { getNextEvent, postInterest } from "../controllers/vDashController.js";

const router = express.Router();

router.get("/:userID", getNextEvent);
router.post("/interest/:eventID", postInterest);

export default router;
