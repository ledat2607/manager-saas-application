import Workspace from "../models/workspace.js";
import Project from "../models/project.js";
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

export { createProject };
