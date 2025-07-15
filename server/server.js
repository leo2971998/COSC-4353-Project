// api/index.js   (ES-modules; package.json must have "type": "module")

import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const app = express();

<<<<<<< Updated upstream
// ---------------------------------------------------------------------------
// CORS  (only your local Vite origin for now)
// ---------------------------------------------------------------------------
app.use(
  cors({
    origin: ["http://localhost:5173"],  // <- no trailing slash
  })
);
app.options("*", cors()); // handle pre-flight for all routes

// ---------------------------------------------------------------------------
// MySQL  (connection pool + startup ping)
// ---------------------------------------------------------------------------
=======
// CORS configuration
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Database configuration
>>>>>>> Stashed changes
const db = mysql.createPool({
  host: process.env.DB_HOST || "104.10.143.45",
  port: 3306,
  user: process.env.DB_USER || "your_username",
  password: process.env.DB_PASSWORD || "your_password",
  database: process.env.DB_NAME || "your_database",
  connectionLimit: 5,
});

<<<<<<< Updated upstream
=======
// Test database connection
>>>>>>> Stashed changes
(async () => {
  try {
    const conn = await db.getConnection();
    await conn.ping();
<<<<<<< Updated upstream
    console.log("✅  MySQL connection pool ready (ping OK)");
    conn.release();
  } catch (err) {
    console.error("❌  MySQL connection failed:", err.message);
  }
})();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
=======
    console.log("✅ MySQL connection pool ready");
    conn.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
  }
})();

// Middleware
>>>>>>> Stashed changes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

<<<<<<< Updated upstream
// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

// Register
=======
// Routes
>>>>>>> Stashed changes
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
<<<<<<< Updated upstream
    console.log("Register attempt:", { name, email });
    const [rows] = await db.query("SELECT id FROM login WHERE email = ?", [email]);
    if (rows.length) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
=======
    const [existingUser] = await db.query("SELECT id FROM login WHERE email = ?", [email]);
    if (existingUser.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
>>>>>>> Stashed changes
    const [result] = await db.query(
        "INSERT INTO login (name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
    );
<<<<<<< Updated upstream
    await db.query("INSERT INTO profile (user_id) VALUES (?)", [result.insertId]);

    console.log("Inserted user id:", result.insertId);
    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("Register error:", err);
=======

    await db.query("INSERT INTO profile (user_id) VALUES (?)", [result.insertId]);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
>>>>>>> Stashed changes
    res.status(500).json({ message: "Server error" });
  }
});

<<<<<<< Updated upstream
// Login
=======
>>>>>>> Stashed changes
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
<<<<<<< Updated upstream
    const [rows] = await db.query("SELECT * FROM login WHERE email = ?", [email]);
    if (!rows.length) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
=======
    const [users] = await db.query("SELECT * FROM login WHERE email = ?", [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
>>>>>>> Stashed changes
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ message: "Login successful", userId: user.id });
<<<<<<< Updated upstream
  } catch (err) {
    console.error("Login error:", err);
=======
  } catch (error) {
    console.error("Login error:", error);
>>>>>>> Stashed changes
    res.status(500).json({ message: "Server error" });
  }
});

<<<<<<< Updated upstream
// Create / update profile
app.post("/profile", async (req, res) => {
  const { userId, location, skills, preferences, availability } = req.body;
  if (!userId) return res.status(400).json({ message: "userId required" });

  if (
    (location && location.length > 255) ||
    (skills && skills.length > 255) ||
    (preferences && preferences.length > 1000) ||
    (availability && availability.length > 255)
  ) {
    return res.status(400).json({ message: "Invalid field lengths" });
=======
app.post("/profile", async (req, res) => {
  const { userId, location, skills, preferences, availability } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
>>>>>>> Stashed changes
  }

  try {
    await db.query(
        `INSERT INTO profile (user_id, location, skills, preferences, availability)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
<<<<<<< Updated upstream
         location     = VALUES(location),
         skills       = VALUES(skills),
         preferences  = VALUES(preferences),
         availability = VALUES(availability)`,
      [userId, location || null, skills || null, preferences || null, availability || null]
    );
    res.json({ message: "Profile saved" });
  } catch (err) {
    console.error("Profile save error:", err);
=======
         location = VALUES(location),
         skills = VALUES(skills),
         preferences = VALUES(preferences),
         availability = VALUES(availability)`,
        [userId, location || null, skills || null, preferences || null, availability || null]
    );

    res.json({ message: "Profile saved successfully" });
  } catch (error) {
    console.error("Profile save error:", error);
>>>>>>> Stashed changes
    res.status(500).json({ message: "Server error" });
  }
});

<<<<<<< Updated upstream
// Retrieve profile
app.get("/profile/:userId", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT user_id, location, skills, preferences, availability FROM profile WHERE user_id = ?",
      [req.params.userId]
    );
    if (!rows.length) return res.status(404).json({ message: "Profile not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error("Profile fetch error:", err);
=======
// Note: Using string literals instead of template literals for route paths
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const [profiles] = await db.query(
        "SELECT user_id, location, skills, preferences, availability FROM profile WHERE user_id = ?",
        [userId]
    );

    if (profiles.length === 0) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profiles[0]);
  } catch (error) {
    console.error("Profile fetch error:", error);
>>>>>>> Stashed changes
    res.status(500).json({ message: "Server error" });
  }
});

<<<<<<< Updated upstream
// Admin helpers
app.get("/users", async (_req, res) => {
  try {
    const [rows] = await db.query("SELECT id, name, email, role FROM login");
    res.json(rows);
  } catch (err) {
    console.error("Users list error:", err);
=======
app.get("/users", async (req, res) => {
  try {
    const [users] = await db.query("SELECT id, name, email, role FROM login");
    res.json(users);
  } catch (error) {
    console.error("Users list error:", error);
>>>>>>> Stashed changes
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/users/:id/role", async (req, res) => {
  const { role } = req.body;
  const userId = req.params.id;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
<<<<<<< Updated upstream
    await db.query("UPDATE login SET role = ? WHERE id = ?", [role, req.params.id]);
    res.json({ message: "Role updated" });
  } catch (err) {
    console.error("Role update error:", err);
=======
    await db.query("UPDATE login SET role = ? WHERE id = ?", [role, userId]);
    res.json({ message: "Role updated successfully" });
  } catch (error) {
    console.error("Role update error:", error);
>>>>>>> Stashed changes
    res.status(500).json({ message: "Server error" });
  }
});

app.put("/users/:id/password", async (req, res) => {
  const { password } = req.body;
  const userId = req.params.id;

  if (!password || password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
<<<<<<< Updated upstream
    const hashed = await bcrypt.hash(password, 10);
    await db.query("UPDATE login SET password = ? WHERE id = ?", [hashed, req.params.id]);
    res.json({ message: "Password updated" });
  } catch (err) {
    console.error("Password update error:", err);
=======
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query("UPDATE login SET password = ? WHERE id = ?", [hashedPassword, userId]);
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Password update error:", error);
>>>>>>> Stashed changes
    res.status(500).json({ message: "Server error" });
  }
});

<<<<<<< Updated upstream
// ---------------------------------------------------------------------------
// No app.listen() here – Vercel injects the listener.
// ---------------------------------------------------------------------------

export default app;
=======
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
>>>>>>> Stashed changes
