import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";

interface WorkspaceAvatarProps {
  name: string;
  color: string;
  pictureUrl?: string;
}

const WorkspaceAvatar = ({ name, color, pictureUrl }: WorkspaceAvatarProps) => {
  return (
    <div className="w-6 h-6 rounded flex items-center justify-center">
      <span className="text-xs font-medium text-white">
        {pictureUrl ? (
          <Avatar>
            <AvatarImage src={pictureUrl} className="w-7 h-7 rounded-full" />
          </Avatar>
        ) : (
          <> {name.charAt(0).toUpperCase()}</>
        )}
      </span>
    </div>
  );
};

export default WorkspaceAvatar;
