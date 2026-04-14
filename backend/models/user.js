import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // --- THÔNG TIN ĐỊNH DANH (IDENTITY) ---
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: 200,
      trim: true,
    },

    // --- TRẠNG THÁI & BẢO MẬT (SECURITY & STATUS) ---
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "suspended", "away"],
      default: "active",
    },

    // --- XÁC THỰC 2 LỚP (2FA) ---
    twoFactor: {
      isEnabled: { type: Boolean, default: false },
      secret: { type: String, select: false },
      otp: { type: String, select: false },
      setupExpiry: { type: Date, select: false },
      otpExpiry: { type: Date, select: false },
    },

    // --- QUẢN LÝ CÔNG VIỆC (TASK MANAGER SPECIFIC) ---
    skills: {
      type: [String],
      default: [],
      index: true,
    },

    // --- TÙY CHỈNH CÁ NHÂN (PREFERENCES) ---
    preferences: {
      language: { type: String, default: "vi" },
      timezone: { type: String, default: "Asia/Ho_Chi_Minh" },
      backgroundImage: {
        type: String,
        default:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      },
    },

    // --- TRACKING ---
    lastLogin: {
      type: Date,
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  },
);

const User = mongoose.model("User", userSchema);

export default User;
