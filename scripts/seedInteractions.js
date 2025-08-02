const mongoose = require("mongoose");
const User = require("../src/models/user");
const ConnectionRequest = require("../src/models/connectionRequest");
const { Chat } = require("../src/models/chat");
require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL || "mongodb://localhost:27017/peerfusion");
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Generate random connection requests
const generateConnectionRequests = async () => {
  try {
    console.log("🔗 Generating connection requests...");
    
    const users = await User.find({});
    if (users.length < 2) {
      console.log("❌ Need at least 2 users to create connections");
      return;
    }

    const requests = [];
    const statuses = ["ignored", "interested", "accepted"];

    // Generate random connection requests
    for (let i = 0; i < Math.min(50, users.length * 2); i++) {
      const fromUser = users[Math.floor(Math.random() * users.length)];
      const toUser = users[Math.floor(Math.random() * users.length)];
      
      // Don't create self-connections or duplicate requests
      if (fromUser._id.toString() === toUser._id.toString()) continue;
      
      const existingRequest = requests.find(req => 
        (req.fromUserId.toString() === fromUser._id.toString() && req.toUserId.toString() === toUser._id.toString()) ||
        (req.fromUserId.toString() === toUser._id.toString() && req.toUserId.toString() === fromUser._id.toString())
      );
      
      if (existingRequest) continue;

      requests.push({
        fromUserId: fromUser._id,
        toUserId: toUser._id,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }

    if (requests.length > 0) {
      await ConnectionRequest.insertMany(requests);
      console.log(`✅ Created ${requests.length} connection requests`);
    }

    return requests;
  } catch (error) {
    console.error("❌ Error generating connection requests:", error.message);
  }
};

// Generate chat messages for accepted connections
const generateChatMessages = async () => {
  try {
    console.log("💬 Generating chat messages...");
    
    const acceptedConnections = await ConnectionRequest.find({ status: "accepted" })
      .populate("fromUserId toUserId");

    if (acceptedConnections.length === 0) {
      console.log("ℹ️  No accepted connections found for chat generation");
      return;
    }

    const sampleMessages = [
      "Hey! Great to connect with you!",
      "I saw your profile and love your work!",
      "Would you be interested in collaborating on a project?",
      "Your experience is impressive!",
      "I'm working on something similar, maybe we can share ideas?",
      "Thanks for accepting my connection request!",
      "I'd love to learn more about your experience",
      "Are you available for a quick chat?",
      "Your portfolio looks amazing!",
      "I'm also into similar technologies, would love to discuss best practices",
      "Have you worked with any interesting clients recently?",
      "I'm looking for advice, could you help?",
      "What's your favorite framework?",
      "I'm organizing a tech meetup, would you be interested?",
      "Your project caught my attention!"
    ];

    const chats = [];

    for (const connection of acceptedConnections.slice(0, 15)) { // Limit to 15 chats
      const user1 = connection.fromUserId;
      const user2 = connection.toUserId;
      
      // Create a chat between these two users
      const messages = [];
      const messageCount = Math.floor(Math.random() * 4) + 2; // 2-5 messages
      
      for (let i = 0; i < messageCount; i++) {
        const sender = Math.random() > 0.5 ? user1._id : user2._id;
        let message = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];

        messages.push({
          senderId: sender,
          text: message
        });
      }

      chats.push({
        participants: [user1._id, user2._id],
        messages: messages
      });
    }

    if (chats.length > 0) {
      await Chat.insertMany(chats);
      console.log(`✅ Created ${chats.length} chat conversations`);
    }

  } catch (error) {
    console.error("❌ Error generating chat messages:", error.message);
  }
};

// Main seeding function for interactions
const seedInteractions = async () => {
  try {
    console.log("🚀 Starting to seed user interactions...");
    
    await generateConnectionRequests();
    await generateChatMessages();
    
    // Display summary
    const totalRequests = await ConnectionRequest.countDocuments();
    const totalChats = await Chat.countDocuments();
    const acceptedConnections = await ConnectionRequest.countDocuments({ status: "accepted" });
    const pendingRequests = await ConnectionRequest.countDocuments({ status: "interested" });
    
    console.log("\n📊 Interaction Summary:");
    console.log(`🔗 Total Connection Requests: ${totalRequests}`);
    console.log(`✅ Accepted Connections: ${acceptedConnections}`);
    console.log(`⏳ Pending Requests: ${pendingRequests}`);
    console.log(`💬 Total Chat Messages: ${totalChats}`);
    
    console.log("\n🎯 What you can test now:");
    console.log("• View connection requests in different states");
    console.log("• Accept/reject connection requests");
    console.log("• Send new connection requests");
    console.log("• Chat with connected users");
    console.log("• Browse user profiles and feeds");
    console.log("• Test premium vs free user limitations");

  } catch (error) {
    console.error("❌ Error seeding interactions:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
};

// Run the script
const main = async () => {
  await connectDB();
  await seedInteractions();
};

if (require.main === module) {
  main();
}

module.exports = { seedInteractions };
