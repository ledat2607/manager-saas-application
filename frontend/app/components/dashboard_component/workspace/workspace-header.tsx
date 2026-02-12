import type { User, Workspace } from "@/types";
import React from "react";
import WorkspaceAvatar from "./workspace-avatar";
import { Button } from "@/components/ui/button";
import { Plus, UserIcon, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface WorkspaceHeaderProps {
  workspace: Workspace;
  member: {
    _id: string;
    user: User;
    role: "admin" | "member" | "owner" | "viewer";
    joinedAt: Date;
  }[];
  onCreateProject: () => void;
  onInviteMember: () => void;
}

const WorkspaceHeader = ({
  workspace,
  member,
  onCreateProject,
  onInviteMember,
}: WorkspaceHeaderProps) => {
  return (
    <div className="space-y-3 pt-8 md:pt-0">
      <div className="flex justify-between items-center gap-3">
        <div className="flex md:items-center gap-3">
          <WorkspaceAvatar
            color={workspace.color}
            pictureUrl={workspace.workspacePicture}
            name={workspace.name}
          />

          <h2 className="font-semibold md:text-2xl">{workspace.name}</h2>
          <Button className="border-none" disabled variant={"outline"}>
            <UserIcon className="w-5 h-5" />
            <span className="text-md"> {member.length}</span>
          </Button>
        </div>

        <div className="flex items-center gap-3 justify-between">
          <Button
            variant={"outline"}
            onClick={onInviteMember}
            title="Invite member"
          >
            <UserPlus className="w-4 h-4" />
          </Button>
          <Button
            variant={"primary"}
            onClick={onCreateProject}
            title="Create project"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {workspace.description && (
        <p className="text-sm text-muted-foreground">{workspace.description}</p>
      )}

      {member.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Members:</span>
          <div className="flex space-x-2">
            {member.map((mem) => (
              <Avatar
                key={mem._id}
                className="relative rounded-full border-2 border-background overflow-hidden h-8 w-8"
                title={mem.user.name || "User Avatar"}
              >
                <AvatarImage
                  src={mem.user.profilePicture}
                  alt="profile picture"
                />
                <AvatarFallback>
                  {mem.user.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceHeader;
