import express from "express";
import { createServices } from "./services.js";
import * as memoryRepo from "./repo.memory.js";

export function createApp(repo = memoryRepo) {
  const services = createServices(repo);
  const app = express();
  app.use(express.json());

  app.post("/register", async (req, res) => {
    const result = await services.register(req.body);
    if (!result.ok) return res.status(result.code).json(result);
    res.status(result.code).json({ userId: result.userId });
  });

  app.post("/login", async (req, res) => {
    const result = await services.login(req.body);
    if (!result.ok) return res.status(result.code).json(result);
    res.json(result.data);
  });

  app.post("/profile", async (req, res) => {
    const result = await services.saveProfile(req.body);
    if (!result.ok) return res.status(result.code).json(result);
    res.json({});
  });

  return app;
}
