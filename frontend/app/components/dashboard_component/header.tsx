import React, { useEffect } from "react";
import { Bell, PlusCircle, Search, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserMenu from "../home_component/user-menu";
import WorkspaceAvatar from "./workspace-avatar";
import { useLocalStorage } from "hook/use-localStorage";
import type { User, Workspace } from "@/types";

interface HeaderDashboardProps {
  user: User | null;
  onCreateWorkspace: () => void;
}

const workspacesData: Workspace[] = [
  {
    _id: "ws-01",
    name: "Design Team",
    color: "#8B5CF6",
    workspacePicture: "https://api.dicebear.com/7.x/initials/svg?seed=Design",
    owner: "user-01",
    members: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    _id: "ws-02",
    name: "Marketing",
    color: "#EC4899",
    workspacePicture:
      "https://api.dicebear.com/7.x/initials/svg?seed=Marketing",
    owner: "user-02",
    members: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const HeaderDashboard = ({ onCreateWorkspace, user }: HeaderDashboardProps) => {
  // Sử dụng Hook để lưu ID của workspace đã chọn
  const [selectedId, setSelectedId] = useLocalStorage<string | null>(
    "selectedWorkspaceId",
    workspacesData[0]?._id,
  );

  // Tìm đối tượng workspace tương ứng với ID đang lưu
  const selectedWorkspace =
    workspacesData.find((ws) => ws._id === selectedId) || workspacesData[0];

  const handleSelect = (ws: Workspace) => {
    setSelectedId(ws._id);
  };

  return (
    <div className="sticky top-0 bg-background/80 backdrop-blur-md z-40 border-b justify-between flex items-center p-3.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="h-10 gap-2 px-2 min-w-40 justify-start shadow-sm border-muted-foreground/20"
          >
            {selectedWorkspace ? (
              <>
                <WorkspaceAvatar
                  color={selectedWorkspace.color}
                  name={selectedWorkspace.name}
                  pictureUrl={selectedWorkspace.workspacePicture}
                />
                <span className="font-semibold truncate max-w-25">
                  {selectedWorkspace.name}
                </span>
              </>
            ) : (
              <span>Select workspace</span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-64 p-2">
          <DropdownMenuLabel className="text-muted-foreground font-normal text-xs uppercase tracking-wider">
            Your Workspaces
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuGroup>
            {workspacesData.map((ws) => (
              <DropdownMenuItem
                key={ws._id}
                onClick={() => handleSelect(ws)}
                className={`flex items-center gap-3 p-2 rounded-md cursor-pointer mb-1 transition-all ${
                  selectedId === ws._id ? "bg-accent" : "hover:bg-accent/50"
                }`}
              >
                <WorkspaceAvatar
                  color={ws.color}
                  name={ws.name}
                  pictureUrl={ws.workspacePicture}
                />
                <span
                  className={`flex-1 font-medium ${selectedId === ws._id ? "text-primary" : ""}`}
                >
                  {ws.name}
                </span>
                {selectedId === ws._id && (
                  <Check className="w-4 h-4 text-primary animate-in zoom-in duration-300" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuItem
            onClick={onCreateWorkspace}
            className="flex items-center gap-3 p-2 cursor-pointer text-blue-600 hover:text-blue-700 focus:text-blue-700"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="font-medium">Create new workspace</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Right Side: Search & User */}
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-9 bg-muted/40 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
          </Button>
          <UserMenu user={user} />
        </div>
      </div>
    </div>
  );
};

export default HeaderDashboard;
