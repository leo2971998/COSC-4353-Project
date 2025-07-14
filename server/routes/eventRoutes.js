import express from "express";
import { createEvent } from "./controllers/eventControllers.js";

const router = express.Router();

// Temporary array to hold event data in-memory
let events = [];

// Logging incoming requests:
router.use((req, res, next) => {
  console.log(`Incoming ${req.method} request to ${req.url}`);
  next();
});

// POST route to create a new event
router.post("/events", (req, res) => {
  const eventData = req.body;
  console.log("Event data received:", eventData);

  // For now, just push it into the in-memory array
  // events.push(eventData);

  // Using the controller function to handle the logic
  const newEvent = createEvent(eventData);

  // Respond to the client
  res.status(201).json({
    message: "Event created successfully",
    event: newEvent,
  });
});

export default router;