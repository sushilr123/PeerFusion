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

const removeDemoUsers = async () => {
  await connectDB();

  try {
    console.log("🔍 Checking current database status...");

    // Get current counts
    const totalUsers = await User.countDocuments();
    const totalConnections = await ConnectionRequest.countDocuments();
    const totalChats = await Chat.countDocuments();

    console.log(`📊 Current database status:`);
    console.log(`   • Users: ${totalUsers}`);
    console.log(`   • Connection Requests: ${totalConnections}`);
    console.log(`   • Chats: ${totalChats}`);

    // Get all users to identify demo vs real users
    const allUsers = await User.find({}).select(
      "firstName lastName emailId createdAt"
    );

    console.log("\n👥 Current users in database:");
    allUsers.forEach((user, index) => {
      console.log(
        `   ${index + 1}. ${user.firstName} ${user.lastName} (${
          user.emailId
        }) - Created: ${user.createdAt.toLocaleDateString()}`
      );
    });

    // Demo users typically have specific email patterns or were created by seeding scripts
    // Let's identify demo users by common patterns
    const demoEmailPatterns = [
      "@techpro.com",
      "@devstudio.com",
      "@aitech.com",
      "@mobileworks.com",
      "@cloudnine.com",
      "@creativeco.com",
      "@mediahouse.com",
      "@datainsights.com",
      "@analyticsco.com",
      "@infosec.com",
      "@productcorp.com",
      "@startuplife.com",
      "@webdev.io",
      "@designhub.com",
      "@gamedev.studio",
      "@fintech.co",
      "@edtech.org",
      "@healthtech.com",
      "@greentech.io",
      "@biotech.lab",
      "@example.com",
      "@test.com",
      "@demo.com",
    ];

    // Find demo users
    const demoUsers = await User.find({
      emailId: {
        $regex: demoEmailPatterns
          .map((pattern) => pattern.replace("@", "\\@"))
          .join("|"),
        $options: "i",
      },
    });

    console.log(`\n🎯 Found ${demoUsers.length} demo users to remove:`);
    demoUsers.forEach((user, index) => {
      console.log(
        `   ${index + 1}. ${user.firstName} ${user.lastName} (${user.emailId})`
      );
    });

    if (demoUsers.length === 0) {
      console.log("✅ No demo users found to remove!");
      return;
    }

    // Get demo user IDs
    const demoUserIds = demoUsers.map((user) => user._id);

    console.log("\n🗑️  Starting cleanup process...");

    // 1. Remove connection requests involving demo users
    const connectionDeleteResult = await ConnectionRequest.deleteMany({
      $or: [
        { fromUserId: { $in: demoUserIds } },
        { toUserId: { $in: demoUserIds } },
      ],
    });
    console.log(
      `   • Deleted ${connectionDeleteResult.deletedCount} connection requests`
    );

    // 2. Remove chats involving demo users
    const chatDeleteResult = await Chat.deleteMany({
      participants: { $in: demoUserIds },
    });
    console.log(
      `   • Deleted ${chatDeleteResult.deletedCount} chat conversations`
    );

    // 3. Remove demo users
    const userDeleteResult = await User.deleteMany({
      _id: { $in: demoUserIds },
    });
    console.log(`   • Deleted ${userDeleteResult.deletedCount} demo users`);

    // Final status check
    const finalUsers = await User.countDocuments();
    const finalConnections = await ConnectionRequest.countDocuments();
    const finalChats = await Chat.countDocuments();

    console.log("\n✅ Cleanup completed!");
    console.log(`📊 Final database status:`);
    console.log(
      `   • Users: ${finalUsers} (reduced by ${totalUsers - finalUsers})`
    );
    console.log(
      `   • Connection Requests: ${finalConnections} (reduced by ${
        totalConnections - finalConnections
      })`
    );
    console.log(
      `   • Chats: ${finalChats} (reduced by ${totalChats - finalChats})`
    );

    // Show remaining users
    const remainingUsers = await User.find({}).select(
      "firstName lastName emailId"
    );
    if (remainingUsers.length > 0) {
      console.log(`\n👥 Remaining users (${remainingUsers.length}):`);
      remainingUsers.forEach((user, index) => {
        console.log(
          `   ${index + 1}. ${user.firstName} ${user.lastName} (${
            user.emailId
          })`
        );
      });
    } else {
      console.log(
        "\n🔄 Database is now clean - only real user signups will remain"
      );
    }
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
  } finally {
    mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
};

removeDemoUsers();
