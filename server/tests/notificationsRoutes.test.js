import request from "supertest";
import express from "express";
import { jest } from "@jest/globals";

// Re-import router fresh for each test to reset in-memory data
let app;
beforeEach(async () => {
  jest.resetModules();
  const router = (await import("../routes/notifications.js")).default;
  app = express();
  app.use(express.json());
  app.use("/notifications", router);
});

describe("notifications routes", () => {
  test("GET /notifications returns array", async () => {
    const res = await request(app).get("/notifications");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /notifications creates notification", async () => {
    const res = await request(app)
      .post("/notifications")
      .send({ userId: 99, message: "hello" });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ userId: 99, message: "hello", read: false });
  });

  test("GET /notifications/:userId filters by user", async () => {
    await request(app)
      .post("/notifications")
      .send({ userId: 123, message: "test" });
    const res = await request(app).get("/notifications/123");
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.every((n) => n.userId === 123)).toBe(true);
  });
});
