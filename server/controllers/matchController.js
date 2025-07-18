import { volunteers } from "../data/volunteers.js";
import { events } from "../data/events.js";

export function matchVolunteer(req, res) {
  const { volunteerId } = req.params;
  const volunteer = volunteers.find(v => v.id === volunteerId);

  if (!volunteer) {
    return res.status(404).json({ message: "Volunteer not found" });
  }

  const matchedEvents = events.filter(event => {
    const locationMatch = event.location === volunteer.location;

    const skillMatch = event.requiredSkills.some(skill =>
      volunteer.skills.includes(skill)
    );

    const availabilityMatch =
      new Date(volunteer.availability.start) <= new Date(event.startTime) &&
      new Date(volunteer.availability.end) >= new Date(event.endTime);

    // Make preference optional — don’t block matching if it doesn’t match
    const preferenceMatch =
      !event.preferenceTag || volunteer.preferences.includes(event.preferenceTag);

    return locationMatch && skillMatch && availabilityMatch && preferenceMatch;
  });

  res.json(matchedEvents);
}