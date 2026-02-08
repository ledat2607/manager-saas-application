  import mongoose, { model } from "mongoose";

  const WorkspacesModel = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        trim: true,
      },
      color: {
        type: String,
      },
      workspacePicture: {
        type: String,
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      members: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          role: {
            type: String,
            enum: ["owner", "member", "manager", "viewer"],
            default: "member",
          },
          joinedAt: { type: Date, default: Date.now() },
        },
      ],
      projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Projects" }],
    },
    { timestamps: true },
  );

  const Workspaces = model("Workspaces", WorkspacesModel);

  export default Workspaces;
