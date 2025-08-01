import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT code, name FROM states ORDER BY name"
    );
    res.json(rows);
  } catch (err) {
    console.error("States fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
