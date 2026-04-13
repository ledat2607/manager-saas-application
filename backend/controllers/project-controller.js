import Workspace from "../models/workspace.js";
import Project from "../models/project.js";
import Task from "../models/task.js";

const createProject = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { title, description, status, startDate, dueDate, tags, members } =
      req.body;

    console.log(workspaceId, req.body);

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const tagsArray = tags ? tags.split(",") : [];
    const newProject = await Project.create({
      title,
      description,
      status,
      startDate,
      dueDate,
      tags: tagsArray,
      members,
      workspace: workspaceId,
      createdBy: req.user._id,
    });

    workspace.projects.push(newProject._id);
    await workspace.save();

    //Simulate project creation logic
    res.status(201).json({
      newProject,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    //1. Validate projectId
    if (!projectId) {
      return res.status(400).json({ message: "ID dự án không hợp lệ" });
    }

    //2. Tìm dự án và populate thông tin thành viên
    const project = await Project.findById(projectId)
      .populate("members.user", "name email profilePicture")
      .lean();

    if (!project) {
      return res.status(404).json({ message: "Không tìm thấy dự án" });
    }
    //3 Check quyền user
    const currentUserId = req.user?._id?.toString();

    const isMember = project.members.some((member) => {
      // Lấy ID ra một cách chắc chắn
      const memberUserId = member.user?._id
        ? member.user._id.toString()
        : member.user?.toString();

      return memberUserId === currentUserId;
    });

    if (!isMember) {
      return res.status(403).json({
        message: "Bạn không có quyền truy cập vào dự án này",
      });
    }
    //4. Trả về thông tin dự án
    return res.status(200).json(project);
  } catch (error) {
    console.error("Lỗi tại getProjectById:", error);
    return res.status(500).json({ message: "Lỗi hệ thống nội bộ" });
  }
};

const getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    //1 Validate projectId
    if (!projectId) {
      return res.status(400).json({ message: "ID dự án không hợp lệ" });
    }

    //2 Tìm dự án và populate thông tin thành viên
    const project = await Project.findById(projectId).populate(
      "members.user",
      "name email profilePicture",
    );
    if (!project) {
      return res.status(404).json({ message: "Không tìm thấy dự án" });
    }
    //3 Check quyền user
    const isMember = project.members.some(
      (member) => member.user._id.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập vào dự án này" });
    }
    //4. Tìm tất cả task của dự án
    const tasks = await Task.find({
      project: projectId,
      isArchived: false,
    })
      .populate("assignees", "name email profilePicture")
      .sort({ createdAt: -1 });
    //5. Trả về thông tin dự án và danh sách task
    res.status(200).json({ project, tasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { createProject, getProjectById, getProjectTasks };
