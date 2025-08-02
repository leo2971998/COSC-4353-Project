// server/controllers/matchController.js
import db from "../db.js";
import { events } from "../data/events.js";

/**
 * GET /api/match/:volunteerId
 * Returns ranked event matches for a volunteer and creates a notification
 * for the top match.
 */
export async function matchVolunteer(req, res) {
  const { volunteerId } = req.params;

  try {
    // 1) Load the volunteer from DB
    const [rows] = await db.query(
      "SELECT id, location, skills, preferences, availability_start, availability_end FROM volunteers WHERE id = ?",
      [volunteerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Volunteer not found" });
    }

    const v = rows[0];

    // CSV -> arrays (trim spaces)
    const vSkills = (v.skills || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const vPrefs = (v.preferences || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // 2) Score events
    const matches = events
      .map((ev) => {
        const locationMatch = ev.location === v.location;

        const matchedSkills = ev.requiredSkills.filter((skill) =>
          vSkills.includes(skill)
        );
        const skillScore = matchedSkills.length;

        const availabilityMatch =
          new Date(v.availability_start) <= new Date(ev.startTime) &&
          new Date(v.availability_end) >= new Date(ev.endTime);

        const preferenceBonus = vPrefs.includes(ev.preferenceTag) ? 1 : 0;

        const matchScore =
          (locationMatch ? 1 : 0) +
          (availabilityMatch ? 1 : 0) +
          skillScore +
          preferenceBonus;

        return { ...ev, matchScore, matchedSkills };
      })
      // keep “good” matches; tweak threshold as you like
      .filter((ev) => ev.matchScore > 2)
      .sort((a, b) => b.matchScore - a.matchScore);

    // 3) If we found a match, create a DB notification for the top one
    if (matches.length > 0) {
      const top = matches[0];
      await db.query(
        "INSERT INTO notifications (userId, message, is_read) VALUES (?, ?, ?)",
        [v.id, `You've been matched to ${top.title}!`, false]
      );
    }

    // 4) Return ranked matches
    res.json(matches);
  } catch (err) {
    console.error("Error matching volunteer:", err);
    res.status(500).json({ message: "Server error" });
  }
}