# 🌟 PeerFusion

**A Modern Networking Platform for Developers**

Connect, Collaborate, and Build Your Professional Network

![PeerFusion Banner](https://img.shields.io/badge/PeerFusion-Developer%20Networking-ff4458?style=for-the-badge&logo=react&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-16+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19+-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.8+-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io/)
[![Vite](https://img.shields.io/badge/Vite-7.0+-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

---

## 🚀 Project Overview

PeerFusion is a full-stack MERN application that serves as a networking platform for developers. Think of it as "Tinder for Developers" - where professionals can discover, connect, and build meaningful relationships with fellow developers worldwide.

### 🎯 **Core Concept**

A swipe-based discovery platform where developers can:
- Discover other developers based on skills and interests
- Send connection requests in a Tinder-like interface
- Chat in real-time with accepted connections
- Upgrade to premium memberships for enhanced features
- Manage their professional developer profile

### � **What Makes PeerFusion Special**

- **Swipe-to-Connect**: Intuitive Tinder-like interface for developer discovery
- **Real-time Messaging**: Instant chat with Socket.io integration
- **Premium Features**: Tiered subscription model with Razorpay integration
- **Modern Tech Stack**: Built with latest React 19, Node.js, and MongoDB
- **Professional Focus**: Designed specifically for developer networking needs

---

## ✨ Key Features

### 🔐 **Authentication & Security**
- **JWT-based Authentication** - Secure token-based login/signup system
- **Password Encryption** - bcrypt hashing for secure password storage
- **Protected Routes** - Authentication middleware for secure endpoints
- **Cookie-based Sessions** - Secure session management with HTTP-only cookies

### 👤 **User Profile Management**
- **Comprehensive Profiles** - First name, last name, email, age, gender
- **Bio & About Section** - Rich profile descriptions and personal information
- **Skill Tags** - Showcase technical skills and expertise
- **Photo URLs** - Profile picture support with URL-based image system
- **Profile Validation** - Robust validation using validator.js

### 🤝 **Connection System**
- **Swipe-based Discovery** - Tinder-like interface for finding developers
- **Connection Requests** - Send, accept, reject, or ignore connection requests
- **Smart Feed Algorithm** - Discover developers you haven't interacted with
- **Connection Status Tracking** - Monitor all connection states and history
- **Interest-based Matching** - Connect with developers based on shared skills

### 💬 **Real-time Chat System**
- **Socket.io Integration** - Instant messaging with real-time updates
- **Private Messaging** - One-on-one conversations between connections
- **Message Persistence** - Chat history stored in MongoDB
- **Online Status Indicators** - See who's currently active
- **Message Notifications** - Real-time chat notifications

### 💎 **Premium Membership System**
- **Razorpay Integration** - Secure payment processing for Indian market
- **Multiple Tiers** - Silver (₹300/month) and Gold (₹700/3 months) plans
- **Premium-only Features** - Enhanced functionality for subscribers
- **Subscription Management** - Handle recurring payments and renewals
- **Payment History** - Track all subscription transactions

### 📊 **Dashboard & Analytics**
- **Personal Dashboard** - Overview of connections, messages, and activity
- **Connection Statistics** - Track your networking progress
- **Recent Activity** - Monitor latest interactions and connections
- **Profile Management** - Easy profile editing and updates

---

## 🛠️ Technology Stack

### **Backend Architecture**

```
Node.js + Express.js
├── Authentication: JWT + bcrypt
├── Database: MongoDB + Mongoose ODM  
├── Real-time: Socket.io 4.8+
├── Payments: Razorpay Gateway
├── Email: AWS SES Client
├── Validation: Validator.js
├── Security: CORS + Cookie Parser
├── Scheduling: Node-cron
└── Utilities: Date-fns
```

### **Frontend Architecture**

```
React 19 + Vite 7.0
├── Routing: React Router DOM v7
├── State Management: Context API + useAuth Hook
├── HTTP Client: Axios
├── Real-time: Socket.io Client 4.8+
├── Icons: Lucide React
├── Styling: Custom CSS + CSS Modules
├── Forms: Custom Form Handling
└── Build Tool: Vite + ESLint 9.0
```

### **Database Schema**

```
MongoDB Collections:
├── users: User profiles and authentication data
├── connectionrequests: Connection request management
├── chats: Real-time message storage
├── payments: Premium subscription tracking
└── sessions: User session management
```

### **Development Tools**

```
Development Environment:
├── Concurrently: Run backend + frontend simultaneously
├── Nodemon: Auto-restart backend on changes
├── ESLint: Code linting for React
├── Vite: Fast frontend build tool
└── MongoDB: Local database development
```

---

## � Project Structure

```
PeerFusion/
├── Backend/                     # Express.js Backend
│   ├── app.js                  # Main application entry point
│   ├── config/
│   │   └── database.js         # MongoDB connection configuration
│   ├── middlewares/
│   │   └── auth.js             # JWT authentication middleware
│   ├── models/                 # Mongoose schemas
│   │   ├── chat.js            # Chat message model
│   │   ├── connectionRequest.js # Connection request model
│   │   ├── payment.js         # Payment transaction model
│   │   └── user.js            # User profile model
│   ├── routes/                # API endpoints
│   │   ├── auth.js           # Authentication routes
│   │   ├── chat.js           # Chat functionality routes
│   │   ├── payment.js        # Payment processing routes
│   │   ├── profile.js        # User profile routes
│   │   ├── request.js        # Connection request routes
│   │   └── user.js           # User management routes
│   └── utils/                # Backend utilities
│       ├── constants.js      # Application constants
│       ├── cronjob.js        # Scheduled tasks
│       ├── razorpay.js       # Payment gateway setup
│       ├── sendEmail.js      # Email service functions
│       ├── sesClient.js      # AWS SES configuration
│       ├── socket.js         # Socket.io configuration
│       └── validation.js     # Input validation helpers
├── Frontend/                   # React.js Frontend
│   ├── index.html             # Main HTML template
│   ├── vite.config.js         # Vite build configuration
│   ├── eslint.config.js       # ESLint configuration
│   ├── public/                # Static assets
│   └── src/
│       ├── App.jsx           # Main React component
│       ├── main.jsx          # React entry point
│       ├── components/       # Reusable UI components
│       │   ├── Navbar.jsx   # Navigation component
│       │   └── ProtectedRoute.jsx # Route protection
│       ├── contexts/         # React Context providers
│       │   ├── AuthContext.jsx     # Authentication context
│       │   └── AuthContextDefinition.js # Auth context types
│       ├── hooks/           # Custom React hooks
│       │   └── useAuth.js   # Authentication hook
│       ├── pages/           # Page components
│       │   ├── Chat.jsx     # Real-time chat interface
│       │   ├── Connections.jsx # Manage connections
│       │   ├── Dashboard.jsx # User dashboard
│       │   ├── Feed.jsx     # Developer discovery feed
│       │   ├── Landing.jsx  # Landing page
│       │   ├── Login.jsx    # Login form
│       │   ├── Premium.jsx  # Premium subscription page
│       │   ├── Profile.jsx  # User profile management
│       │   └── Signup.jsx   # Registration form
│       ├── services/        # API integration
│       │   ├── api.js       # Axios HTTP client
│       │   └── socket.js    # Socket.io client
│       └── utils/           # Frontend utilities
│           └── helpers.js   # Helper functions
├── test/                      # Testing and documentation
│   ├── scripts/              # Database and testing scripts
│   │   ├── cleanDatabase.js         # Database cleanup
│   │   ├── removeAllDemoUsers.js    # Remove demo data
│   │   ├── removeDemoUsers.js       # Selective demo cleanup
│   │   ├── seedDatabase.js          # Database seeding
│   │   ├── seedDummyUsers.js        # Generate test users
│   │   ├── seedInteractions.js      # Generate test interactions
│   │   ├── testChatPersistence.js   # Test chat functionality
│   │   ├── testDashboard.js         # Test dashboard features
│   │   ├── testFeed.js             # Test feed algorithm
│   │   └── verifyData.js           # Data integrity checks
│   └── *.md                  # Various documentation files
├── package.json              # Backend dependencies
└── README.md                 # Project documentation
```
## 🚦 Getting Started

### **Prerequisites**

Before running PeerFusion, ensure you have:

```bash
Node.js: 16.0.0 or higher
MongoDB: 4.4.0 or higher  
npm: 8.0.0 or higher
Git: Latest version
```

### **Quick Installation**

1. **Clone Repository**

   ```bash
   git clone https://github.com/sushilr123/PeerFusion.git
   cd PeerFusion
   ```

2. **Install Backend Dependencies**

   ```bash
   npm install
   ```

3. **Install Frontend Dependencies**

   ```bash
   cd Frontend
   npm install
   cd ..
   ```

4. **Environment Setup**

   Create a `.env` file in the root directory:

   ```env
   # Database Configuration
   DATABASE_URL=mongodb://localhost:27017/peerfusion
   
   # JWT Security
   JWT_SECRET=PEER@Fusion$790_SecureKey_2025
   
   # Server Configuration
   PORT=7777
   NODE_ENV=development
   
   # Payment Gateway (Razorpay)
   RAZORPAY_KEY_ID=rzp_test_your_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   
   # Email Service (AWS SES)
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   ```

5. **Start MongoDB**

   ```bash
   # Windows
   mongod
   
   # Linux/Mac
   sudo systemctl start mongodb
   # or
   brew services start mongodb-community
   ```

6. **Start Development Servers**

   **Option 1: Run Both Servers Simultaneously**
   ```bash
   npm run dev:both
   ```

   **Option 2: Run Servers Separately**
   ```bash
   # Terminal 1: Backend Server
   npm run dev
   
   # Terminal 2: Frontend Server  
   npm run dev:frontend
   ```

7. **Access Application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:7777
   - **MongoDB**: mongodb://localhost:27017/peerfusion

### **Available Scripts**

```bash
# Backend
npm start          # Start production server
npm run dev        # Start development server with nodemon

# Frontend  
npm run dev:frontend    # Start Vite development server
npm run dev:both       # Start both backend and frontend

# Development
cd Frontend && npm run build    # Build frontend for production
cd Frontend && npm run lint     # Run ESLint on frontend code
```

# Email Service (AWS SES)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
SES_FROM_EMAIL=noreply@peerfusion.com

# File Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# External APIs
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret