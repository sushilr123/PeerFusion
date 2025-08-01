# PeerFusion

A modern networking platform for developers to connect, collaborate, and grow together.

## 🚀 Project Overview

PeerFusion is a full-stack application designed to help developers find like-minded peers, build professional connections, and collaborate on projects. Think of it as a networking platform tailored specifically for the developer community.

## 🛠️ Tech Stack

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Socket.io** for real-time chat
- **bcrypt** for password hashing
- **Razorpay** for payment processing

### Frontend

- **React 18** with Vite
- **React Router DOM** for navigation
- **Axios** for API calls
- **Socket.io Client** for real-time features
- **Lucide React** for icons

## 📱 Features

### ✅ Implemented

- **User Authentication** - Secure login/signup with JWT
- **Profile Management** - Complete user profiles with skills and bio
- **Connection System** - Send/receive connection requests
- **Real-time Chat** - Messaging between connected users
- **Feed System** - Discover new developers
- **Premium Features** - Paid membership with enhanced features
- **Responsive Design** - Works on all devices

### 🔜 Coming Soon

- **Project Collaboration** - Team up on projects
- **Skill Matching** - Algorithm-based developer matching
- **Events & Meetups** - Organize and join developer events
- **Mentor System** - Connect with mentors and mentees

## 🚦 Getting Started

### Prerequisites

- Node.js 16+
- MongoDB running locally
- npm or yarn

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd peerfusion
   ```

2. **Install backend dependencies**:

   ```bash
   npm install
   ```

3. **Install frontend dependencies**:

   ```bash
   cd fronted
   npm install
   cd ..
   ```

4. **Set up environment variables**:

   - Copy `.env.example` to `.env`
   - Update the values according to your setup

5. **Start MongoDB**:

   ```bash
   mongod
   ```

6. **Start the backend server**:

   ```bash
   npm start
   ```

7. **Start the frontend** (in a new terminal):

   ```bash
   cd fronted
   npm run dev
   ```

8. **Access the application**:
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:7777`

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_CONNECTION_SECRET=mongodb://localhost:27017/peerfusion

# JWT
JWT_SECRET=PEER@Fusion$790

# Server
PORT=7777

# Payment (Razorpay)
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# Email (AWS SES)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
```

## 📁 Project Structure

```
peerfusion/
├── fronted/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── utils/           # Helper functions
│   └── package.json
├── src/                     # Express backend
│   ├── config/              # Database configuration
│   ├── middlewares/         # Custom middlewares
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   └── utils/               # Backend utilities
├── .env                     # Environment variables
└── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

**Built with ❤️**
