import { recordActivity } from "../libs/index.js";
import ActivityLog from "../models/activity.js";
import Project from "../models/project.js";
import Task from "../models/task.js";
import Workspace from "../models/workspace.js";

import Comment from "../models/comment.js";

const createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, status, priority, dueDate, assignees } =
      req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const workspace = await Workspace.findById(project.workspace);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const newTask = await Task.create({
      title,
      description,
      status,
      priority,
      dueDate,
      assignees,
      project: projectId,
      createdBy: req.user._id,
    });

    project.tasks.push(newTask._id);
    await project.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId)
      .populate("assignees", "name email profilePicture")
      .populate("watchers", "name email profilePicture");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    const project = await Project.findById(task.project).populate(
      "members.user",
      "name profilePicture",
    );

    res.status(200).json({ task, project });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateTaskTitle = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    //1. Validate taskID
    if (!taskId) {
      return res.status(400).json({ message: "Invalid taskID" });
    }

    //2 Find task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    //3. find project
    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(400).json({ message: "Project not found" });
    }

    //4. Check member
    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(400).json({ message: "You not available for action" });
    }
    const oldTitle = task.title;
    task.title = title;
    await task.save();

    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      details: `update task title from ${oldTitle} to ${title}`,
    });
    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    //1. Validate ID
    if (!taskId) {
      return res.status(400).json({ message: "Task Not Found!" });
    }
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    //3. find project
    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(400).json({ message: "Project not found" });
    }

    //4. Check member
    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(400).json({ message: "You not available for action" });
    }
    const oldStatus = task.status;
    task.status = status;
    await task.save();

    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      details: `update task status from ${oldStatus} to ${status}`,
    });
    res.status(200).json(task);
  } catch (error) {}
};

