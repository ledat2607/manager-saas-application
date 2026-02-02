import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Lấy token từ header (thường là 'authorization' hoặc 'auth')
    const token = req.headers.authorization.split(" ")[1];

    // 2. Kiểm tra nếu không có token
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
      });
    }

    // 3. Verify token (thay 'YOUR_JWT_SECRET' bằng secret key của bạn)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //4 Tìm thông tin user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    // 5. Lưu thông tin user đã decode vào object req để các API sau có thể dùng
    req.user = user;
    // 6. Cho phép đi tiếp vào controller chính
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);

    // Phân loại lỗi token
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({
      message: "Unauthorized: Invalid token",
    });
  }
};

export default authMiddleware;
