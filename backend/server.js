import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/Routes.js";
import authRoutes from "./routes/auth.route.js";
import listingRoutes from "./routes/listing.route.js";
import chatRoutes from "./routes/chat.route.js";
import cookieParser from "cookie-parser";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Chat from "./models/Chat.js";
import User from "./models/UserModel.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

const MONGO_URL = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/listing", listingRoutes);
app.use("/api/chat", chatRoutes);

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"));
});

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
  console.log("Authenticating WebSocket connection...");

  if (!token) {
    console.log("No token provided");
    return next(new Error("Authentication error"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("Token verification failed:", err.message);
      return next(new Error("Authentication error"));
    }
    console.log("Token verified, user:", decoded);
    socket.user = decoded;
    next();
  });
};

io.use(authenticateSocket);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.user ? socket.user.id : "unknown"}`);

  console.log("Client connected:", socket.id);

  socket.on("message", async ({ chatId, message }) => {
    console.log(`Message received: ${message} for chatId: ${chatId}`);
    try {
      if (!chatId || !message) {
        console.error("Missing chatId or message");
        return;
      }

      const chat = await Chat.findById(chatId);
      if (!chat) {
        console.error(`Chat ${chatId} not found`);
        return;
      }

      if (!chat.participants.includes(socket.user.id)) {
        console.error(
          `User ${socket.user.id} is not a participant of chat ${chatId}`
        );
        return;
      }

      chat.messages.push({ sender: socket.user.id, text: message });
      await chat.save();

      chat.participants.forEach((participantId) => {
        if (participantId.toString() !== socket.user.id.toString()) {
          io.to(participantId.toString()).emit("message", {
            sender: socket.user.id,
            text: message,
          });
        }
      });
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  socket.on("joinChat", (chatId) => {
    console.log(`User ${socket.user.id} joining chat ${chatId}`);
    if (!chatId) {
      console.error("No chatId provided for joining chat");
      return;
    }
    socket.join(chatId);
  });

  socket.on("disconnect", () => {
    console.log(
      `User disconnected: ${socket.user ? socket.user.id : "unknown"}`
    );
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
