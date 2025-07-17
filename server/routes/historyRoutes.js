import express from "express";
import { getVolunteerHistory } from "../controllers/historyController.js";

const router = express.Router();

router.get("/", getVolunteerHistory);

export default router;
