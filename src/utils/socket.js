const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/chat");
const ConnectionRequest = require("../models/connectionRequest");

const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(firstName + " joined Room : " + roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(`[SOCKET] ${firstName} sending message: ${text}`);

          // Check if users are connected (optional validation)
          const connection = await ConnectionRequest.findOne({
            $or: [
              {
                fromUserId: userId,
                toUserId: targetUserId,
                status: "accepted",
              },
              {
                fromUserId: targetUserId,
                toUserId: userId,
                status: "accepted",
              },
            ],
          });

          if (!connection) {
            console.log("[SOCKET] Users are not connected, message not sent");
            return;
          }

          // Find or create chat
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          // Add message to database
          chat.messages.push({
            senderId: userId,
            text: text.trim(),
          });

          await chat.save();

          // Emit to all users in the room (including sender for confirmation)
          io.to(roomId).emit("messageReceived", {
            firstName,
            lastName,
            text: text.trim(),
            timestamp: new Date(),
          });

          console.log(
            `[SOCKET] Message saved and broadcasted to room: ${roomId}`
          );
        } catch (err) {
          console.error("[SOCKET] Error handling message:", err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
