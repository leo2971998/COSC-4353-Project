// server/controllers/notificationsController.js
import db from "../db.js";

/**
 * GET /api/notifications
 * Returns all notifications (newest first).
 */
export async function getAllNotifications(_req, res) {
  try {
    const [rows] = await db.query(
      "SELECT id, userId, message, is_read, created_at FROM notifications ORDER BY created_at DESC"
    );
    // normalize is_read to boolean in response
    const data = rows.map((r) => ({ ...r, is_read: !!r.is_read }));
    res.json(data);
  } catch (err) {
    console.error("Error fetching notifications:", err);
    res.status(500).json({ error: "Server error" });
  }
}

/**
 * GET /api/notifications/:userId
 * Returns notifications for a specific user (newest first).
 */
export async function getNotificationsByUserId(req, res) {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT id, userId, message, is_read, created_at FROM notifications WHERE userId = ? ORDER BY created_at DESC",
      [userId]
    );
    const data = rows.map((r) => ({ ...r, is_read: !!r.is_read }));
    res.json(data);
  } catch (err) {
    console.error("Error fetching user notifications:", err);
    res.status(500).json({ error: "Server error" });
  }
}

/**
 * POST /api/notifications
 * Body: { userId, message }
 * Creates a new notification (unread).
 */
export async function createNotification(req, res) {
  const { userId, message } = req.body;

  if (!userId || !message || String(message).trim().length === 0) {
    return res.status(400).json({ error: "Missing fields: userId, message" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO notifications (userId, message, is_read) VALUES (?, ?, ?)",
      [userId, message.trim(), false]
    );

    const [rows] = await db.query(
      "SELECT id, userId, message, is_read, created_at FROM notifications WHERE id = ?",
      [result.insertId]
    );

    const created = rows[0] ? { ...rows[0], is_read: !!rows[0].is_read } : null;
    res.status(201).json(created);
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).json({ error: "Server error" });
  }
}