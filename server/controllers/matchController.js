// server/controllers/matchController.js
import db from "../db.js";
import { events } from "../data/events.js";
import { volunteers as mockVolunteers } from "../data/volunteers.js";
import {
  addNotification as addMockNotification,
} from "./notificationsController.js";

const USE_DB =
  String(process.env.USE_DB || "").toLowerCase() === "1" ||
  String(process.env.USE_DB || "").toLowerCase() === "true";

/**
 * GET /api/match/:volunteerId
 * Returns ranked event matches for a volunteer and creates a notification
 * for the top match.
 */
export async function matchVolunteer(req, res) {
  const { volunteerId } = req.params;

  try {
    // 1) Load the volunteer (DB or mock)
    let volunteer;
    if (USE_DB) {
      const [rows] = await db.query(
        `SELECT id, location, skills, preferences, availability_start, availability_end
         FROM volunteers WHERE id = ?`,
        [volunteerId]
      );
      if (!rows.length) {
        return res.status(404).json({ message: "Volunteer not found" });
      }
      volunteer = rows[0];
      // normalize CSV fields to arrays
      volunteer.skills = (volunteer.skills || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      volunteer.preferences = (volunteer.preferences || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      volunteer.availability = {
        start: volunteer.availability_start,
        end: volunteer.availability_end,
      };
    } else {
      volunteer = mockVolunteers.find((v) => String(v.id) === String(volunteerId));
      if (!volunteer) {
        return res.status(404).json({ message: "Volunteer not found" });
      }
    }

    // 2) Score events
    const matchedEvents = events
      .map((ev) => {
        const locationMatch = ev.location === volunteer.location;

        const matchedSkills = ev.requiredSkills.filter((skill) =>
          (volunteer.skills || []).includes(skill)
        );
        const skillScore = matchedSkills.length;

        const availabilityMatch =
          new Date(volunteer.availability?.start) <= new Date(ev.startTime) &&
          new Date(volunteer.availability?.end) >= new Date(ev.endTime);

        const preferenceBonus = (volunteer.preferences || []).includes(
          ev.preferenceTag
        )
          ? 1
          : 0;

        const matchScore =
          (locationMatch ? 1 : 0) +
          (availabilityMatch ? 1 : 0) +
          skillScore +
          preferenceBonus;

        return { ...ev, matchScore, matchedSkills };
      })
      .filter((ev) => ev.matchScore > 2) // keep good matches
      .sort((a, b) => b.matchScore - a.matchScore);

    // 3) If we found a match, create a notification for the top one
    if (matchedEvents.length > 0) {
      const top = matchedEvents[0];
      const message = `You've been matched to ${top.title}!`;

      if (USE_DB) {
        await db.query(
          "INSERT INTO notifications (userId, message, is_read) VALUES (?, ?, ?)",
          [volunteer.id, message, false]
        );
      } else {
        // mock path uses in-memory notification store
        addMockNotification(volunteer.id, message);
      }
    }

    // 4) Return ranked matches
    return res.json(matchedEvents);
  } catch (err) {
    console.error("Error matching volunteer:", err);
    return res.status(500).json({ message: "Server error" });
  }
}