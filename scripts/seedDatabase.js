const mongoose = require("mongoose");
const { seedUsers } = require("./seedDummyUsers");
const { seedInteractions } = require("./seedInteractions");
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

// Complete seeding process
const seedAll = async () => {
  try {
    console.log("🌟 Starting complete database seeding...");
    console.log("=" .repeat(50));
    
    await connectDB();
    
    // Step 1: Seed users
    console.log("\n📝 Step 1: Creating dummy users...");
    await seedUsers();
    
    // Wait a moment before creating interactions
    console.log("\n⏳ Waiting before creating interactions...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 2: Seed interactions (need to reconnect as previous scripts close connection)
    console.log("\n📝 Step 2: Creating user interactions...");
    await connectDB(); // Reconnect
    await seedInteractions();
    
    console.log("\n" + "=" .repeat(50));
    console.log("🎉 Database seeding completed successfully!");
    console.log("\n🚀 Your PeerFusion app is now ready for testing with:");
    console.log("   • 22 diverse user profiles");
    console.log("   • Various connection requests");
    console.log("   • Sample chat conversations");
    console.log("   • Premium and free users");
    console.log("\n💡 Login with any email from the dummy users using password: TechUser123!");
    
  } catch (error) {
    console.error("❌ Error in complete seeding:", error.message);
  }
};

// Run if called directly
if (require.main === module) {
  seedAll();
}

module.exports = { seedAll };
