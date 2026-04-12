const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
require("dotenv").config();
const prescriptionOrdersRoutes = require("./routes/prescriptionOrders.routes");
const authMiddleware = require("./middlewares/authMiddleware");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use((req, res, next) => {
  console.log(
    "REQ:",
    req.method,
    req.originalUrl,
    "origin:",
    req.headers.origin,
  );
  next();
});
app.use("/api/auth", authRoutes);
app.use("/api/prescription-orders", authMiddleware, prescriptionOrdersRoutes);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
