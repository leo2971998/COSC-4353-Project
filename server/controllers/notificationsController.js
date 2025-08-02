// controllers/notificationsController.js
import db from "../db.js";

const USE_DB = process.env.USE_DB === "1";

let memory = [
  { id: 1, userId: 1, message: "Event A", read: false },
  { id: 2, userId: 1, message: "Event B", read: false },
  { id: 3, userId: 2, message: "Event C", read: false },
];

export function addNotification(userId, message) {
  if (!USE_DB) {
    const n = { id: Date.now(), userId: Number(userId), message, read: false };
    memory.push(n);
    return n;
  }
  // DB path handled where needed (matchController inserts directly)
  return null;
}

export async function getAllNotifications(_req, res) {
  if (!USE_DB) return res.json(memory);

  try {
    const [rows] = await db.query("SELECT id, userId, message, is_read FROM notifications ORDER BY id DESC");
    const out = rows.map(r => ({
      id: r.id,
      userId: r.userId,
      message: r.message,
      read: !!(r.read ?? r.is_read),        // normalize
    }));
    return res.json(out);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getNotificationsByUserId(req, res) {
  const id = Number(req.params.userId);
  if (!USE_DB) return res.json(memory.filter(n => n.userId === id));

  try {
    const [rows] = await db.query(
      "SELECT id, userId, message, is_read FROM notifications WHERE userId = ? ORDER BY id DESC",
      [id]
    );
    const out = rows.map(r => ({
      id: r.id,
      userId: r.userId,
      message: r.message,
      read: !!(r.read ?? r.is_read),
    }));
    return res.json(out);
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}

export async function createNotification(req, res) {
  const { userId, message } = req.body || {};
  if (!userId || !message) return res.status(400).json({ error: "Missing fields" });

  if (!USE_DB) {
    const n = { id: Date.now(), userId: Number(userId), message, read: false };
    memory.push(n);
    return res.status(201).json(n);
  }

  try {
    await db.query(
      "INSERT INTO notifications (userId, message, is_read) VALUES (?, ?, ?)",
      [Number(userId), message, 0]
    );
    return res.status(201).json({ userId: Number(userId), message, read: false });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
}