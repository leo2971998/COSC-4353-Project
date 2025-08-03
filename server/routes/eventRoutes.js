import express from "express";
import db from "../db.js";

const router = express.Router();

// Temporary array to hold event data in-memory
// let events = [];

// Logging incoming requests:
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  next();
});

// Route to save event to MySQL
router.post("/events", async (req, res) => {
  console.log("2. Backend: Received Request Body", req.body);
  const {
    eventName,
    eventDescription,
    location,
    skills,
    urgency,
    eventDate,
    userId,
  } = req.body;

  if (!userId) return res.status(400).json({ message: "userId required" });

  try {
    await db.query(
      `INSERT INTO eventManage (user_id, eventName, eventDescription, location, skills, urgency, eventDate)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        eventName || null,
        eventDescription || null,
        location || null,
        skills || null,
        urgency || null,
        eventDate || null,
      ]
    );

    res.status(200).json({ message: "Event saved" });
  } catch (err) {
    console.error("Event save error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

router.get("/events/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM eventManage WHERE user_id = ?",
      [userId]
    );
    res.json(rows); // Send rows to frontend
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;