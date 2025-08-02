const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { Chat } = require("../models/chat");

const chatRouter = express.Router();

// Get chat messages between two users
chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    console.error("Error fetching chat:", err);
    res.status(500).json({
      message: "Error fetching chat",
      error: err.message,
    });
  }
});

// Send a message (HTTP endpoint as backup to socket)
chatRouter.post("/chat/:targetUserId/message", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const { text } = req.body;
  const userId = req.user._id;

  try {
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Message text is required" });
    }

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
    }

    chat.messages.push({
      senderId: userId,
      text: text.trim(),
    });

    await chat.save();

    // Populate the sender info for the response
    await chat.populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    const newMessage = chat.messages[chat.messages.length - 1];

    res.json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({
      message: "Error sending message",
      error: err.message,
    });
  }
});

module.exports = chatRouter;
