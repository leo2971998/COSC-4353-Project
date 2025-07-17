import { volunteers } from "../data/volunteers.js";
import { events } from "../data/events.js";
import { addNotification } from "../data/notifications.js";

export function matchVolunteer(req, res) {
  const { volunteerId } = req.params;

  // Find the volunteer using their ID
  const volunteer = volunteers.find(v => v.id === volunteerId);

  // If no volunteer is found, stop and send 404 error
  if (!volunteer) {
    return res.status(404).json({ message: "Volunteer not found" });
  }

  // Go through each event and calculate a match score
  const matchedEvents = events
    .map(event => {
      const locationMatch = event.location === volunteer.location;

      const matchedSkills = event.requiredSkills.filter(skill =>
        volunteer.skills.includes(skill)
      );
      const skillScore = matchedSkills.length;

      const availabilityMatch =
        new Date(volunteer.availability.start) <= new Date(event.startTime) &&
        new Date(volunteer.availability.end) >= new Date(event.endTime);

      const preferenceBonus = volunteer.preferences.includes(event.preferenceTag) ? 1 : 0;

      const matchScore =
        (locationMatch ? 1 : 0) +
        (availabilityMatch ? 1 : 0) +
        skillScore +
        preferenceBonus;

      return {
        ...event,
        matchScore,
        matchedSkills
      };
    })
    .filter(event => event.matchScore > 2) // Only keep good matches
    .sort((a, b) => b.matchScore - a.matchScore); // Best matches first

  // ✅ Send notification if we found at least one match
  if (matchedEvents.length > 0) {
    addNotification(
      volunteer.id,
      `You've been matched to ${matchedEvents[0].title}!`
    );
  }

  // Send back the final matched events
  res.json(matchedEvents);
}