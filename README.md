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

**📋 Complete API Endpoints

##🔐 Authentication 
The authentication module consists of a three-step process.
First, users can register using the POST /api/auth/signup endpoint by providing their email and password. Upon successful signup, an OTP is generated and sent to the user’s email address, and the response confirms that the OTP has been sent.

Next, users verify their account using the POST /api/auth/verify-otp/:email/:otp endpoint. This endpoint validates the OTP, marks the user as verified, and returns the authenticated user object along with an access token and a refresh token.

Finally, verified users can log in using the POST /api/auth/signin endpoint by submitting their email and password. On successful authentication, the server returns a JWT access token and a refresh token, which are used to access protected routes.

##💬 Messages CRUD
The messaging system allows authenticated users to perform full CRUD operations on messages.
Users can create a new message using POST /api/messages, passing a valid JWT in the Authorization header along with the receiver ID, message content, and an optional file URL. The server responds with the created message and immediately broadcasts it in real time to the receiver via Socket.IO.

To retrieve chat history, users can call GET /api/messages/:userId, which returns all non-deleted messages exchanged between the logged-in user and the specified user.

Messages can be edited using PUT /api/messages/:id, where only the original sender is allowed to update the message content.
Messages can also be deleted using DELETE /api/messages/:id, which performs a soft delete by marking the message as deleted rather than removing it from the database.

All message routes require a valid JWT access token in the Authorization header.

##📎 File Upload
File uploads are handled via the POST /api/files/upload endpoint. Authenticated users can upload a single file (such as an image or PDF) using multipart/form-data. Upon successful upload, the API responds with the file’s URL path.

Uploaded files are served statically and can be accessed directly using:
http://localhost:3000/uploads/filename.jpg

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

npm start

##🔍 Database Schema
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

##🎯 Success Metrics Achieved

✅ 100% REST API coverage
✅ Real-time Socket.IO working
✅ File upload + static serving
✅ JWT + Refresh token flow
✅ Redis OTP + Session management
✅ Production-ready error handling
✅ Postman collection ready
✅ Environment configuration

Built by: [Syeda Umme Kulsum] | Shivamogga, Karnataka | Jan 2026