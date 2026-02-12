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
import {
  Eye,
  MoreHorizontal,
  MoreVerticalIcon,
  Pen,
  PlusIcon,
  Trash,
} from "lucide-react";
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
        <CardHeader>
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
  const ownerMember = workspace.members.find((m) => m.role === "owner");
  const ownerUser = ownerMember?.user;
  return (
    <Link to={`/workspaces/${workspace._id}`}>
      <Card className="bg-background rounded-lg shadow-xs hover:shadow-lg shadow-gray-300 transition-shadow duration-200 hover:cursor-pointer p-2">
        <CardHeader className="px-1 py-0">
          <div className="flex items-center justify-between">
            <WorkspaceAvatar
              pictureUrl={workspace.workspacePicture}
              name={workspace.name}
              color={workspace.color}
            />
            <div>
              <h3 className="text-lg font-semibold">{workspace.name}</h3>
              <CardDescription className="text-balance truncate text-sm">
                {workspace.description}
              </CardDescription>
            </div>
            <DropdownMenuWorkspace />
          </div>
        </CardHeader>
        <CardContent className="px-1 pb-2">
          <div className="flex justify-between h-full">
            {/* Group Avatar các thành viên */}
            <div className="flex items-center">
              <AvatarGroup>
                {workspace.members.slice(0, 2).map((mb) => (
                  <Avatar
                    title={mb.user.name}
                    key={mb.user._id}
                    className="h-7 w-7"
                  >
                    <AvatarImage
                      src={mb.user.profilePicture}
                      alt={mb.user.name}
                    />
                    <AvatarFallback>
                      {mb.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {workspace.members.length > 2 && (
                  <AvatarGroupCount>
                    +{workspace.members.length - 2}
                  </AvatarGroupCount>
                )}
              </AvatarGroup>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Group Owner */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-[10px] uppercase font-medium">
                Owner:
              </span>
              <Avatar title={ownerUser?.name} className="h-6 w-6">
                <AvatarImage src={ownerUser?.profilePicture} />
                <AvatarFallback className="bg-primary text-[10px] text-white">
                  {ownerUser?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Phần hiển thị Tiến độ: Text + Chart */}
            {/* TODO: Array map */}
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium whitespace-nowrap">
                12 Task - 9 Done
              </span>
              <div className="h-12">
                <WorkspaceChartPieDonutActive />
              </div>
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
