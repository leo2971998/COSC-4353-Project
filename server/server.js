import express from "express";
import cors from "cors";

const app = express();
const corsOptions = {
  // Origin: This is the frontend URL that will be allowed to access the server.
  origin: ["http://localhost:5173/"],
};

app.use(cors(corsOptions));
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
