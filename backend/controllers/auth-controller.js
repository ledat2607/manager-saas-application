import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Verification from "../models/verification.js";
import mongoose from "mongoose";
import {
  sendRecoveryEmail,
  sendVerificationEmail,
} from "../libs/send-email.js";

//register funcion
const registerUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create(
      [
        {
          name,
          email,
          password: hashedPassword,
          isEmailVerified: false,
        },
      ],
      { session },
    );

    const verificationToken = jwt.sign(
      { userId: user[0]._id, type: "email-verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    await Verification.create(
      [
        {
          userId: user[0]._id,
          token: verificationToken,
          expiryDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      ],
      { session },
    );

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // 🔥 GỬI MAIL

    await sendVerificationEmail(user[0].email, user[0].name, verificationLink);

    // ✅ MAIL OK → COMMIT
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      message: "Check your email to verify your account",
    });
  } catch (error) {
    // ❌ MAIL FAIL → ROLLBACK
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    res.status(500).json({
      message: "Registration failed, please try again",
    });
  }
};

//login funcion
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      const existingEmailVerification = await Verification.findOne({
        userId: user._id,
      });
      if (
        existingEmailVerification &&
        existingEmailVerification.expiryDate > new Date()
      ) {
        return res.status(400).json({
          message:
            "Email is not verified. Please check your email for the verification link.",
        });
      } else {
        await Verification.findByIdAndDelete(existingEmailVerification._id);

        const verificationToken = jwt.sign(
          { userId: user._id, type: "email-verification" },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
        );

        await Verification.create({
          userId: user._id,
          token: verificationToken,
          expiryDate: new Date(Date.now() + 1 * 60 * 60 * 1000),
        });
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

        // 🔥 GỬI MAIL

        await sendVerificationEmail(
          user[0].email,
          user[0].name,
          verificationLink,
        );

        // ✅ MAIL OK → COMMIT
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
          message: "Check your email to verify your account",
        });
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.lastLogin = new Date();

    await user.save();

    const userData = user.toObject();
    
    delete userData.password;
    res
      .status(200)
      .json({ token, message: "Login successful", user: userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

//verify email funcion
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const { userId, type } = payload;

    if (type !== "email-verification") {
      return res.status(400).json({ message: "Invalid token type" });
    }

    const verificationRecord = await Verification.findOne({ userId, token });

    if (!verificationRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const isTokenExpired = verificationRecord.expiryDate < new Date();

    if (isTokenExpired) {
      return res.status(400).json({ message: "Token has expired" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    user.isEmailVerified = true;
    await user.save();

    await Verification.findByIdAndDelete(verificationRecord._id);
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (user.isEmailVerified === false) {
      return res.status(400).json({
        message: "Please verify your email before resetting password",
      });
    }

    const existingVerification = await Verification.findOne({
      userId: user._id,
    });

    if (existingVerification && existingVerification.expiryDate > new Date()) {
      await Verification.findByIdAndDelete(existingVerification._id);
    }

    const resetToken = jwt.sign(
      {
        userId: user._id,
        type: "password-reset",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    await Verification.create({
      userId: user._id,
      token: resetToken,
      expiryDate: new Date(Date.now() + 1 * 60 * 60 * 1000),
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // Gửi email đặt lại mật khẩu
    await sendRecoveryEmail(user.email, user.name, resetLink);
    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const verifyTokenAndResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmNewPassword } = req.body;
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    if (!payload) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const { userId, type } = payload;

    if (type !== "password-reset") {
      return res.status(400).json({ message: "Invalid token type" });
    }

    const verificationRecord = await Verification.findOne({ userId, token });

    if (!verificationRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const isTokenExpired = verificationRecord.expiryDate < new Date();

    if (isTokenExpired) {
      return res.status(400).json({ message: "Token has expired" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = hashedPassword;
    await user.save();

    await Verification.findByIdAndDelete(verificationRecord._id);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export {
  registerUser,
  loginUser,
  verifyEmail,
  resetPasswordRequest,
  verifyTokenAndResetPassword,
};
