import CreateWorkspace from "@/components/dashboard_component/workspace/create-workspace";
import { WorkspaceChartPieDonutActive } from "@/components/dashboard_component/workspace/rechart";
import WorkspaceAvatar from "@/components/dashboard_component/workspace/workspace-avatar";
import NoDataFound from "@/components/noData-found";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import type { Workspace } from "@/types";
import { useGetWorkspacesQuery } from "hook/use-worksapce";
import { Eye, MoreHorizontal, Pen, PlusIcon, Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const Workspace = () => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  const { data, isLoading } = useGetWorkspacesQuery() as any;

  // Sau đó lấy mảng ra để map
  const workspaces = (data?.workspaces as Workspace[]) || [];
  if (isLoading) {
    return <WorkspaceSkeleton />;
  }
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-3xl font-bold">Workspaces</h2>
          <Button
            className="flex items-center gap-4"
            onClick={() => setIsCreatingWorkspace(!isCreatingWorkspace)}
          >
            <PlusIcon className="w-4 h-4" />
            Create workspace
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.isArray(workspaces) && workspaces.length > 0 ? (
            workspaces.map((ws) => <WorkspaceCard workspace={ws} />)
          ) : (
            <NoDataFound
              icon={<PlusIcon />}
              title="No workspace found"
              buttonAction={() => setIsCreatingWorkspace(true)}
              buttonText="Create a new workspace"
              description="Create a new workspace to get started"
            />
          )}
        </div>
      </div>
      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </>
  );
};

export default Workspace;

const WorkspaceSkeleton = () => {
  return (
    <div className="grid lg:grid-cols-4 gap-4 w-full grid-cols-1">
      <Card className="w-full max-w-xs">
        <CardHeader className="p-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="aspect-video w-full" />
        </CardContent>
      </Card>
    </div>
  );
};

const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
  const ownerMember = workspace.members?.find((m) => m.role === "owner");
  const ownerUser = ownerMember?.user;

  // Tính toán số lượng để hiển thị
  const totalProjects = workspace.projects?.length || 0;
  // Tính tổng tất cả tasks từ tất cả projects
  const totalTasks =
    workspace.projects?.reduce(
      (acc, proj) => acc + (proj.tasks?.length || 0),
      0,
    ) || 0;
  const handleClick = () => {
    localStorage.setItem("lastWorkspaceId", workspace._id);
  };
  return (
    <Link onClick={handleClick} to={`/workspaces/${workspace._id}`}>
      <Card
        className="bg-background rounded-lg shadow-xs hover:shadow-lg shadow-gray-300 transition-all duration-200 hover:cursor-pointer p-3 border-l-4"
        style={{ borderLeftColor: workspace.color || "#10b981" }}
      >
        <CardHeader className="px-1 py-0 mb-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <WorkspaceAvatar
                pictureUrl={workspace.workspacePicture}
                name={workspace.name}
                color={workspace.color}
              />
              <div className="overflow-hidden">
                <h3 className="text-lg font-bold truncate">{workspace.name}</h3>
                <p className="text-xs text-muted-foreground truncate italic">
                  {workspace.description || "No description"}
                </p>
              </div>
            </div>
            <div onClick={(e) => e.preventDefault()}>
              <DropdownMenuWorkspace />
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-1 pb-2 space-y-4">
          {/* Thống kê nhanh */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="bg-secondary/50 p-2 rounded-md text-center">
              <p className="text-[10px] uppercase text-muted-foreground font-bold">
                Projects
              </p>
              <p className="text-lg font-semibold">{totalProjects}</p>
            </div>
            <div className="bg-secondary/50 p-2 rounded-md text-center">
              <p className="text-[10px] uppercase text-muted-foreground font-bold">
                Total Tasks
              </p>
              <p className="text-lg font-semibold">{totalTasks}</p>
            </div>
          </div>

          <div className="flex justify-between items-center h-full">
            {/* Thành viên */}
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase text-muted-foreground font-medium">
                Team
              </span>
              <AvatarGroup>
                {workspace.members?.slice(0, 3).map((mb) => (
                  <Avatar
                    title={mb.user?.name}
                    key={mb.user?._id}
                    className="h-7 w-7 border-2 border-background"
                  >
                    <AvatarImage
                      src={mb.user?.profilePicture}
                      alt={mb.user?.name}
                    />
                    <AvatarFallback className="text-[10px]">
                      {mb.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {workspace.members?.length > 3 && (
                  <AvatarGroupCount>
                    +{workspace.members.length - 3}
                  </AvatarGroupCount>
                )}
              </AvatarGroup>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Tiến độ (Chart) */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] uppercase text-muted-foreground font-medium">
                Activity
              </span>
              <div className="h-14 w-14">
                <WorkspaceChartPieDonutActive
                  data={workspace?.projects || []}
                />
              </div>
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Chủ sở hữu */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] uppercase text-muted-foreground font-medium">
                Owner
              </span>
              <Avatar
                title={ownerUser?.name}
                className="h-7 w-7 ring-2 ring-primary/20"
              >
                <AvatarImage src={ownerUser?.profilePicture} />
                <AvatarFallback className="bg-primary text-[10px] text-white">
                  {ownerUser?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const DropdownMenuWorkspace = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size={"sm"}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Action</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="hover:text-green-500">
            <Eye className="w-4 h-4 hover:text-green-500" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:text-yellow-500">
            <Pen className="w-4 h-4 hover:text-yellow-500" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem className="text-muted-foreground hover:text-red-500">
            <Trash className="w-4 h-4 hover:text-red-500" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
