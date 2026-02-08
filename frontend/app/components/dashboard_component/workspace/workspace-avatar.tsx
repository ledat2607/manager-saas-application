import React from "react";
import { Avatar, AvatarImage } from "../../ui/avatar";
import { cn } from "@/lib/utils";

interface WorkspaceAvatarProps {
  name: string;
  color: string;
  pictureUrl?: string;
}

const WorkspaceAvatar = ({ name, color, pictureUrl }: WorkspaceAvatarProps) => {
  return (
    <div
      className="w-8 h-8 flex items-center justify-center overflow-hidden shrink-0 rounded-full"
      style={{ backgroundColor: !pictureUrl ? color : "transparent" }} // Set màu ở đây
    >
      {pictureUrl ? (
        <Avatar className="w-full h-full">
          <AvatarImage src={pictureUrl} className="object-cover" />
        </Avatar>
      ) : (
        <span className="text-xs font-bold text-white uppercase">
          {name.charAt(0)}
        </span>
      )}
    </div>
  );
};

export default WorkspaceAvatar;
