import User from "../models/user.js";
import bcrypt from "bcrypt";
import ActivityLog from "../models/activity.js";
import Project from "../models/project.js";
import Task from "../models/task.js";

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    delete user.password;
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, profilePicture } = req.body;
    const user = await User.findById(req.user._id).select("-passsword");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.name = name;
    user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match" });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return res.status(403).json({ message: "Invalid old password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);

    res.status(500).json({ message: "Server error" });
  }
};
const getNotifications = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    // 1. Tìm tất cả Project IDs thuộc Workspace
    const projects = await Project.find({ workspace: workspaceId }).select(
      "_id name",
    );
    const projectIds = projects.map((p) => p._id);

    // 2. Tìm tất cả Tasks và lấy thêm title
    const tasks = await Task.find({ project: { $in: projectIds } }).select(
      "_id title",
    );

    // Tạo một Map để lookup tên task nhanh hơn dựa trên ID
    const taskMap = {};
    tasks.forEach((t) => {
      taskMap[t._id.toString()] = t.title;
    });

    const taskIds = tasks.map((t) => t._id);

    // 3. Gom tất cả ID lại để tìm Log
    const allRelatedIds = [workspaceId, ...projectIds, ...taskIds];

    const logs = await ActivityLog.find({
      resourceId: { $in: allRelatedIds },
    })
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 })
      .lean(); // Dùng .lean() để kết quả trả về là plain JS object, giúp mình chỉnh sửa data dễ dàng

    // 4. Map lại kết quả để "gắn" thêm thông tin task vào details
    const notifications = logs.map((log) => {
      const logObj = { ...log };

      // Nếu resourceId của log nằm trong danh sách Task, bổ sung taskTitle vào details
      if (taskMap[log.resourceId.toString()]) {
        logObj.details = {
          ...logObj.details,
          taskTitle: taskMap[log.resourceId.toString()],
          // Bạn có thể format lại text hiển thị tại đây hoặc để ở Frontend
          details: `${logObj.details.details} on task: "${taskMap[log.resourceId.toString()]}"`,
        };
      }
      return logObj;
    });

    return res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserAdvancedDetails = async (req, res) => {
  try {
    const { skills, preferences, bio } = req.body;
    const userId = req.user._id;

    const updateFields = {};

    if (skills !== undefined) updateFields.skills = skills;
    if (bio !== undefined) updateFields.bio = bio;

    if (preferences) {
      if (preferences.language)
        updateFields["preferences.language"] = preferences.language;
      if (preferences.timezone)
        updateFields["preferences.timezone"] = preferences.timezone;
      if (preferences.backgroundImage)
        updateFields["preferences.backgroundImage"] =
          preferences.backgroundImage;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true, runValidators: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updatePicture = async (req, res) => {
  try {
    const { profilePicture, type } = req.body;
    console.log("Updating picture with data:", { profilePicture, type });
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (type === "avatar") {
      user.profilePicture = profilePicture;
    } else if (type === "background") {
      user.preferences.backgroundImage = profilePicture;
    }

    await user.save();

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getNotifications,
  updateUserAdvancedDetails,
  updatePicture,
};
