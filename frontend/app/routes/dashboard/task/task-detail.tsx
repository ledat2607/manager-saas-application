import { BackButton } from "@/components/dashboard_component/back-button";
import TaskTitle from "@/components/dashboard_component/tasks/task-tittle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { userAuth } from "@/provider/auth-context";
import type { Project, Task, Workspace } from "@/types";
import { useGetTaskQuery } from "hook/use-task";
import { ArrowLeft, Eye, EyeOff, Loader } from "lucide-react";
import { useNavigate, useParams } from "react-router";

const TaskDetail = () => {
  const { user } = userAuth();
  const { taskId, workspacesId, projectId } = useParams<{
    taskId: string;
    workspacesId: string;
    projectId: string;
  }>();

  const navigate = useNavigate();
  const { data, isLoading } = useGetTaskQuery(taskId!) as {
    data: {
      task: Task;
      project: Project;
    };
    isLoading: boolean;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }
  const { task, project } = data;

  const isUserWatching = task?.watchers?.some(
    (watcher) => watcher?._id.toString() === user?._id.toString(),
  );

  const goBack = () => navigate(-1);

  const member = task.assignees || [];

  return (
    <div className="container mx-auto p-0 py-4 md:px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant={"outline"} onClick={goBack}>
            <ArrowLeft /> Back
          </Button>
          <h1 className="text-2xl font-bold">{task.title}</h1>
          {task.isArchived && (
            <Badge className="mr-4 w-fit px-0 md:px-4">Archived</Badge>
          )}
        </div>

        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button
            variant={"outline"}
            onClick={() => {}}
            className="w-fit"
            size={"sm"}
          >
            {isUserWatching ? (
              <>
                <EyeOff className="mr-2 size-4" />
                Un watch
              </>
            ) : (
              <>
                <Eye className="mr-2 size-4" />
                Watch
              </>
            )}
          </Button>
          <Button variant={"outline"} size={"sm"} onClick={() => {}}>
            {task.isArchived ? "Un archived" : "Archived"}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="lg:col-span-2">
          <div className="bg-card rounded p-6 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
              <div>
                <Badge
                  variant={
                    task.priority === "High"
                      ? "destructive"
                      : task.priority === "Medium"
                        ? "default"
                        : "outline"
                  }
                  className="rounded-md p-2 text-xs"
                >
                  {task.priority} priority
                </Badge>
                <TaskTitle title={task.title} taskId={task._id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
