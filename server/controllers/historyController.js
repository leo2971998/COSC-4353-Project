import { volunteerHistory } from "../data/volunteerHistory.js";

export const getVolunteerHistory = (req, res) => {
  res.json(volunteerHistory);
};
