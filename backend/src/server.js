import express from "express";
import cors from "cors";
import sequelize from "./config/db.js";
import authRoutes from "./modules/auth/auth.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
// (logger line removed)

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);

app.use(errorMiddleware);   // ← renamed from errorHandler

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connectée");

    await sequelize.sync();
    console.log("✅ Tables synchronisées");

    app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
  } catch (error) {
    console.error("❌ Impossible de démarrer :", error);
    process.exit(1);
  }
};

start();
