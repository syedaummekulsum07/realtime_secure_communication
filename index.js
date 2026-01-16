require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/authRoute");
const messageRoutes = require("./routes/messageRoute");
const fileRoutes = require("./routes/fileRoute");
const connectRedis = require("./config/redis");
const { authenticateSocket } = require("./middleware/authMiddleware");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

console.log("Socket.IO server started");

app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("Database connected");
});
// connectRedis();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/files", fileRoutes);

io.use(authenticateSocket);
io.on("connection", (socket) => {
  socket.on("sendMessage", (data) => {
    console.log("Message from", socket.userId, "to", data.receiverId);
    socket.to(data.receiverId).emit("newMessage", data);
  });

  socket.on("disconnect", () => {
    console.log(`Socket DISCONNECTED: ${socket.userId}`);
  });
});
global.io = io;

server.listen(process.env.PORT, () =>
  console.log(`Server on port ${process.env.PORT}`)
);
