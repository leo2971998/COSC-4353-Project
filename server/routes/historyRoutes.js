import express from "express";
import { getVolunteerHistory } from "../controllers/historyController";

const router = express.Router();

router.get("/", getVolunteerHistory);

export default router;
