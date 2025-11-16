const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

require("dotenv").config();
require("./utils/cronjob");

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

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[REQUEST BODY]:`, req.body);
  }
  next();
});

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

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
initializeSocket(server);

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
