import { query } from "../db.js";

export const getNextEvent = async (req, res) => {
  try {
    const userID = req.params.userID;

    const sql = `
      SELECT 
        l.full_name, 
        p.is_complete, 
        em.event_id, 
        em.start_time, 
        em.end_time, 
        em.event_description, 
        em.event_location, 
        em.event_name 
      FROM login AS l 
      JOIN profile AS p ON l.id = p.user_id 
      LEFT JOIN volunteer_history AS vh ON l.id = vh.volunteer_id 
      LEFT JOIN eventManage AS em ON vh.event_id = em.event_id 
      WHERE l.id = ? AND (em.start_time > NOW() OR em.start_time IS NULL) AND vh.event_status = "Upcoming"
      ORDER BY em.start_time ASC 
      LIMIT 1;
    `;

    const nextEvent = await query(sql, [userID]);

    // If the user has no upcoming events, still return full_name and is_complete
    if (nextEvent.length === 0) {
      const fallbackProfile = await query(
        "SELECT l.full_name, p.is_complete FROM login AS l JOIN profile AS p ON l.id = p.user_id WHERE l.id = ?",
        [userID]
      );

      if (fallbackProfile.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ nextEvent: [fallbackProfile[0]] });
    }

    res.status(200).json({ nextEvent });
  } catch (error) {
    console.error("Error fetching next event for dashboard", error.message);
    console.error("UserID: ", req.params.userID);
    res
      .status(500)
      .json({ message: "Error retrieving next event for dashboard" });
  }
};

export const postInterest = async (req, res) => {
  const userID = req.body.userID;
  const eventID = req.params.eventID;

  try {
    const checkSql = `
      SELECT * FROM volunteer_history
      WHERE volunteer_id = ? AND event_id = ? AND event_status = 'Withdrew';
    `;
    const existing = await query(checkSql, [userID, eventID]);

    if (existing.length > 0) {
      const updateSql = `
        UPDATE volunteer_history
        SET event_status = 'Upcoming'
        WHERE volunteer_id = ? AND event_id = ?;
      `;
      await query(updateSql, [userID, eventID]);
      return res
        .status(200)
        .json({ message: "Event rejoined (status updated)" });
    }

    const insertSql = `
      INSERT INTO volunteer_history (volunteer_id, event_id)
      VALUES (?, ?);
    `;
    await query(insertSql, [userID, eventID]);

    res.status(201).json({ message: "Interest recorded" });
  } catch (error) {
    console.error("Error in postInterest:", error);
    res.status(500).json({ message: "Error in post interest" });
  }
};

export const postBrowseEnroll = async (req, res) => {
  const userID = req.params.userID;
  const eventID = req.params.eventID;

  try {
    const checkSql = `
      SELECT * FROM volunteer_history
      WHERE volunteer_id = ? AND event_id = ? AND event_status = 'Withdrew';
    `;
    const existing = await query(checkSql, [userID, eventID]);

    if (existing.length > 0) {
      const updateSql = `
        UPDATE volunteer_history
        SET event_status = 'Upcoming'
        WHERE volunteer_id = ? AND event_id = ?;
      `;
      await query(updateSql, [userID, eventID]);
      return res
        .status(200)
        .json({ message: "Event rejoined (status updated)" });
    }

    const insertSql = `
      INSERT INTO volunteer_history (volunteer_id, event_id)
      VALUES (?, ?);
    `;
    await query(insertSql, [userID, eventID]);

    res.status(201).json({ message: "Enrollment recorded" });
  } catch (error) {
    console.error("Error in postBrowseEnroll:", error);
    res.status(500).json({ message: "Error in post browse enroll" });
  }
};

export const getEnrolledEvents = async (req, res) => {
  try {
    const userID = req.params.userID;
    const sql =
      "SELECT em.event_id ,em.event_name, em.event_description, em.event_location, em.start_time, em.end_time FROM volunteer_history AS vh JOIN eventManage AS em ON vh.event_id = em.event_id WHERE vh.volunteer_id = ? AND em.start_time > NOW() AND vh.event_status = 'Upcoming' ORDER BY em.start_time ASC;";

    const events = await query(sql, [userID]);

    if (events.length === 0) {
      return res
        .status(200)
        .json({ events: [], message: "Query ran, but returned empty!" });
    }
    res.status(200).json({ events });
  } catch (error) {
    console.error("Error in the backend for getEnrolledEvents, ", error);
    res.status(500).json({ message: "Error in getEnrolledEvents" });
  }
};

export const withdrawEnrolledEvent = async (req, res) => {
  try {
    const { userID, eventID } = req.params;
    const sql =
      "UPDATE volunteer_history AS vh SET vh.event_status = 'Withdrew' WHERE vh.volunteer_id = ? AND vh.event_id = ?;";
    await query(sql, [userID, eventID]);
    res
      .status(200)
      .json({ message: `Event ${eventID} successfully withdrawn!` });
  } catch (error) {
    console.error("Could not withdraw the event, ", error);
    res.status(500).json({ message: "Could not withdraw event!" });
  }
};

export const getBrowseEvents = async (req, res) => {
  try {
    const userID = req.params.userID;
    const sql =
      "SELECT em.event_id, em.event_name, em.event_description, em.event_location, em.urgency, em.start_time, em.end_time, s.skill_name, vh.event_status FROM eventManage AS em LEFT JOIN event_skill AS es ON em.event_id = es.event_id LEFT JOIN skill AS s ON es.skill_id = s.skill_id LEFT JOIN volunteer_history AS vh ON em.event_id = vh.event_id AND vh.volunteer_id = ? WHERE em.start_time > NOW() ORDER BY em.start_time ASC;";

    const rows = await query(sql, [userID]);

    const eventsMap = new Map();

    rows.forEach((row) => {
      if (!eventsMap.has(row.event_id)) {
        eventsMap.set(row.event_id, {
          event_id: row.event_id,
          event_name: row.event_name,
          event_description: row.event_description,
          event_location: row.event_location,
          urgency: row.urgency,
          start_time: row.start_time,
          end_time: row.end_time,
          skills: [],
          event_status: row.event_status,
        });
      }

      if (row.skill_name) {
        const eventObj = eventsMap.get(row.event_id);
        if (!eventObj.skills.includes(row.skill_name)) {
          eventObj.skills.push(row.skill_name);
        }
      }
    });

    const eventsArray = Array.from(eventsMap.values());

    res.status(200).json({ events: eventsArray });
  } catch (error) {
    console.error("Error in getBrowseEvents: ", error);
    res.status(500).json({ message: "Error retrieving events" });
  }
};

export const getCalendarInformation = async (req, res) => {
  try {
    const userID = req.params.userID;
    const sql =
      "SELECT em.event_id, em.event_name, em.start_time, em.end_time, em.event_location FROM eventManage AS em JOIN volunteer_history AS vh ON em.event_id = vh.event_id WHERE vh.volunteer_id = ?;";
    const calendarData = await query(sql, [userID]);

    res.status(200).json({ calendarData });
  } catch (error) {
    console.error("Error fetching calendar data: ", error);
    res.status(500).json({ message: "Error fetching calendar data" });
  }
};
