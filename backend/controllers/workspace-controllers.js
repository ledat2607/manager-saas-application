import Project from "../models/project.js";
import Workspace from "../models/workspace.js";

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

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user._id,
    })
      .populate({
        path: "members.user", // 1. Chỉ định trường chứa ID cần populate
        select: "name email profilePicture", // 2. Chỉ lấy các trường cần thiết (bảo mật)
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ workspaces }); // Thường lấy dữ liệu dùng 200 (OK) thay vì 201 (Created)
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
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
    res.status(200).json({
      workspace,
    });
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
      members: { $in: [req.user._id] },
    })
      .populate("task", "status")
      .sort({ createdAt: -1 });

    res.status(200).json({ projects, workspace });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export {
  createWorkspace,
  getWorkspaces,
  getWorkspaceSingle,
  getWorkspaceProject,
};
