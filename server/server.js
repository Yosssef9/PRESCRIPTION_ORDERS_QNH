const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
require("dotenv").config();
const prescriptionOrdersRoutes = require("./routes/prescriptionOrders.routes");
const unitDoseOrdersRoutes = require("./routes/unitDoseOrders.routes");

const authMiddleware = require("./middlewares/authMiddleware");
const errorHandler = require("./middlewares/errorHandler");
const { getPool } = require("./config/db");

const app = express();
app.get("/ping", (req, res) => {
  res.json({ ok: true });
});
const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.use((req, res, next) => {
  console.log("REQ:", req.method, req.originalUrl);
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/prescription-orders", authMiddleware, prescriptionOrdersRoutes);
app.use("/api/unit-dose-orders", authMiddleware, unitDoseOrdersRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

(async () => {
  try {
    await getPool();
    console.log("🚀 App ready with DB connection");
  } catch (err) {
    console.error("❌ App failed to start due to DB error");
    process.exit(1);
  }
})();
