import express from "express";
import cors from "cors";
import { apiReference } from "@scalar/express-api-reference";
import authRoutes from "./modules/auth/auth.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

// API routes
app.use("/api/auth", authRoutes);

app.use(
  "/docs",
  apiReference({
    content: {
      openapi: "3.1.0",
      info: { title: "ChatBit API", version: "1.0.0" },
      paths: {},
    },
  }),
);

// Error handler — MUST be last
app.use(errorMiddleware);

export default app;
