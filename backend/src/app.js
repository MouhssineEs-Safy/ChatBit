// Builds the Express app: cors, json parser, mounts /api routes, /docs (Scalar),
// and the error middleware. Exports the app (no listen here).
import express from "express";
import cors from "cors";
import { apiReference } from "@scalar/express-api-reference";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => res.json({ status: "ok" }));

const apiRouter = express.Router();

app.use("/api", apiRouter);
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

export default app;
