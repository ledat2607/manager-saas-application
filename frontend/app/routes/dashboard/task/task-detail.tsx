import { BackButton } from "@/components/dashboard_component/back-button";
import CommentSection from "@/components/dashboard_component/tasks/comment-section";
import SubtaskDetails from "@/components/dashboard_component/tasks/sub-task";
import TaskActivity from "@/components/dashboard_component/tasks/task-activity";
import TaskAssigneeSelector from "@/components/dashboard_component/tasks/task-assignee-selector";
import TaskDescription from "@/components/dashboard_component/tasks/task-desctiption";
import TaskPrioritySelector from "@/components/dashboard_component/tasks/task-priority";
import TaskStatusSelector from "@/components/dashboard_component/tasks/task-status-selector";
import TaskTitle from "@/components/dashboard_component/tasks/task-tittle";
import Watchers from "@/components/dashboard_component/tasks/watchers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { userAuth } from "@/provider/auth-context";
import type { Project, Subtask, Task, Workspace } from "@/types";
import { formatDistanceToNow } from "date-fns";
import {
  useArchievedTask,
  useGetTaskQuery,
  useWatchStatusTask,
} from "hook/use-task";
import { AlignLeft, ArrowLeft, Eye, EyeOff, Loader, Trash } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const TaskDetail = () => {
  const { user } = userAuth();
  const { taskId, workspacesId, projectId } = useParams<{
    taskId: string;
    workspacesId: string;
    projectId: string;
  }>();

  const navigate = useNavigate();

  const { mutate: watchTask, isPending: pendingWatch } = useWatchStatusTask();
  const { mutate, isPending } = useArchievedTask();

  const handleWatch = () => {
    watchTask(
      { taskId: task._id },
      {
        onSuccess: () => {
          toast.success("Changed successfull");
        },
        onError: () => {
          toast.error("Failed");
        },
      },
    );
  };
  const handleArchieved = () => {
    mutate(
      { taskId: task._id },
      {
        onSuccess: () => {
          toast.success("Changed successfull");
        },
        onError: () => {
          toast.error("Failed");
        },
      },
    );
  };
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
      {/*Header */}
      <div className="flex flex-col md:flex-row md:justify-between items-center mb-6">
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
            onClick={handleWatch}
            className="w-fit"
            size={"sm"}
            disabled={pendingWatch}
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
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={handleArchieved}
            disabled={isPending}
          >
            {task.isArchived ? "Un archived" : "Archived"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/*Left side */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded p-6 shadow-sm mb-6">
            {/*Header */}
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

                <div className="flex items-center gap-2 justify-between">
                  <i className="text-muted-foreground font-bold text-sm">
                    Due Date:{formatDistanceToNow(task.dueDate)}
                  </i>
                  <i className="text-sm truncate font-semibold text-muted-foreground items-end">
                    Created At:{" "}
                    {formatDistanceToNow(new Date(task.createdAt), {
                      addSuffix: true,
                    })}
                  </i>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <TaskStatusSelector status={task.status} taskId={task._id} />
                <Button
                  variant={"destructive"}
                  className="hidden lg:flex"
                  onClick={() => {}}
                  size={"sm"}
                >
                  <Trash className="mr-2 size-4" />
                  Delete
                </Button>
              </div>
            </div>

            <Separator className="bg-blue-500" />

            {/*Description */}
            <div className="mt-6">
              {/* Label nhỏ phía trên */}
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                <AlignLeft className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Description
                </span>
              </div>

              <TaskDescription
                taskId={task._id}
                description={task?.description}
              />
            </div>

            <TaskAssigneeSelector
              task={task}
              assignees={task.assignees}
              projectMembers={project.members as any}
            />

            <TaskPrioritySelector taskId={task._id} priority={task.priority} />

            <SubtaskDetails subTasks={task.subtasks || []} taskId={task._id} />
          </div>
          <CommentSection taskId={task._id} member={project.members as any} />
        </div>

        {/*Right side */}
        <div className="lg:col-span-1 space-y-6">
          <Watchers watchers={task?.watchers || []} />

          <TaskActivity resourceId={task._id} />
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
