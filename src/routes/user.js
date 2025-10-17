const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    // }).populate("fromUserId", ["firstName", "lastName"]);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    req.statusCode(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    console.log(connectionRequests);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId  toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get dashboard statistics for the logged-in user
userRouter.get("/user/dashboard/stats", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { Chat } = require("../models/chat");

    // Get accepted connections (matches)
    const acceptedConnections = await ConnectionRequest.countDocuments({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    });

    // Get total connection requests sent/received (interested status)
    const totalMatches = await ConnectionRequest.countDocuments({
      $or: [
        { fromUserId: loggedInUser._id, status: "interested" },
        { toUserId: loggedInUser._id, status: "interested" },
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    });

    // Get message count from chats where user is a participant
    const chats = await Chat.find({
      participants: loggedInUser._id,
    });

    const totalMessages = chats.reduce((total, chat) => {
      return total + chat.messages.length;
    }, 0);

    // Calculate profile views (for now using a simple metric based on interactions)
    const profileViews = totalMatches * 3 + acceptedConnections * 5; // Simple calculation

    res.json({
      message: "Dashboard stats fetched successfully",
      data: {
        matches: totalMatches,
        connections: acceptedConnections,
        messages: totalMessages,
        profileViews: profileViews,
      },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get recent activity for dashboard
userRouter.get("/user/dashboard/activity", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    // Get recent connection requests (last 10)
    const recentRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA)
      .sort({ createdAt: -1 })
      .limit(10);

    // Format activity data
    const activities = recentRequests.map((request) => {
      const isReceived =
        request.toUserId._id.toString() === loggedInUser._id.toString();
      const otherUser = isReceived ? request.fromUserId : request.toUserId;

      let activityText = "";
      if (isReceived) {
        if (request.status === "interested") {
          activityText = "sent you a connection request";
        } else if (request.status === "accepted") {
          activityText = "accepted your connection";
        } else if (request.status === "rejected") {
          activityText = "declined your connection";
        }
      } else {
        if (request.status === "interested") {
          activityText = "received your connection request";
        } else if (request.status === "accepted") {
          activityText = "you connected with";
        } else if (request.status === "rejected") {
          activityText = "you declined connection with";
        }
      }

      return {
        id: request._id,
        user: otherUser,
        activity: activityText,
        timestamp: request.updatedAt,
        status: request.status,
      };
    });

    res.json({
      message: "Recent activity fetched successfully",
      data: activities,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
