import { volunteerHistory } from "../data/volunteerHistory.js";
import { query } from "../db.js";

export const getVolunteerHistory = (req, res) => {
  res.json(volunteerHistory);
};

export const getVolunteerHistoryParams = async (req, res) => {
  try {
    const volunteer_id = req.params.userID;
    const sql =
      "SELECT vh.history_id, em.event_name, em.event_description, em.event_location, em.skills, em.start_time, vh.event_status, em.urgency FROM volunteer_history as vh JOIN eventManage as em ON vh.event_id = em.event_id WHERE vh.volunteer_id = ?;";
    const volunteer_history = await query(sql, [volunteer_id]);

    res.status(200).json({ volunteer_history });
  } catch (error) {
    console.error("Error fetching volunteer's history ", error);
    res
      .status(500)
      .json({ message: "Server error fetching volunteer's history" });
  }
};
