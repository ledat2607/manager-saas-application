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
    console.log(workspace);
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
    }).sort({ createdAt: -1 });
    res.status(201).json({ workspaces });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export { createWorkspace, getWorkspaces };
