const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../src/models/user");
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

// Dummy user data
const dummyUsers = [
  // Tech Professionals
  {
    firstName: "Alexandra",
    lastName: "Chen",
    emailId: "alexandra.chen@techpro.com",
    age: 28,
    gender: "female",
    photoUrl: "https://randomuser.me/api/portraits/women/1.jpg",
    about: "Full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies. Passionate about building scalable web applications and mentoring junior developers.",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "AWS", "Docker", "GraphQL"],
    isPremium: true,
    membershipType: "Gold"
  },
  {
    firstName: "Marcus",
    lastName: "Johnson",
    emailId: "marcus.johnson@devstudio.com",
    age: 32,
    gender: "male",
    photoUrl: "https://randomuser.me/api/portraits/men/1.jpg",
    about: "Senior DevOps engineer specializing in CI/CD pipelines and infrastructure automation. Love working with Kubernetes and helping teams deploy faster.",
    skills: ["Kubernetes", "Docker", "Jenkins", "Terraform", "Python", "Linux", "AWS"],
    isPremium: false
  },
  {
    firstName: "Priya",
    lastName: "Sharma",
    emailId: "priya.sharma@aitech.com",
    age: 26,
    gender: "female",
    photoUrl: "https://randomuser.me/api/portraits/women/2.jpg",
    about: "AI/ML engineer working on computer vision and natural language processing. PhD in Computer Science with focus on deep learning applications.",
    skills: ["Python", "TensorFlow", "PyTorch", "Computer Vision", "NLP", "Deep Learning", "Jupyter"],
    isPremium: true,
    membershipType: "Silver"
  },
  {
    firstName: "David",
    lastName: "Rodriguez",
    emailId: "david.rodriguez@mobileworks.com",
    age: 29,
    gender: "male",
    photoUrl: "https://randomuser.me/api/portraits/men/2.jpg",
    about: "Mobile app developer with expertise in iOS and Android. Published 12+ apps on app stores with millions of downloads.",
    skills: ["Swift", "Kotlin", "React Native", "Flutter", "iOS", "Android", "Firebase"],
    isPremium: false
  },
  {
    firstName: "Emily",
    lastName: "Watson",
    emailId: "emily.watson@cloudnine.com",
    age: 31,
    gender: "female",
    photoUrl: "https://randomuser.me/api/portraits/women/3.jpg",
    about: "Cloud architect designing scalable solutions for enterprise clients. Certified in AWS, Azure, and GCP with 8+ years of experience.",
    skills: ["AWS", "Azure", "GCP", "Microservices", "Serverless", "Lambda", "CloudFormation"],
    isPremium: true,
    membershipType: "Gold"
  },

  // Creative Professionals
  {
    firstName: "Jordan",
    lastName: "Kim",
    emailId: "jordan.kim@designstudio.com",
    age: 27,
    gender: "other",
    photoUrl: "https://randomuser.me/api/portraits/men/3.jpg",
    about: "UI/UX designer with a passion for creating intuitive and beautiful user experiences. Specialized in design systems and accessibility.",
    skills: ["Figma", "Sketch", "Adobe XD", "Prototyping", "User Research", "Design Systems", "Accessibility"],
    isPremium: false
  },
  {
    firstName: "Sarah",
    lastName: "Mitchell",
    emailId: "sarah.mitchell@creativeco.com",
    age: 25,
    gender: "female",
    photoUrl: "https://randomuser.me/api/portraits/women/4.jpg",
    about: "Digital marketing specialist and content creator. Expert in social media strategy, SEO, and data-driven marketing campaigns.",
    skills: ["Digital Marketing", "SEO", "Social Media", "Content Creation", "Analytics", "Adobe Creative Suite"],
    isPremium: true,
    membershipType: "Silver"
  },
  {
    firstName: "Alex",
    lastName: "Thompson",
    emailId: "alex.thompson@mediahouse.com",
    age: 30,
    gender: "male",
    photoUrl: "https://randomuser.me/api/portraits/men/4.jpg",
    about: "Video editor and motion graphics artist. Working on documentaries, commercials, and digital content for major brands.",
    skills: ["After Effects", "Premiere Pro", "Cinema 4D", "Motion Graphics", "Video Editing", "Color Grading"],
    isPremium: false
  },

  // Data & Analytics
  {
    firstName: "Lisa",
    lastName: "Zhang",
    emailId: "lisa.zhang@datainsights.com",
    age: 33,
    gender: "female",
    photoUrl: "https://randomuser.me/api/portraits/women/5.jpg",
    about: "Data scientist with expertise in machine learning and statistical analysis. PhD in Statistics, working on predictive models for finance.",
    skills: ["Python", "R", "SQL", "Machine Learning", "Statistics", "Tableau", "Power BI"],
    isPremium: true,
    membershipType: "Gold"
  },
  {
    firstName: "Michael",
    lastName: "Brown",
    emailId: "michael.brown@analyticsco.com",
    age: 28,
    gender: "male",
    photoUrl: "https://randomuser.me/api/portraits/men/5.jpg",
    about: "Business intelligence analyst helping companies make data-driven decisions. Expert in dashboard creation and data visualization.",
    skills: ["SQL", "Tableau", "Power BI", "Excel", "Python", "Data Warehousing", "ETL"],
    isPremium: false
  },

  // Cybersecurity
  {
    firstName: "Rachel",
    lastName: "Davis",
    emailId: "rachel.davis@cybersec.com",
    age: 35,
    gender: "female",
    photoUrl: "https://randomuser.me/api/portraits/women/6.jpg",
    about: "Cybersecurity expert with CISSP certification. Specialized in penetration testing and security architecture for enterprise systems.",
    skills: ["Penetration Testing", "Security Architecture", "CISSP", "Ethical Hacking", "Risk Assessment", "Compliance"],
    isPremium: true,
    membershipType: "Gold"
  },
  {
    firstName: "James",
    lastName: "Wilson",
    emailId: "james.wilson@infosec.com",
    age: 29,
    gender: "male",
    photoUrl: "https://randomuser.me/api/portraits/men/6.jpg",
    about: "Information security analyst with focus on incident response and threat hunting. SANS certified with 6+ years experience.",
    skills: ["Incident Response", "Threat Hunting", "SIEM", "Forensics", "Malware Analysis", "Network Security"],
    isPremium: false
  },

  // Product Management
  {
    firstName: "Amanda",
    lastName: "Lee",
    emailId: "amanda.lee@productcorp.com",
    age: 32,
    gender: "female",
    photoUrl: "https://randomuser.me/api/portraits/women/7.jpg",
    about: "Senior product manager with experience in B2B SaaS products. Led multiple successful product launches with focus on user-centric design.",
    skills: ["Product Strategy", "User Research", "Agile", "Roadmapping", "A/B Testing", "Analytics", "Stakeholder Management"],
    isPremium: true,
    membershipType: "Silver"
  },
  {
    firstName: "Kevin",
    lastName: "Garcia",
    emailId: "kevin.garcia@startuplife.com",
    age: 27,
    gender: "male",
    photoUrl: "https://randomuser.me/api/portraits/men/7.jpg",
    about: "Product owner at a fast-growing startup. Passionate about building products that solve real user problems and drive business growth.",
    skills: ["Product Management", "Scrum", "User Stories", "Market Research", "Competitive Analysis", "MVP Development"],
    isPremium: false
  },

  // Blockchain & Web3
  {
    firstName: "Sophia",
    lastName: "Martinez",
    emailId: "sophia.martinez@blockchain.com",
    age: 26,
    gender: "female",
    photoUrl: "https://randomuser.me/api/portraits/women/8.jpg",
    about: "Blockchain developer working on DeFi protocols and smart contracts. Expertise in Solidity and Web3 technologies.",
    skills: ["Solidity", "Web3", "Ethereum", "Smart Contracts", "DeFi", "Hardhat", "React"],
    isPremium: true,
    membershipType: "Gold"
  },
  {
    firstName: "Carlos",
    lastName: "Hernandez",
    emailId: "carlos.hernandez@cryptodev.com",
    age: 30,
    gender: "male",
    photoUrl: "https://randomuser.me/api/portraits/men/8.jpg",
    about: "Full-stack blockchain developer with experience in multiple blockchain networks. Building the future of decentralized applications.",
    skills: ["Blockchain", "Solidity", "Web3.js", "NFTs", "Polygon", "IPFS", "Metamask"],
    isPremium: false
  },

  // Game Development
  {
    firstName: "Jessica",
    lastName: "Taylor",
    emailId: "jessica.taylor@gamedev.com",
    age: 28,
    gender: "female",
    photoUrl: "https://randomuser.me/api/portraits/women/9.jpg",
    about: "Game developer specialized in Unity and Unreal Engine. Published several indie games and working on VR experiences.",
    skills: ["Unity", "Unreal Engine", "C#", "Game Design", "VR Development", "3D Modeling", "Animation"],
    isPremium: true,
    membershipType: "Silver"
  },
  {
    firstName: "Ryan",
    lastName: "Anderson",
    emailId: "ryan.anderson@indiegames.com",
    age: 31,
    gender: "male",
    photoUrl: "https://randomuser.me/api/portraits/men/9.jpg",
    about: "Indie game developer and pixel artist. Love creating retro-style games with modern gameplay mechanics.",
    skills: ["Game Development", "Pixel Art", "Godot", "Level Design", "Sound Design", "Steam Publishing"],
    isPremium: false
  },

  // Junior Developers
  {
    firstName: "Emma",
    lastName: "White",
    emailId: "emma.white@bootcamp.com",
    age: 24,
    gender: "female",
    photoUrl: "https://randomuser.me/api/portraits/women/10.jpg",
    about: "Recent coding bootcamp graduate looking to start my career in web development. Eager to learn and contribute to exciting projects.",
    skills: ["HTML", "CSS", "JavaScript", "React", "Git", "Node.js"],
    isPremium: false
  },
  {
    firstName: "Daniel",
    lastName: "Moore",
    emailId: "daniel.moore@juniordev.com",
    age: 23,
    gender: "male",
    photoUrl: "https://randomuser.me/api/portraits/men/10.jpg",
    about: "Computer Science graduate with internship experience at tech startups. Passionate about learning new technologies and solving complex problems.",
    skills: ["Java", "Python", "SQL", "Spring Boot", "React", "Git"],
    isPremium: true,
    membershipType: "Silver"
  },

  // Freelancers
  {
    firstName: "Natalie",
    lastName: "Clark",
    emailId: "natalie.clark@freelance.com",
    age: 29,
    gender: "female",
    photoUrl: "https://randomuser.me/api/portraits/women/11.jpg",
    about: "Freelance full-stack developer working with clients worldwide. Specialized in e-commerce solutions and custom web applications.",
    skills: ["Full-Stack Development", "E-commerce", "WordPress", "Shopify", "PHP", "MySQL", "Client Management"],
    isPremium: true,
    membershipType: "Gold"
  },
  {
    firstName: "Benjamin",
    lastName: "Lewis",
    emailId: "benjamin.lewis@consultant.com",
    age: 34,
    gender: "male",
    photoUrl: "https://randomuser.me/api/portraits/men/11.jpg",
    about: "Technology consultant helping businesses digital transformation. 10+ years experience in enterprise architecture and system integration.",
    skills: ["Enterprise Architecture", "System Integration", "Consulting", "Project Management", "Digital Transformation"],
    isPremium: false
  }
];

