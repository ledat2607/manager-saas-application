import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// Import routes
import routes from "./routes/index.js";

// Cấu hình môi trường
dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// 1. CẤU HÌNH MIDDLEWARE (Phải đặt trước Routes)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(morgan("dev"));

// 2. CẤU HÌNH SOCKET.IO (Real-time Presence)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Lưu trữ: Map<userId, socketId>
const users = new Map();

io.on("connection", (socket) => {
  console.log(`⚡ Thiết bị mới kết nối: ${socket.id}`);

  // Đăng ký user online
  socket.on("register-user", (userId) => {
    if (!userId) return;
    users.set(userId, socket.id);

    // Broadcast trạng thái mới cho toàn bộ các client khác
    io.emit("user-status-change", { userId, status: "online" });
    console.log(`👤 User ${userId} hiện đang Online`);
  });

  // Xử lý thay đổi trạng thái thủ công (Busy/Away)
  socket.on("update-manual-status", ({ userId, status }) => {
    io.emit("user-status-change", { userId, status });
  });

  // Xử lý ngắt kết nối (Đóng tab/Tắt máy)
  socket.on("disconnect", () => {
    let disconnectedUserId = null;
    for (let [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        users.delete(userId);
        break;
      }
    }

    if (disconnectedUserId) {
      io.emit("user-status-change", {
        userId: disconnectedUserId,
        status: "offline",
      });
      console.log(`👻 User ${disconnectedUserId} đã Offline`);
    }
  });
});

// 3. ROUTES ĐỊNH NGHĨA
app.get("/", (req, res) => {
  res.send("🚀 Manager SaaS API is running...");
});

app.use("/api-v1", routes);

// 4. XỬ LÝ LỖI (Error Handling)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 5. KẾT NỐI DATABASE VÀ KHỞI CHẠY SERVER
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!");
    // Chỉ listen 1 lần duy nhất ở httpServer
    httpServer.listen(PORT, () => {
      console.log(`📡 Server is running on: http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1); // Dừng app nếu không kết nối được DB
  });
