const mongoose = require("mongoose");
const User = require("../src/models/user");
const ConnectionRequest = require("../src/models/connectionRequest");
const { Chat } = require("../src/models/chat");
require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.DATABASE_URL || "mongodb://localhost:27017/peerfusion"
    );
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

const testDashboardData = async () => {
  await connectDB();

  try {
    console.log("🔍 Testing Dashboard Data Generation...\n");

    // Get all users
    const users = await User.find({}).select("firstName lastName emailId");
    console.log(`📊 Users in database: ${users.length}`);

    if (users.length === 0) {
      console.log("❌ No users found. Please create some users first.");
      return;
    }

    // Test with the first user
    const testUser = users[0];
    console.log(
      `\n🧪 Testing dashboard data for: ${testUser.firstName} ${testUser.lastName}`
    );

    // Calculate stats for this user
    const userId = testUser._id;

    // Get accepted connections (matches)
    const acceptedConnections = await ConnectionRequest.countDocuments({
      $or: [
        { fromUserId: userId, status: "accepted" },
        { toUserId: userId, status: "accepted" },
      ],
    });

    // Get total connection requests sent/received (interested status)
    const totalMatches = await ConnectionRequest.countDocuments({
      $or: [
        { fromUserId: userId, status: "interested" },
        { toUserId: userId, status: "interested" },
        { fromUserId: userId, status: "accepted" },
        { toUserId: userId, status: "accepted" },
      ],
    });

    // Get message count from chats where user is a participant
    const chats = await Chat.find({
      participants: userId,
    });

    const totalMessages = chats.reduce((total, chat) => {
      return total + chat.messages.length;
    }, 0);

    // Calculate profile views (simple metric)
    const profileViews = totalMatches * 3 + acceptedConnections * 5;

    console.log(`\n📈 Dashboard Stats:`);
    console.log(`   • Total Matches: ${totalMatches}`);
    console.log(`   • Connections: ${acceptedConnections}`);
    console.log(`   • Messages: ${totalMessages}`);
    console.log(`   • Profile Views: ${profileViews}`);

    // Get recent activity
    const recentRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: userId }, { toUserId: userId }],
    })
      .populate("fromUserId", "firstName lastName photoUrl")
      .populate("toUserId", "firstName lastName photoUrl")
      .sort({ createdAt: -1 })
      .limit(10);

    console.log(`\n📋 Recent Activity (${recentRequests.length} items):`);
    if (recentRequests.length === 0) {
      console.log("   No recent activity found.");
    } else {
      recentRequests.slice(0, 5).forEach((request, index) => {
        const isReceived =
          request.toUserId._id.toString() === userId.toString();
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

        const timeAgo = new Date(request.updatedAt).toLocaleString();
        console.log(
          `   ${index + 1}. ${otherUser.firstName} ${
            otherUser.lastName
          } - ${activityText} (${timeAgo})`
        );
      });
    }

    console.log("\n✅ Dashboard data test completed!");
    console.log(
      "\n🌐 Now test the dashboard at: http://localhost:5173/dashboard"
    );
    console.log("   (Make sure to login first)");
  } catch (error) {
    console.error("❌ Error testing dashboard data:", error);
  } finally {
    mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
};

testDashboardData();
