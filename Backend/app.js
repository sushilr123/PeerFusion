const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

require("dotenv").config();
console.log("[STARTUP] Environment variables loaded");

require("./utils/cronjob");
console.log("[STARTUP] Cron jobs initialized");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5176",
    ],
    credentials: true,
  })
);
console.log("[STARTUP] CORS middleware configured for origins:", [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5176",
]);
app.use(express.json());
console.log("[STARTUP] JSON parser middleware configured");
app.use(cookieParser());
console.log("[STARTUP] Cookie parser middleware configured");
// Log incoming requests for easier debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[REQUEST BODY]:`, req.body);
  }
  next();
});

const authRouter = require("./routes/auth");
console.log("[STARTUP] Auth router loaded");
const profileRouter = require("./routes/profile");
console.log("[STARTUP] Profile router loaded");
const requestRouter = require("./routes/request");
console.log("[STARTUP] Request router loaded");
const userRouter = require("./routes/user");
console.log("[STARTUP] User router loaded");
const paymentRouter = require("./routes/payment");
console.log("[STARTUP] Payment router loaded");
const initializeSocket = require("./utils/socket");
console.log("[STARTUP] Socket utility loaded");
const chatRouter = require("./routes/chat");
console.log("[STARTUP] Chat router loaded");

app.use("/", authRouter);
console.log("[STARTUP] Auth routes mounted on /");
app.use("/", profileRouter);
console.log("[STARTUP] Profile routes mounted on /");
app.use("/", requestRouter);
console.log("[STARTUP] Request routes mounted on /");
app.use("/", userRouter);
console.log("[STARTUP] User routes mounted on /");
app.use("/", paymentRouter);
console.log("[STARTUP] Payment routes mounted on /");
app.use("/", chatRouter);
console.log("[STARTUP] Chat routes mounted on /");

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ERROR HANDLER TRIGGERED:`);
  console.error(`[ERROR] Method: ${req.method}, URL: ${req.url}`);
  console.error(`[ERROR] Stack:`, err.stack || err);
  console.error(`[ERROR] Status:`, err.status || 500);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

const server = http.createServer(app);
console.log("[STARTUP] HTTP server created");
initializeSocket(server);
console.log("[STARTUP] Socket.io initialized");

connectDB()
  .then(() => {
    console.log("[DATABASE] Connection established successfully");
    const PORT = process.env.PORT || 7777;
    console.log(`[SERVER] Attempting to start server on port ${PORT}`);
    server.listen(PORT, () => {
      console.log(
        `[SERVER] Server is successfully listening on port ${PORT}...`
      );
      console.log(
        `[SERVER] Frontend can connect from: http://localhost:5173, http://localhost:5174, or http://localhost:5176`
      );
    });
    server.on("error", (err) => {
      console.error(`[SERVER ERROR] Server error occurred:`, err);
      if (err.code === "EADDRINUSE") {
        console.error(
          `[SERVER ERROR] Port ${PORT} is already in use. Please free the port or set a different PORT environment variable.`
        );
        process.exit(1);
      } else {
        console.error(`[SERVER ERROR] Unexpected server error:`, err);
        process.exit(1);
      }
    });
  })
  .catch((err) => {
    console.error("[DATABASE ERROR] Database connection failed:");
    console.error("[DATABASE ERROR] Error details:", err);
    console.error(
      "[DATABASE ERROR] Make sure MongoDB is running on mongodb://localhost:27017/peerfusion"
    );
    process.exit(1);
  });
