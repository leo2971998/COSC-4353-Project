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
router.post("/", async (req, res) => {
  console.log("2. Backend: Received Request Body", req.body);
  const {
    userId,
    event_name,
    event_description,
    event_location,
    skills,
    urgency,
    eventDate,
    created_by,
    start_time,
    end_time
  } = req.body;

  if (!userId) return res.status(400).json({ message: "userId required" });

  try {
    await db.query(
      `INSERT INTO eventManage (user_id, event_name, event_description, event_location, skills, urgency, created_by, start_time, end_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        event_name || null,
        event_description || null,
        event_location || null,
        skills || null,
        urgency || null,
        eventDate || null,
        created_by || null,
        start_time || null,
        end_time || null
      ]
    );

    res.status(200).json({ message: "Event saved" });
  } catch (err) {
    console.error("Event save error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

router.get("/:userId", async (req, res) => {
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