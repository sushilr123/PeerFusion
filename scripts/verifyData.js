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

// Verify database content
const verifyData = async () => {
  try {
    console.log("🔍 Verifying database content...\n");

    // Users
    const users = await User.find({}).select(
      "firstName lastName emailId isPremium skills"
    );
    console.log(`👥 Total Users: ${users.length}`);
    console.log("📝 Sample Users:");
    users.slice(0, 5).forEach((user) => {
      console.log(
        `   • ${user.firstName} ${user.lastName} (${user.emailId}) - ${
          user.isPremium ? "Premium" : "Free"
        }`
      );
    });

    // Connection Requests
    const requests = await ConnectionRequest.find({}).populate(
      "fromUserId toUserId",
      "firstName lastName"
    );
    console.log(`\n🔗 Total Connection Requests: ${requests.length}`);
    const statusCounts = {
      interested: requests.filter((r) => r.status === "interested").length,
      accepted: requests.filter((r) => r.status === "accepted").length,
      ignored: requests.filter((r) => r.status === "ignored").length,
    };
    console.log(`   • Interested: ${statusCounts.interested}`);
    console.log(`   • Accepted: ${statusCounts.accepted}`);
    console.log(`   • Ignored: ${statusCounts.ignored}`);

    // Sample requests
    console.log("\n📝 Sample Connection Requests:");
    requests.slice(0, 3).forEach((req) => {
      console.log(
        `   • ${req.fromUserId.firstName} → ${req.toUserId.firstName} (${req.status})`
      );
    });

    // Chats
    const chats = await Chat.find({}).populate(
      "participants",
      "firstName lastName"
    );
    console.log(`\n💬 Total Chat Conversations: ${chats.length}`);
    let totalMessages = 0;
    chats.forEach((chat) => (totalMessages += chat.messages.length));
    console.log(`📩 Total Messages: ${totalMessages}`);

    // Sample chats
    console.log("\n📝 Sample Chat Conversations:");
    chats.slice(0, 3).forEach((chat, index) => {
      console.log(
        `   ${index + 1}. ${chat.participants[0].firstName} ↔ ${
          chat.participants[1].firstName
        } (${chat.messages.length} messages)`
      );
    });

    // Premium users
    const premiumUsers = users.filter((u) => u.isPremium);
    console.log(`\n💎 Premium Users: ${premiumUsers.length}`);
    premiumUsers.slice(0, 3).forEach((user) => {
      console.log(`   • ${user.firstName} ${user.lastName}`);
    });

    // Skills distribution
    const allSkills = [];
    users.forEach((user) => {
      if (user.skills) allSkills.push(...user.skills);
    });
    const skillCounts = {};
    allSkills.forEach((skill) => {
      skillCounts[skill] = (skillCounts[skill] || 0) + 1;
    });
    const topSkills = Object.entries(skillCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    console.log(`\n🛠️ Top Skills:`);
    topSkills.forEach(([skill, count]) => {
      console.log(`   • ${skill}: ${count} users`);
    });

    console.log(`\n✅ Database verification completed!`);
    console.log(`\n🎯 Ready for testing with:`);
    console.log(`   • ${users.length} diverse users`);
    console.log(`   • ${requests.length} connection requests`);
    console.log(`   • ${chats.length} chat conversations`);
    console.log(`   • ${premiumUsers.length} premium users`);
    console.log(`\n🔑 Login with: any email above, password: TechUser123!`);
  } catch (error) {
    console.error("❌ Error verifying data:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
};

// Run the verification
const main = async () => {
  await connectDB();
  await verifyData();
};

if (require.main === module) {
  main();
}

module.exports = { verifyData };
