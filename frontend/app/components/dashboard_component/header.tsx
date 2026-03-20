import { useEffect, useMemo } from "react";
import { Bell, PlusCircle, Search, Check, PenLine } from "lucide-react";
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
import WorkspaceAvatar from "./workspace/workspace-avatar";
import type { User, Workspace } from "@/types";
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import { ModeToggle } from "../home_component/mode-toggle";

interface HeaderDashboardProps {
  user: User | null;
  onCreateWorkspace: () => void;
  onWorkspaceSelected: (workspace: Workspace) => void;
  selectedWorkspace: Workspace | null;
}

const HeaderDashboard = ({
  onCreateWorkspace,
  user,
  onWorkspaceSelected,
  selectedWorkspace,
}: HeaderDashboardProps) => {
  const { workspaces } = useLoaderData() as { workspaces: Workspace[] };
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Tự động phục hồi hoặc set ID mặc định
  useEffect(() => {
    // Chỉ xử lý khi ở trang Dashboard (không có /workspaces/ trong path)
    const isDashboardPath =
      location.pathname === "/dashboard" || location.pathname === "/";

    if (isDashboardPath && workspaces?.length > 0) {
      const lastId = localStorage.getItem("lastWorkspaceId");
      const currentIdInUrl = searchParams.get("workspaceId");

      if (!currentIdInUrl) {
        const idToSet =
          lastId && workspaces.some((ws) => ws._id === lastId)
            ? lastId
            : workspaces[0]._id;

        setSearchParams({ workspaceId: idToSet }, { replace: true });
      } else {
        // Nếu URL có ID, cập nhật lại localStorage để đồng bộ
        localStorage.setItem("lastWorkspaceId", currentIdInUrl);
      }
    }
  }, [location.pathname, workspaces, searchParams, setSearchParams]);

  const handleSelect = (workspace: Workspace) => {
    onWorkspaceSelected(workspace);
    localStorage.setItem("lastWorkspaceId", workspace._id); // Lưu lại ngay khi chọn

    if (location.pathname.includes("/workspaces/")) {
      navigate(`/workspaces/${workspace._id}`);
    } else {
      setSearchParams({ workspaceId: workspace._id });
    }
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
              <span className="text-muted-foreground flex gap-3 items-center">
                <PenLine className="w-4 h-4" />
                Select workspaces
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-64 p-2">
          <DropdownMenuLabel className="text-muted-foreground font-normal text-xs uppercase tracking-wider">
            Your Workspaces
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuGroup>
            {workspaces?.length > 0 ? (
              <>
                {workspaces?.map((ws) => (
                  <DropdownMenuItem
                    key={ws._id}
                    onClick={() => handleSelect(ws)}
                    className={`flex items-center gap-3 p-2 rounded-md cursor-pointer mb-1 transition-all ${
                      selectedWorkspace?._id === ws._id
                        ? "bg-accent"
                        : "hover:bg-accent/50"
                    }`}
                  >
                    <WorkspaceAvatar
                      color={ws.color}
                      name={ws.name}
                      pictureUrl={ws.workspacePicture}
                    />
                    <span
                      className={`flex-1 font-medium ${selectedWorkspace?._id === ws._id ? "text-primary" : ""}`}
                    >
                      {ws.name}
                    </span>
                    {selectedWorkspace?._id === ws._id && (
                      <Check className="w-4 h-4 text-primary animate-in zoom-in duration-300" />
                    )}
                  </DropdownMenuItem>
                ))}
              </>
            ) : (
              <div className="p-4 text-center text-xs text-muted-foreground">
                You don't have any workspaces yet.
              </div>
            )}
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
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};

export default HeaderDashboard;
