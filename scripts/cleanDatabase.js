const mongoose = require("mongoose");
const User = require("../src/models/user");
const ConnectionRequest = require("../src/models/connectionRequest");
const Chat = require("../src/models/chat");
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

// Clean database function
const cleanDatabase = async () => {
  try {
    console.log("🧹 Starting database cleanup...");
    
    // Get counts before deletion
    const userCount = await User.countDocuments();
    const requestCount = await ConnectionRequest.countDocuments();
    const chatCount = await Chat.countDocuments();
    
    console.log(`\n📊 Current database state:`);
    console.log(`👥 Users: ${userCount}`);
    console.log(`🔗 Connection Requests: ${requestCount}`);
    console.log(`💬 Chat Messages: ${chatCount}`);
    
    // Confirm deletion
    console.log("\n⚠️  This will delete ALL data from the database!");
    console.log("🔄 Continuing in 3 seconds... (Press Ctrl+C to cancel)");
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Delete all data
    await Promise.all([
      Chat.deleteMany({}),
      ConnectionRequest.deleteMany({}),
      User.deleteMany({})
    ]);
    
    console.log("\n✅ Database cleaned successfully!");
    console.log("🌱 You can now run 'npm run seed' to add fresh dummy data");
    
  } catch (error) {
    console.error("❌ Error cleaning database:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
};

// Run the script
const main = async () => {
  await connectDB();
  await cleanDatabase();
};

if (require.main === module) {
  main();
}

module.exports = { cleanDatabase };
