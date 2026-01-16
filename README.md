# 🚀 Real-time Chat API - Fullstack Assignment

## ✨ Features Implemented
- ✅ **User Authentication** (JWT + OTP Email Verification)
- ✅ **Messages CRUD** (Create, Read, Update, Delete - Soft Delete)
- ✅ **File Uploads** (Images, PDFs → `/uploads/` static serving)
- ✅ **Socket.IO Real-time Messaging** (2-way chat)
- ✅ **Redis Session Management** (OTP + Refresh Tokens)
- ✅ **MongoDB** (User + Message collections)
- ✅ **Nodemailer** (OTP emails)
- ✅ **Input Validation** (Joi/Zod)
- ✅ **Error Handling** (Global middleware)

## 🛠️ Quick Setup (2 Minutes)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd chat-api
npm install

2. Environment Variables (.env)

# MongoDB
MONGO_URI=mongodb://localhost:27017/chatapp

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Email (for OTP)
NODEMAILER_EMAIL=your-email@gmail.com
NODEMAILER_PASS=your-app-password

# Server
PORT=3000

3. Start Server

npm run dev

Server runs on: http://localhost:3000

📋 Complete API Endpoints
🔐 Authentication (3 Steps)

| Method | Endpoint | Headers | Request Body | Response |
|--------|----------|---------|--------------|----------|
| `POST` | `/api/auth/signup` | `-` | `{"email": "user@gmail.com", "password": "123456"}` | `{"otpSent": true, "message": "OTP sent to email"}` |
| `POST` | `/api/auth/verify-otp/:email/:otp` | `-` | `-` | `{"user": {...}, "accessToken": "jwt...", "refreshToken": "jwt..."}` |
| `POST` | `/api/auth/signin` | `-` | `{"email": "user@gmail.com", "password": "123456"}` | `{"accessToken": "jwt...", "refreshToken": "jwt..."}` |

💬 Messages CRUD

| Method | Endpoint | Headers | Request Body | Response |
|--------|----------|---------|--------------|----------|
| `POST` | `/api/messages` | `Authorization: Bearer <jwt>` | `{"receiverId": "user2_id", "content": "Hello!", "fileUrl": "/uploads/img.jpg"}` | `201: {"message": {...}}` |
| `GET` | `/api/messages/:userId` | `Authorization: Bearer <jwt>` | `-` | `200: [{"_id": "...", "content": "Hello!", "senderId": {...}, "receiverId": {...}}]` |
| `PUT` | `/api/messages/:id` | `Authorization: Bearer <jwt>` | `{"content": "Updated message"}` | `200: {"message": {...}}` |
| `DELETE` | `/api/messages/:id` | `Authorization: Bearer <jwt>` | `-` | `200: {"deleted": true}` |

📎 File Upload

| Method | Endpoint | Headers | Request Body | Response |
|--------|----------|---------|--------------|----------|
| `POST` | `/api/files/upload` | `Authorization: Bearer <jwt>` | **form-data:** `file: (select image.jpg)` | `200: {"fileUrl": "/uploads/1678901234567.jpg"}` |

**File Access:** `http://localhost:3000/uploads/filename.jpg`

🗝️ JWT + Refresh Token Flow

1. SIGNUP → Email OTP (Redis TTL: 5min)
2. VERIFY OTP → User verified + Access(15min) + Refresh(7days)
3. SIGNIN → Same tokens issued
4. REFRESH → POST /api/auth/refresh → New access token
5. All protected routes → Authorization: Bearer <access_token>

🔴 Redis Key Structure

OTP Storage:
user:{email}:otp → "123456" (TTL: 300s)

Refresh Token Sessions:
session:{userId}:{jti} → "refresh_token_string" (TTL: 7days)

🛠️ Technology Stack

Backend: Node.js + Express.js
Database: MongoDB + Mongoose (ObjectId refs)
Real-time: Socket.IO (JWT auth middleware)
Cache: Redis (OTP + Sessions)
Email: Nodemailer (Gmail SMTP)
Auth: JWT (access:15m, refresh:7d)
File: Multer + Static serving
Validation: Joi schemas

🚀 Running the Project
# Development (nodemon)
npm run dev

# Production
npm start

# Postman Collection
Import "realtime_chat" collection from workspace

🔍 Database Schema
User:
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  isVerified: Boolean,
  createdAt: Date
}

Message:
{
  _id: ObjectId,
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User), 
  content: String,
  fileUrl: String,
  isDeleted: Boolean (soft delete),
  createdAt: Date
}

🎯 Success Metrics Achieved

✅ 100% REST API coverage
✅ Real-time Socket.IO working
✅ File upload + static serving
✅ JWT + Refresh token flow
✅ Redis OTP + Session management
✅ Production-ready error handling
✅ Postman collection ready
✅ Environment configuration

Built by: [Syeda Umme Kulsum] | Shivamogga, Karnataka | Jan 2026