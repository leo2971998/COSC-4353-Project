import request from "supertest";
import express from "express";
import historyRoutes from "../routes/historyRoutes";

const app = express();
app.use(express.json());
app.use("/history", historyRoutes);

describe("GET /history", () => {
  it("should return history", async () => {
    const res = await request(app).get("/history");

    expect(res.statusCode).toBe(200); // The response status code should be 200
    expect(Array.isArray(res.body)).toBe(true); // The response should be an array of objects
    expect(res.body.length).toBeGreaterThan(0); // The response should have atleast one object
    expect(res.body[0]).toHaveProperty("eventName"); // Checks if the key is in the object
    expect(res.body[0]).toHaveProperty("participationStatus"); // Checks if the key is in the object
  });
});
