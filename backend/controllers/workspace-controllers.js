import Project from "../models/project.js";
import Workspace from "../models/workspace.js";
import User from "../models/user.js";
import WorkspaceInvite from "../models/workspace-invite.js";
import jwt from "jsonwebtoken";
import { sendWorkspaceInviteEmail } from "../libs/send-email.js";
import { recordActivity } from "../libs/index.js";
import Task from "../models/task.js";
const createWorkspace = async (req, res) => {
  try {
    const { name, color, description } = req.body;
    const workspace = await Workspace.create({
      name,
      color,
      description,
      owner: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "owner",
          joinedAt: new Date(),
        },
      ],
    });
    res.status(201).json({
      success: true,
      message: "Create workspace successfull !",
      workspace,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

// Backend: controller file
const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({ "members.user": req.user._id })
      .populate({ path: "members.user", select: "name email profilePicture" })
      .sort({ createdAt: -1 })
      .lean();

    const workspaceIds = workspaces.map((ws) => ws._id);

    const projects = await Project.find({
      workspace: { $in: workspaceIds },
    }).lean();
    const projectIds = projects.map((p) => p._id);
    const tasks = await Task.find({ project: { $in: projectIds } }).lean();

    const detailedWorkspaces = workspaces.map((ws) => {
      const wsProjects = projects.filter(
        (p) => p.workspace?.toString() === ws._id.toString(),
      );
      const projectsWithTasks = wsProjects.map((p) => ({
        ...p,
        tasks: tasks.filter((t) => t.project?.toString() === p._id.toString()),
      }));

      return {
        ...ws,
        projects: projectsWithTasks,
      };
    });

    res.status(200).json({ workspaces: detailedWorkspaces });
  } catch (error) {
    console.error("Lỗi getWorkspaces:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getWorkspaceSingle = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId).populate({
      path: "members.user", // 1. Chỉ định trường chứa ID cần populate
      select: "name email profilePicture", // 2. Chỉ lấy các trường cần thiết (bảo mật)
    });

    if (!workspace) {
      return res.status(401).json({
        message: "Workspace not found",
      });
    }
    res.status(200).json(workspace);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaceProject = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    }).populate({
      path: "members.user",
      select: "name email profilePicture",
    });

    if (!workspace) {
      res.status(401).json({ message: "Workspace not found" });
    }

    const projects = await Project.find({
      workspace: workspaceId,
      isArchived: false,
      //members: { $in: [req.user._id] },
    })
      //.populate("task", "status")
      .sort({ createdAt: -1 });

    res.status(200).json({ projects, workspace });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaceStats = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    if (!workspaceId) {
      return res.status(400).json({ message: "Invalid workspace ID" });
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(400).json({ message: "Workspace not found" });
    }
    const isMember = workspace.members.some(
      (member) => member.user._id.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res
        .status(400)
        .json({ message: "You not a member of this workspace" });
    }
    const [totalProjects, projects] = await Promise.all([
      Project.countDocuments({ workspace: workspaceId }),
      Project.find({ workspace: workspaceId })
        .populate(
          "tasks",
          "title status dueDate project updatedAt isArchieved priority",
        )
        .sort({ createdAt: -1 }),
    ]);

    const totalTasks = projects.reduce((acc, project) => {
      return acc + project.tasks.length;
    }, 0);

    const totalProjectInProgress = projects.filter(
      (project) => project.status === "In Progress",
    ).length;

    const totalProjectComplete = projects.filter(
      (project) => project.status === "Completed",
    ).length;

    const totalTaskComplete = projects.reduce((acc, project) => {
      return (
        acc + project.tasks.filter((task) => task.status === "Done").length
      );
    }, 0);

    const totalTaskToDo = projects.reduce((acc, project) => {
      return (
        acc + project.tasks.filter((task) => task.status === "To Do").length
      );
    }, 0);
    const totalTaskInProgress = projects.reduce((acc, project) => {
      return (
        acc +
        project.tasks.filter((task) => task.status === "In Progress").length
      );
    }, 0);

    const tasks = projects.flatMap((project) => project.tasks);

    //get upcomming task

    const upCommingTask = tasks.filter((task) => {
      const taskDate = new Date(task.dueDate);
      const toDay = new Date();

      // Tạo mốc thời gian 7 ngày tới bằng cách CỘNG thêm miligiây
      const sevenDaysFromNow = new Date(
        toDay.getTime() + 7 * 24 * 60 * 60 * 1000,
      );

      return taskDate > toDay && taskDate <= sevenDaysFromNow;
    });
    const taskTrendData = [
      { name: "Sun", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Mon", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Tue", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Wed", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Thu", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Fri", completed: 0, inProgress: 0, toDo: 0 },
      { name: "Sat", completed: 0, inProgress: 0, toDo: 0 },
    ];

    const last7DaysTasks = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    for (const project of projects) {
      for (const task of project.tasks) {
        const taskDate = new Date(task.updatedAt);
        const dayInDate = last7DaysTasks.findIndex(
          (date) =>
            date.getDate() === taskDate.getDate() &&
            date.getMonth() === taskDate.getMonth() &&
            date.getFullYear() === taskDate.getFullYear(),
        );

        if (dayInDate !== -1) {
          const dayName = last7DaysTasks[dayInDate].toLocaleDateString(
            "en-US",
            {
              weekday: "short",
            },
          );
          const dayData = taskTrendData.find((day) => day.name === dayName);
          if (dayData) {
            switch (task.status) {
              case "Done":
                dayData.completed++;
                break;
              case "In Progress":
                dayData.inProgress++;
                break;
              case "To Do":
                dayData.toDo++;
                break;
            }
          }
        }
      }
    }

    const projectStatusData = [
      { name: "Completed", value: 0, color: "#10b981" },
      { name: "In Progress", value: 0, color: "#3b82f6" },
      { name: "Planning", value: 0, color: "#f59e0b" },
    ];

    for (const project of projects) {
      switch (project.status) {
        case "Completed":
          projectStatusData[0].value++;
          break;
        case "In Progress":
          projectStatusData[1].value++;
          break;
        case "Planning":
          projectStatusData[2].value++;
          break;
      }
    }
    const taskPriorityData = [
      { name: "High", value: 0, color: "#ef4444" },
      { name: "Medium", value: 0, color: "#f59e0b" },
      { name: "Low", value: 0, color: "#6b7280" },
    ];

    for (const project of projects) {
      for (const task of project.tasks) {
        switch (task.priority) {
          case "High":
            taskPriorityData[0].value++;
            break;
          case "Medium":
            taskPriorityData[1].value++;
            break;
          case "Low":
            taskPriorityData[2].value++;
            break;
        }
      }
    }

    const workspaceProductivityData = [];

    for (const project of projects) {
      const projectTask = tasks.filter(
        (task) => task.project.toString() === project._id.toString(),
      );
      console.log(projectTask);
      const completedTask = projectTask.filter(
        (task) => task.status === "Done" && !task.isArchived,
      );
      workspaceProductivityData.push({
        name: project.title,
        completed: completedTask.length,
        total: projectTask.length,
      });
    }

    const stats = {
      totalProjects,
      totalTasks,
      totalProjectInProgress,
      totalTaskComplete,
      totalTaskToDo,
      totalTaskInProgress,
      totalProjectComplete,
    };

    return res.status(200).json({
      stats,
      taskTrendData,
      taskPriorityData,
      projectStatusData,
      workspaceProductivityData,
      upCommingTask,
      recentProjects: projects.slice(0, 5),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const acceptInviteToken = async (req, res) => {
  try {
    const { token } = req.body;
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const { userId, workspaceId, role } = decode;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const project = await Project.find({ workspace: workspaceId });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const isMember = workspace.members.some(
      (member) => member.user.toString() === userId.toString(),
    );

    if (isMember) {
      return res
        .status(400)
        .json({ message: "You are already a member of this workspace" });
    }

    const inviteInfo = await WorkspaceInvite.findOne({
      workspaceId,
      user: userId,
      token,
    });

    if (!inviteInfo) {
      return res.status(400).json({ message: "Invalid invite token" });
    }

    if (inviteInfo.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invite token has expired" });
    }

    workspace.members.push({
      user: userId,
      role,
      joinedAt: new Date(),
    });
    project.forEach((project) => {
      project.members.push({
        user: userId,
        role,
        joinedAt: new Date(),
      });
    });

    await workspace.save();
    await Promise.all(
      project.map((project) => {
        return project.save();
      }),
    );

    await Promise.all([
      WorkspaceInvite.deleteOne({ _id: inviteInfo._id }),
      User.findByIdAndUpdate(userId, { $push: { workspaces: workspaceId } }),
      recordActivity(userId, "joined_workspace", "Workspace", workspaceId, {
        details: `Joined workspace ${workspace.name}`,
      }),
    ]);

    return res.status(200).json({ message: "You have joined the workspace" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const inviteMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const userMemberRole = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString(),
    )?.role;

    if (
      !userMemberRole ||
      (userMemberRole !== "owner" && userMemberRole !== "manager")
    ) {
      return res
        .status(403)
        .json({ message: "You do not have permission to invite members" });
    }
    const isExistingUser = await User.findOne({ email });

    if (!isExistingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const isMember = workspace.members.some(
      (member) => member.user.toString() === isExistingUser._id.toString(),
    );
    if (isMember) {
      return res
        .status(400)
        .json({ message: "User is already a member of the workspace" });
    }

    const isInvited = await WorkspaceInvite.findOne({
      workspaceId,
      user: isExistingUser._id,
    });

    if (isInvited && isInvited.expiresAt > new Date()) {
      return res
        .status(400)
        .json({ message: "User has not been invited to the workspace" });
    }
    if (isInvited && isInvited.expiresAt < new Date()) {
      await WorkspaceInvite.findByIdAndDelete(isInvited._id);
    }

    const token = jwt.sign(
      {
        userId: isExistingUser._id,
        workspaceId: workspaceId,
        role: role || "member",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    await WorkspaceInvite.create({
      user: isExistingUser._id,
      workspaceId: workspaceId,
      token: token,
      role: role || "member",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
    });

    const inviteLink = `${process.env.FRONTEND_URL}/workspace-invite/${workspaceId}?tk=${token}`;
    await sendWorkspaceInviteEmail(
      isExistingUser.email,
      workspace.name,
      inviteLink,
    );
    return res.status(200).json({ message: "Invitation sent successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const acceptGenerateInvite = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (isMember) {
      return res
        .status(403)
        .json({ message: "You are already a member of this workspace" });
    }

    workspace.members.push({
      user: req.user._id,
      role: "member",
      joinedAt: new Date(),
    });

    await recordActivity(req.user._id, workspaceId, "joined_workspace", {
      details: `Joined workspace ${workspace.name} via invite link`,
    });

    return res.status(200).json({ message: "You have joined the workspace" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export {
  createWorkspace,
  getWorkspaces,
  getWorkspaceSingle,
  getWorkspaceProject,
  getWorkspaceStats,
  acceptInviteToken,
  inviteMember,
  acceptGenerateInvite,
};
