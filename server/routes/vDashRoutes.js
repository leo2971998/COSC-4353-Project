import express from "express";
import { getNextEvent } from "../controllers/vDashController.js";

const router = express.Router();

router.get("/:userID", getNextEvent);

export default router;
