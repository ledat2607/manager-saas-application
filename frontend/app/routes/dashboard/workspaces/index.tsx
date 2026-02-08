import CreateWorkspace from "@/components/dashboard_component/workspace/create-workspace";
import WorkspaceAvatar from "@/components/dashboard_component/workspace/workspace-avatar";
import NoDataFound from "@/components/noData-found";
import {
  Avatar,
  AvatarBadge,
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
import { useGetWorkspaceQuery } from "hook/use-worksapce";
import {
  Eye,
  MoreHorizontal,
  MoreVerticalIcon,
  Pen,
  PlusIcon,
  Trash,
} from "lucide-react";
import { useState } from "react";

const Workspace = () => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  const { data, isLoading } = useGetWorkspaceQuery() as any;

  // Sau đó lấy mảng ra để map
  const workspaces = (data?.workspaces as Workspace[]) || [];
  if (isLoading) {
    return <WorkspaceSkeleton />;
  }
  console.log(workspaces[0].members);
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
      <CardContent className="px-1">
        <div className="flex h-8 items-center gap-4 text-sm p-2">
          <div>
            <AvatarGroup>
              {/* Chỉ lấy tối đa 3 thành viên đầu tiên */}
              {workspace.members.slice(0, 2).map((mb) => (
                <Avatar title={mb.user.name} key={mb.user._id}>
                  <AvatarImage
                    src={mb.user.profilePicture}
                    alt={mb.user.name}
                  />
                  <AvatarFallback>
                    {mb.user.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}

              {/* Hiển thị số lượng còn lại nếu tổng số thành viên > 3 */}
              {workspace.members.length > 2 && (
                <AvatarGroupCount>
                  +{workspace.members.length - 3}
                </AvatarGroupCount>
              )}
            </AvatarGroup>
          </div>
          <Separator orientation="vertical" />
          <div className="flex items-center gap-2 mt-2">
            <span className="text-muted-foreground text-xs">Owner:</span>
            <Avatar title={ownerUser?.name} className="h-6 w-6">
              <AvatarImage
                src={ownerUser?.profilePicture}
                alt={ownerUser?.name}
              />
              <AvatarFallback className="bg-primary text-[10px] text-white">
                {ownerUser?.name?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <Separator orientation="vertical" />
          <span className="text-xs"> 12 Task - 9 Done</span>
        </div>
      </CardContent>
    </Card>
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
