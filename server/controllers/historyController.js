import { volunteerHistory } from "../data/volunteerHistory";

export const getVolunteerHistory = (req, res) => {
  res.json(volunteerHistory);
};
