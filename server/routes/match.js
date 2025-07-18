import express from "express";
import { matchVolunteer } from "../controllers/matchController.js";

const router = express.Router();

router.get("/:volunteerId", matchVolunteer);

export default router;