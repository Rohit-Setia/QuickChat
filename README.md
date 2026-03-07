# QuickChat ⚡️

QuickChat is a scalable, real-time messaging application built with the MERN stack and Socket.io. It features instant messaging, secure JWT authentication, and a responsive modern UI designed with Tailwind CSS.

## 🚀 Features

- **Real-Time Communication**: Instant messaging powered by Socket.io.
- **Secure Authentication**: JWT-based auth with bcrypt password hashing.
- **Optimized Performance**: 
  - Uses MongoDB Aggregation pipelines for complex data retrieval to minimize memory usage.
  - Implements cursor-based pagination to load message history efficiently.
- **Robust Security**: Protected against Socket Spoofing and Regex Denial of Service (ReDoS) attacks.
- **Modern UI/UX**: Sleek, responsive design built with React 19 and Tailwind CSS v4.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router, Socket.io-client
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB, Mongoose

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)

## ⚙️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/QuickChat.git
   cd QuickChat
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file in the `Backend` directory and add the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   FRONTEND_URL=http://localhost:5173
   ```

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```
   Create a `.env` file in the `Frontend` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5000/api
   ```

## 🏃‍♂️ Running the Application

You will need two terminal windows to run the frontend and backend concurrently.

**Terminal 1 (Backend):**
```bash
cd Backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd Frontend
npm run dev
```

Open your browser and navigate to `http://localhost:5173` to start chatting!

## 🔐 Security & Scale Architecture

This project was refactored with production-readiness in mind:
- **No Socket Spoofing**: Messages are dispatched using HTTP routes secured by JWTs. The WebSocket layer is strictly used for one-way server-to-client real-time delivery to verify sender authenticity.
- **No Memory Sinks**: Complex queries (like fetching user contact lists) are offloaded to MongoDB using highly optimized `$aggregate` pipelines, preventing Node.js out-of-memory crashes.
- **Input Sanitization**: Database search routes automatically strip regex metacharacters, nullifying ReDoS (Regex Denial of Service) threats.

## 👨‍💻 Author

**Rohit Setia**
