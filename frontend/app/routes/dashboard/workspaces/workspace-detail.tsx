import WorkspaceHeader from "@/components/dashboard_component/workspace/workspace-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Project, Workspace } from "@/types";
import { useGetWorkspaceQuery } from "hook/use-worksapce";
import { Loader } from "lucide-react";
import { useState } from "react";
import { data, useParams } from "react-router";

const WorkspaceDetail = () => {
  const { workspacesId } = useParams<{ workspacesId: string }>();
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [inviteMember, setIsInviteMember] = useState(false);

  if (!workspacesId) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        Not found workspace
      </div>
    );
  }
  const { data: workspace, isLoading } = useGetWorkspaceQuery(workspacesId) as {
    data: {
      workspace: Workspace;
      projects: Project[];
    };
    isLoading: boolean;
  };

  if (isLoading) {
    return <WorkspaceDetailSkeleton />;
  }

  return (
    <div className="space-y-8">
      <WorkspaceHeader
        workspace={workspace?.workspace}
        member={workspace?.workspace?.members as any}
        onCreateProject={() => setIsCreateProject(!isCreateProject)}
        onInviteMember={() => setIsInviteMember(!inviteMember)}
      />
    </div>
  );
};

export default WorkspaceDetail;

const WorkspaceDetailSkeleton = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      <Card className="w-full max-w-xs">
        <CardContent>
          <Skeleton className="aspect-video w-full" />
        </CardContent>
      </Card>
    </div>
  );
};
