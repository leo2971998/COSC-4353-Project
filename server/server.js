import express from "express";
import cors from "cors";

import eventRoutes from "./routes/eventRoutes.js";

const app = express();
const corsOptions = {
  // Origin: This is the frontend URL that will be allowed to access the server.
  origin: ["http://localhost:5173"],
};

// Allows us to parse JSON data in the request body.
app.use(express.json());

// Allows us to parse URL-encoded data (from HTML forms or URL-style strings). extended allows us to parse nested objects
app.use(express.urlencoded({ extended: true }));

// Use the CORS middleware with the specific options we defined.
app.use(cors(corsOptions));

// Using the event routes
app.use("/", eventRoutes);

// Starts the server on port 3000
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
