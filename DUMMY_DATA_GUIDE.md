# PeerFusion Dummy Data Guide

This guide explains how to use the dummy data scripts to populate your PeerFusion database for testing.

## 🚀 Quick Start

### 1. Seed Complete Database
```bash
npm run seed
```
This will create all dummy users, connection requests, and chat messages in one go.

### 2. Individual Seeding (Optional)
```bash
# Create only dummy users
npm run seed:users

# Create only interactions (requires existing users)
npm run seed:interactions

# Clean entire database
npm run clean
```

## 👥 Dummy Users Created

The script creates **22 diverse user profiles** representing different tech roles:

### Tech Professionals (8 users)
- **Alexandra Chen** - Full-stack Developer (Premium Gold)
- **Marcus Johnson** - DevOps Engineer (Free)
- **Priya Sharma** - AI/ML Engineer (Premium Silver)
- **David Rodriguez** - Mobile Developer (Free)
- **Emily Watson** - Cloud Architect (Premium Gold)
- **Lisa Zhang** - Data Scientist (Premium Gold)
- **Michael Brown** - BI Analyst (Free)
- **Sophia Martinez** - Blockchain Developer (Premium Gold)

### Creative & Specialized (6 users)
- **Jordan Kim** - UI/UX Designer (Free)
- **Sarah Mitchell** - Digital Marketing (Premium Silver)
- **Alex Thompson** - Video Editor (Free)
- **Rachel Davis** - Cybersecurity Expert (Premium Gold)
- **James Wilson** - InfoSec Analyst (Free)
- **Carlos Hernandez** - Blockchain Developer (Free)

### Product & Gaming (4 users)
- **Amanda Lee** - Senior Product Manager (Premium Silver)
- **Kevin Garcia** - Product Owner (Free)
- **Jessica Taylor** - Game Developer (Premium Silver)
- **Ryan Anderson** - Indie Game Developer (Free)

### Junior & Freelance (4 users)
- **Emma White** - Bootcamp Graduate (Free)
- **Daniel Moore** - CS Graduate (Premium Silver)
- **Natalie Clark** - Freelance Developer (Premium Gold)
- **Benjamin Lewis** - Tech Consultant (Free)

## 🔑 Login Credentials

**Email**: Use any email from the user list above (e.g., `alexandra.chen@techpro.com`)
**Password**: `TechUser123!` (same for all dummy users)

## 🎯 Test Scenarios Available

### 1. User Authentication
- Login with different user types (premium/free)
- Test profile viewing and editing
- Test password validation

### 2. Connection System
- Send connection requests
- Accept/reject requests
- View pending/accepted connections
- Test different connection states

### 3. Chat Functionality
- Chat with connected users
- View chat history
- Test real-time messaging

### 4. Premium Features
- Compare premium vs free user capabilities
- Test premium-only features
- Payment flow testing

### 5. Skill-based Matching
- Filter users by skills
- Browse diverse skill sets
- Test recommendation algorithms

### 6. Profile Diversity
- Different age groups (23-35)
- Various skill combinations
- Different experience levels
- Gender diversity

## 📊 Generated Data Statistics

After seeding, you'll have:
- **22 Users** with diverse profiles
- **~50 Connection Requests** in various states
- **~30-50 Chat Messages** between connected users
- **Mix of Premium/Free users** for feature testing
- **Realistic skill combinations** across tech domains

## 🛠️ Database Management

### Clean Database
```bash
npm run clean
```
⚠️ **Warning**: This deletes ALL data from your database!

### Re-seed After Changes
```bash
npm run clean && npm run seed
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Error**
   ```
   Error: MongoDB connection failed
   ```
   **Solution**: Ensure MongoDB is running and check your DATABASE_URL in `.env`

2. **Duplicate Key Error**
   ```
   Error: E11000 duplicate key error
   ```
   **Solution**: Run `npm run clean` first, then `npm run seed`

3. **No Interactions Created**
   ```
   No accepted connections found for chat generation
   ```
   **Solution**: This is normal on first run. The script creates random connection states.

### Environment Setup

Make sure your `.env` file has:
```env
DATABASE_URL=mongodb://localhost:27017/peerfusion
JWT_SECRET=your-secret-key
```

## 📝 Customizing Dummy Data

### Adding More Users
Edit `scripts/seedDummyUsers.js` and add to the `dummyUsers` array:

```javascript
{
  firstName: "Your",
  lastName: "Name",
  emailId: "unique@email.com",
  age: 25,
  gender: "female",
  photoUrl: "https://example.com/photo.jpg",
  about: "Your description...",
  skills: ["Skill1", "Skill2"],
  isPremium: false
}
```

### Modifying Chat Messages
Edit `scripts/seedInteractions.js` and update the `sampleMessages` array with your preferred conversation starters.

## 🔄 Development Workflow

1. **Start Development**: `npm run dev`
2. **Seed Database**: `npm run seed`
3. **Test Features**: Use dummy user credentials
4. **Clean & Re-seed**: `npm run clean && npm run seed`
5. **Deploy**: Use production seeding for staging environments

## 💡 Pro Tips

- Use different dummy users to test various user flows
- Premium users can test payment-related features
- Mix of connection states helps test all UI scenarios
- Different skill combinations test search/filter functionality
- Age and experience diversity helps test user preferences

Happy Testing! 🚀
