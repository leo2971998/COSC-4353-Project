import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

// Use this function to make a SQL query
// Import it to your controller, when you need information from the DB
// Use this function, the first arguement is the query string (ex. SELECT * FROM login WHERE userID = ?)
// the second arguement should be the param which takes place of the ? (used to prevent SQL injections)
// it will most likely be the user ID.
export const query = async (sql, params) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (err) {
    throw err; // Forward the error for handling elsewhere
  }
};

export default db;
