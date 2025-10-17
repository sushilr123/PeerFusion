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

const removeAllDemoUsers = async () => {
  await connectDB();

  try {
    console.log("🔍 Checking current database status...");

    // Get all users to identify which are real vs demo
    const allUsers = await User.find({}).select(
      "firstName lastName emailId createdAt"
    );

    console.log(`\n👥 Current users in database (${allUsers.length}):`);
    allUsers.forEach((user, index) => {
      console.log(
        `   ${index + 1}. ${user.firstName} ${user.lastName} (${
          user.emailId
        }) - Created: ${user.createdAt.toLocaleDateString()}`
      );
    });

    // Identify real users (those likely created by actual signups)
    // Real users typically have common email domains like gmail, yahoo, outlook, or institutional domains
    const realEmailPatterns = [
      "@gmail.com",
      "@yahoo.com",
      "@outlook.com",
      "@hotmail.com",
      "@iitbhilai.ac.in",
      "@student.",
      "@university.",
      "@college.",
      "@iit.",
      "@nit.",
      "@edu",
    ];

    // Find real users (keep these)
    const realUsers = allUsers.filter((user) => {
      return realEmailPatterns.some((pattern) =>
        user.emailId.toLowerCase().includes(pattern.toLowerCase())
      );
    });

    // All other users are considered demo users
    const demoUsers = allUsers.filter((user) => {
      return !realEmailPatterns.some((pattern) =>
        user.emailId.toLowerCase().includes(pattern.toLowerCase())
      );
    });

    console.log(`\n✅ Real users to keep (${realUsers.length}):`);
    realUsers.forEach((user, index) => {
      console.log(
        `   ${index + 1}. ${user.firstName} ${user.lastName} (${user.emailId})`
      );
    });

    console.log(`\n🎯 Demo users to remove (${demoUsers.length}):`);
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

    // Get current counts
    const totalUsers = await User.countDocuments();
    const totalConnections = await ConnectionRequest.countDocuments();
    const totalChats = await Chat.countDocuments();

    console.log(`\n📊 Current database status:`);
    console.log(`   • Users: ${totalUsers}`);
    console.log(`   • Connection Requests: ${totalConnections}`);
    console.log(`   • Chats: ${totalChats}`);

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

removeAllDemoUsers();