// Hash password function
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Seed function
const seedUsers = async () => {
  try {
    console.log("🌱 Starting to seed dummy users...");

    // Clear existing users (optional - comment out if you want to keep existing users)
    // await User.deleteMany({});
    // console.log("🗑️  Cleared existing users");

    // Hash passwords and create users
    const usersToCreate = await Promise.all(
      dummyUsers.map(async (user) => ({
        ...user,
        password: await hashPassword("TechUser123!") // Same password for all dummy users
      }))
    );

    // Insert users
    const createdUsers = await User.insertMany(usersToCreate);
    console.log(`✅ Successfully created ${createdUsers.length} dummy users`);

    // Display summary
    console.log("\n📊 User Summary:");
    console.log(`👥 Total Users: ${createdUsers.length}`);
    console.log(`👨 Male: ${createdUsers.filter(u => u.gender === 'male').length}`);
    console.log(`👩 Female: ${createdUsers.filter(u => u.gender === 'female').length}`);
    console.log(`🏳️‍🌈 Other: ${createdUsers.filter(u => u.gender === 'other').length}`);
    console.log(`💎 Premium Users: ${createdUsers.filter(u => u.isPremium).length}`);
    console.log(`🆓 Free Users: ${createdUsers.filter(u => !u.isPremium).length}`);

    console.log("\n🔑 Login Info for Testing:");
    console.log("📧 Email: Any email from the list above");
    console.log("🔒 Password: TechUser123! (same for all dummy users)");
    
    console.log("\n🎯 Test Scenarios Available:");
    console.log("• User authentication and login");
    console.log("• Profile browsing and connections");
    console.log("• Premium vs free user features");
    console.log("• Skill-based filtering and matching");
    console.log("• Chat functionality between users");
    console.log("• Payment testing with premium users");

  } catch (error) {
    console.error("❌ Error seeding users:", error.message);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Database connection closed");
  }
};

// Run the script
const main = async () => {
  await connectDB();
  await seedUsers();
};

if (require.main === module) {
  main();
}

module.exports = { seedUsers, dummyUsers };
