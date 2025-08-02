import { query } from "../db.js";

export let events = [];

export function createEvent(eventData) {
  events.push(eventData);
  return eventData;
}

export async function getEvents(req, res) {
  try {
    const sql =
      "SELECT event_id, event_name, event_description, event_location, urgency, start_time, end_time FROM eventManage";
    const events = await query(sql);
    res.json({ events });
  } catch (err) {
    console.error("Error fetching events", err.message);
    res.status(500).json({ message: "Error fetching events" });
  }
}

export function resetEvents() {
  events = [];
}