const updateTaskDescription = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { description } = req.body;

    //1. Validate taskID
    if (!taskId) {
      return res.status(400).json({ message: "Invalid taskID" });
    }

    //2 Find task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    //3. find project
    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(400).json({ message: "Project not found" });
    }

    //4. Check member
    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(400).json({ message: "You not available for action" });
    }
    const oldDes =
      task.description.substring(0, 50) +
      (task.description.length > 50 ? "..." : "");
    task.description = description;
    await task.save();

    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      details: `update task description from ${oldDes} to ${description}`,
    });
    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateTaskAssignees = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { assignees } = req.body;
    console.log(assignees);

    //1. Validate taskID
    if (!taskId) {
      return res.status(400).json({ message: "Invalid taskID" });
    }

    //2 Find task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    //3. find project
    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(400).json({ message: "Project not found" });
    }

    //4. Check member
    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(400).json({ message: "You not available for action" });
    }
    const oldAssignees = task.assignees;
    task.assignees = assignees;
    await task.save();

    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      details: `update task description from ${oldAssignees.length} to ${assignees}`,
    });
    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateTaskPriority = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { priority } = req.body;

    //1. Validate ID
    if (!taskId) {
      return res.status(400).json({ message: "Task Not Found!" });
    }
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    //3. find project
    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(400).json({ message: "Project not found" });
    }

    //4. Check member
    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(400).json({ message: "You not available for action" });
    }
    const oldPriority = task.priority;
    task.priority = priority;
    await task.save();

    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      details: `update task status from ${oldPriority} to ${priority}`,
    });
    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addSubTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    //1 Check taskid
    if (!taskId) {
      return res.status(400).json({ message: "Invalid task id" });
    }
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }

    //3. find project
    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(400).json({ message: "Project not found" });
    }

    //4. Check member
    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(400).json({ message: "You not available for action" });
    }

    const newSubtask = {
      title,
      completed: false,
    };

    task.subtasks.push(newSubtask);
    await task.save();

    await recordActivity(req.user._id, "created_subtask", "Task", taskId, {
      details: `add new subtask: ${newSubtask.title}`,
    });

    return res.status(200).json(newSubtask);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const updateSubtask = async (req, res) => {
  try {
    const { taskId, subTaskId } = req.params;
    const { completed } = req.body;

    console.log(taskId, subTaskId, completed);

    if (!taskId) {
      return res.status(400).json({ message: "Invalid task id" });
    }
    if (!subTaskId) {
      return res.status(400).json({ message: "Invalid subtask id" });
    }
    const task = await Task.findById(taskId);
    const subTask = task.subtasks.find((st) => st._id.toString() === subTaskId);

    if (!task) {
      return res.status(400).json({ message: "Task not found" });
    }
    if (!subTask) {
      return res.status(401).json({ message: "Subtask not found" });
    }

    //3. find project
    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(400).json({ message: "Project not found" });
    }

    //4. Check member
    const isMember = project.members.some(
      (member) => member.user.toString() === req.user._id.toString(),
    );
    if (!isMember) {
      return res.status(400).json({ message: "You not available for action" });
    }
    const oldStatus = subTask.completed;
    subTask.completed = completed;
    await task.save();
    await recordActivity(req.user._id, "updated_subtask", "Task", taskId, {
      details: `update status subtask from ${oldStatus} to ${completed}`,
    });
    return res.status(200).json(subTask);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTaskActivity = async (req, res) => {
  try {
    const { resourceId } = req.params;

    //1. Validate resourceId
    if (!resourceId) {
      return res.status(400).json({ message: "Resource ID not found" });
    }

    //2 Find activity
    const activity = await ActivityLog.find({ resourceId: resourceId })
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(activity);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getTaskCommentByID = async (req, res) => {
  try {
    const { taskId } = req.params;
    //1 Validate taskID
    if (!taskId) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const comments = await Comment.find({ task: taskId })
      .populate("author", "name profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const addComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { comment } = req.body;
    //1. Validate taskID
    if (!taskId) {
      return res.status(400).json({ message: "Invalid taskID" });
    }
    //2. Find task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(401).json({ message: "Task Not found" });
    }
    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(402).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      (mb) => mb.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res
        .status(401)
        .json({ message: "You are not a member of this project" });
    }

    const newComment = await Comment.create({
      text: comment,
      task: taskId,
      author: req.user._id,
    });
    task.comments.push(newComment._id);
    await task.save();

    await recordActivity(req.user._id, "added_comment", "Task", taskId, {
      details: `new Comment ${newComment.text}`,
    });

    return res.status(200).json(newComment);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const watchTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    //1 Validate task id
    if (!taskId) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(401).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(400).json({ message: "Project not found" });
    }
    const isMember = project.members.some(
      (mb) => mb.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res
        .status(401)
        .json({ message: "You are not a member of this project" });
    }
    const isWatching = task.watchers.includes(req.user._id);

    if (!isWatching) {
      task.watchers.push(req.user._id);
    } else {
      task.watchers = task.watchers.filter(
        (watcher) => watcher.toString() !== req.user._id.toString(),
      );
    }

    await task.save();

    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      details: `watchers task ${isWatching ? "unwatched" : "watched"} task ${task.title}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const archievedTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    //1 Validate task id
    if (!taskId) {
      return res.status(400).json({ message: "Invalid task ID" });
    }
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(401).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(400).json({ message: "Project not found" });
    }
    const isMember = project.members.some(
      (mb) => mb.user.toString() === req.user._id.toString(),
    );

    if (!isMember) {
      return res
        .status(401)
        .json({ message: "You are not a member of this project" });
    }
    const isArchived = task.isArchived;

    task.isArchived = !isArchived;
    
    await recordActivity(req.user._id, "updated_task", "Task", taskId, {
      details: `Task ${task.title} ${isArchived ? "is archieved" : "un archieved"} `,
    });
    await task.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createTask,
  getTaskById,
  updateTaskTitle,
  updateTaskDescription,
  updateTaskStatus,
  updateTaskAssignees,
  updateTaskPriority,
  addSubTask,
  updateSubtask,
  getTaskActivity,
  getTaskCommentByID,
  addComment,
  watchTask,
  archievedTask,
};
