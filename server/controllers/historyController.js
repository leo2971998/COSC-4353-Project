import { volunteerHistory } from "../data/volunteerHistory.js";
import { query } from "../db.js";

export const getVolunteerHistory = (req, res) => {
  res.json(volunteerHistory);
};

export const getVolunteerHistoryParams = async (req, res) => {
  try {
    const volunteer_id = req.params.userID;
    const sql =
      "SELECT vh.history_id, em.event_id, em.event_name, em.event_description, em.event_location, em.start_time, vh.event_status, em.urgency, GROUP_CONCAT(sk.skill_name) AS skills FROM volunteer_history AS vh JOIN eventManage AS em ON vh.event_id = em.event_id JOIN event_skill AS ek ON em.event_id = ek.event_id JOIN skill AS sk ON ek.skill_id = sk.skill_id WHERE vh.volunteer_id = ? GROUP BY vh.history_id, em.event_id;";
    const volunteer_history = await query(sql, [volunteer_id]);

    res.status(200).json({ volunteer_history });
  } catch (error) {
    console.error("Error fetching volunteer's history ", error.message);
    res
      .status(500)
      .json({ message: "Server error fetching volunteer's history" });
  }
};
