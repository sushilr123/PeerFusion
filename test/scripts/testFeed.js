const mongoose = require("mongoose");
const User = require("../src/models/user");
const ConnectionRequest = require("../src/models/connectionRequest");
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

const testFeedLogic = async () => {
  await connectDB();

  try {
    // Test with the user "sachin prakash" who we know exists
    const testUser = await User.findOne({
      emailId: "yadavsushilraj@gmail.com",
    });

    if (!testUser) {
      console.log("❌ Test user not found");
      return;
    }

    console.log(
      `\n🧪 Testing feed for user: ${testUser.firstName} ${testUser.lastName}`
    );
    console.log(`📧 Email: ${testUser.emailId}`);
    console.log(`🆔 User ID: ${testUser._id}`);

    // Get connection requests for this user
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: testUser._id }, { toUserId: testUser._id }],
    }).select("fromUserId toUserId status");

    console.log(
      `\n📊 Connection requests for this user: ${connectionRequests.length}`
    );

    if (connectionRequests.length > 0) {
      console.log("📝 Connection requests:");
      connectionRequests.forEach((req, index) => {
        const direction =
          req.fromUserId.toString() === testUser._id.toString() ? "→" : "←";
        const otherUserId =
          req.fromUserId.toString() === testUser._id.toString()
            ? req.toUserId
            : req.fromUserId;
        console.log(
          `   ${index + 1}. ${direction} User ${otherUserId} (${req.status})`
        );
      });
    }

    // Build the hide list (same logic as backend)
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    console.log(`\n🙈 Users to hide from feed: ${hideUsersFromFeed.size}`);

    // Get feed users (same logic as backend)
    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: testUser._id } },
      ],
    })
      .select("firstName lastName emailId")
      .limit(10);

    console.log(`\n👥 Users that should appear in feed: ${feedUsers.length}`);

    if (feedUsers.length > 0) {
      console.log("📋 Feed users:");
      feedUsers.forEach((user, index) => {
        console.log(
          `   ${index + 1}. ${user.firstName} ${user.lastName} (${
            user.emailId
          })`
        );
      });
    } else {
      console.log("⚠️  No users in feed - this might be the issue!");
    }

    // Get total users for comparison
    const totalUsers = await User.countDocuments();
    console.log(`\n📊 Total users in database: ${totalUsers}`);
    console.log(`📊 Users hidden from feed: ${hideUsersFromFeed.size}`);
    console.log(`📊 Current user (excluded): 1`);
    console.log(
      `📊 Expected feed users: ${totalUsers - hideUsersFromFeed.size - 1}`
    );
    console.log(`📊 Actual feed users: ${feedUsers.length}`);

    if (feedUsers.length === 0 && totalUsers > 1) {
      console.log("\n⚠️  POTENTIAL ISSUE DETECTED:");
      console.log(
        "There are users in the database but none appear in the feed."
      );
      console.log("This could mean:");
      console.log("1. All users have been liked/disliked already");
      console.log("2. There's an issue with the feed query logic");
      console.log("3. The test user has interacted with all other users");
    }
  } catch (error) {
    console.error("❌ Error testing feed logic:", error);
  } finally {
    mongoose.connection.close();
  }
};

testFeedLogic();
