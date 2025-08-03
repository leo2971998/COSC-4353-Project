import { query } from "../db.js";

export const getNextEvent = async (req, res) => {
  try {
    const userID = req.params.userID;
    const sql =
      "SELECT l.full_name, p.is_complete, em.event_id, em.start_time, em.end_time, em.event_description, em.event_location, em.event_name FROM login as l JOIN profile as p ON l.id = p.user_id LEFT JOIN volunteer_history as vh ON l.id = vh.volunteer_id LEFT JOIN eventManage as em ON vh.event_id = em.event_id WHERE l.id = ? AND (em.start_time > NOW() OR em.start_time IS NULL) ORDER BY em.start_time ASC LIMIT 1;";

    const nextEvent = await query(sql, [userID]);

    if (nextEvent.length == 0) {
      return res
        .status(200)
        .json({ message: "Query ran, but returned empty!" });
    }

    res.status(200).json({ nextEvent });
  } catch (error) {
    console.error("Error fetching next event for dashboard", error.message);
    console.error("UserID: ", userID);
    console.error("Error: ", error); // log the full error
    res
      .status(500)
      .json({ message: "Error occured retrieving next event for dashboard" });
  }
};
