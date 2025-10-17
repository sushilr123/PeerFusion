const mongoose = require("mongoose");
const { Chat } = require("../src/models/chat");
const User = require("../src/models/user");
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

const testChatPersistence = async () => {
  await connectDB();

  try {
    console.log("🔍 Testing chat persistence...\n");

    // Get all users
    const users = await User.find({}).select("firstName lastName emailId");
    console.log(`📊 Found ${users.length} users in database:`);
    users.forEach((user, index) => {
      console.log(
        `   ${index + 1}. ${user.firstName} ${user.lastName} (${user.emailId})`
      );
    });

    // Get all chats
    const chats = await Chat.find({})
      .populate({
        path: "messages.senderId",
        select: "firstName lastName",
      })
      .populate({
        path: "participants",
        select: "firstName lastName emailId",
      });

    console.log(`\n💬 Found ${chats.length} chat conversations:`);

    if (chats.length === 0) {
      console.log("   No chat conversations found.");
      console.log("   This is normal if no messages have been sent yet.");
    } else {
      chats.forEach((chat, index) => {
        console.log(`\n   Chat ${index + 1}:`);
        console.log(
          `   Participants: ${chat.participants
            .map((p) => `${p.firstName} ${p.lastName}`)
            .join(" & ")}`
        );
        console.log(`   Messages: ${chat.messages.length}`);

        if (chat.messages.length > 0) {
          console.log("   Recent messages:");
          chat.messages.slice(-3).forEach((msg, msgIndex) => {
            const sender = msg.senderId
              ? `${msg.senderId.firstName} ${msg.senderId.lastName}`
              : "Unknown";
            const time = new Date(msg.createdAt).toLocaleString();
            console.log(
              `     ${msgIndex + 1}. [${time}] ${sender}: ${msg.text}`
            );
          });
        }
      });
    }

    console.log("\n✅ Chat persistence test completed!");
    console.log("\n📋 To test chat persistence:");
    console.log("   1. Open the app at http://localhost:5173");
    console.log("   2. Login with any user");
    console.log("   3. Go to Chat page");
    console.log("   4. Send messages to a connection");
    console.log("   5. Refresh the page");
    console.log("   6. Check if messages are still there");
    console.log("   7. Run this script again to see database state");
  } catch (error) {
    console.error("❌ Error testing chat persistence:", error);
  } finally {
    mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
};

testChatPersistence();
