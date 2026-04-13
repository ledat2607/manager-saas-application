import { BackButton } from "@/components/dashboard_component/back-button";
import CommentSection from "@/components/dashboard_component/tasks/comment-section";
import DeleteDialog from "@/components/dashboard_component/tasks/delete-dialog";
import SubtaskDetails from "@/components/dashboard_component/tasks/sub-task";
import TaskActivity from "@/components/dashboard_component/tasks/task-activity";
import TaskAssigneeSelector from "@/components/dashboard_component/tasks/task-assignee-selector";
import TaskDescription from "@/components/dashboard_component/tasks/task-desctiption";
import TaskPrioritySelector from "@/components/dashboard_component/tasks/task-priority";
import TaskStatusSelector from "@/components/dashboard_component/tasks/task-status-selector";
import TaskTitle from "@/components/dashboard_component/tasks/task-tittle";
import Watchers from "@/components/dashboard_component/tasks/watchers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { userAuth } from "@/provider/auth-context";
import type { Project, Task } from "@/types";
import { formatDistanceToNow } from "date-fns";
import {
  useArchievedTask,
  useDeleteTask,
  useGetTaskQuery,
  useWatchStatusTask,
} from "hook/use-task";
import {
  AlignLeft,
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  EyeOff,
  Loader,
  Trash2,
  Archive,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const TaskDetail = () => {
  const { user } = userAuth();
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const { mutate: watchTask, isPending: pendingWatch } = useWatchStatusTask();
  const { mutate: archiveTask } = useArchievedTask();
  const { data, isLoading } = useGetTaskQuery(taskId!) as any;
  const { mutate: deleteTask } = useDeleteTask();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );

  const { task, project } = data;
  const isUserWatching = task?.watchers?.some((w: any) => w?._id === user?._id);
  const isAssignee = task?.assignees?.some((a: any) => a._id === user?._id);

  const isOwner = task.createdBy._id === user?._id;

  const handleDelete = () => {
    if (!isOwner) {
      return toast.warning("Only task owner can delete the task");
    }
    deleteTask(
      { taskId: taskId! },
      {
        onSuccess: () => {
          toast.success("Task deleted successfully");
        },
        onError: () => {
          toast.error("Failed to delete task");
        },
        onSettled: () => {
          navigate(-1);
        },
      },
    );
  };
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 mr-2 py-3 mb-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-slate-100 text-slate-600"
            >
              <ArrowLeft className="mr-2 size-4" /> Back
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <span className="text-sm font-medium text-slate-500">
              {project.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              title={isUserWatching ? "Unwatch" : "Watch"}
              variant="outline"
              size="sm"
              onClick={() => watchTask({ taskId: task._id })}
              disabled={pendingWatch}
              className={
                isUserWatching ? "bg-blue-50 text-blue-600 border-blue-200" : ""
              }
            >
              {isUserWatching ? (
                <EyeOff className="lg:mr-2 size-4" />
              ) : (
                <Eye className="lg:mr-2 size-4" />
              )}
              <p className="hidden lg:block">
                {isUserWatching ? "Unwatch" : "Watch"}
              </p>
            </Button>
            <Button
              title={task.isArchived ? "Restore" : "Archive"}
              variant="outline"
              size="sm"
              onClick={() => archiveTask({ taskId: task._id })}
              className={
                task.isArchived
                  ? "bg-amber-50 text-amber-600 border-amber-200"
                  : ""
              }
            >
              <Archive className="lg:mr-2 size-4" />
              <p className="hidden lg:block">
                {task.isArchived ? "Restore" : "Archive"}
              </p>
            </Button>
            <DeleteDialog taskId={task._id} onDelete={handleDelete} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area (Left) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.1)] border border-slate-200">
              {/* Task Header Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Badge className="rounded-full px-3 py-0.5 font-semibold uppercase tracking-wider text-[10px]">
                    {task.priority} Priority
                  </Badge>
                  {task.isArchived && (
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-700 border-none"
                    >
                      Archived
                    </Badge>
                  )}
                </div>

                <TaskTitle title={task.title} taskId={task._id} />

                <div className="flex flex-wrap items-center gap-6 text-slate-500">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-4 text-blue-500" />
                    <span className="font-medium">
                      Due:{" "}
                      {formatDistanceToNow(new Date(task.dueDate), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="size-4 text-slate-400" />
                    <span>
                      Created{" "}
                      {formatDistanceToNow(new Date(task.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="my-8 opacity-50" />

              {/* Description Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <AlignLeft className="h-5 w-5" />
                  <h3 className="font-bold uppercase text-xs tracking-widest">
                    Description
                  </h3>
                </div>
                <div className="pl-7">
                  <TaskDescription
                    taskId={task._id}
                    description={task?.description}
                  />
                </div>
              </div>

              {/* Subtasks Section */}
              <div className="mt-10 pt-10 border-t border-slate-100">
                <SubtaskDetails
                  subTasks={task.subtasks || []}
                  taskId={task._id}
                />
              </div>
            </div>

            {/* Comments Area */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <CommentSection
                taskId={task._id}
                member={project.members as any}
              />
            </div>
          </div>

          {/* Sidebar Area (Right) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 divide-y divide-slate-100">
              <div className="pb-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                  Status & Metadata
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-sm font-medium text-slate-500">
                      Status
                    </label>
                    <TaskStatusSelector
                      status={task.status}
                      taskId={task._id}
                      isAssigned={isAssignee}
                    />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-sm font-medium text-slate-500">
                      Priority
                    </label>
                    <TaskPrioritySelector
                      taskId={task._id}
                      priority={task.priority}
                    />
                  </div>
                </div>
              </div>

              <div className="py-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                  Owner
                </h3>
                <div className="flex items-center gap-4">
                  <Avatar className="size-6">
                    <AvatarImage
                      src={task.createdBy.profilePicture}
                      title={task.createdBy.name}
                      className="cursor-pointer"
                    />
                    <AvatarFallback>
                      {task.createdBy.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs truncate text-muted-foreground">
                    {task.createdBy.name}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider mt-4">
                  Assignees
                </h3>
                <TaskAssigneeSelector
                  task={task}
                  assignees={task.assignees}
                  projectMembers={project.members as any}
                  isAssignees={isAssignee}
                />
              </div>

              <div className="pt-6">
                <Watchers watchers={task?.watchers || []} />
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                Activity Feed
              </h3>
              <TaskActivity resourceId={task._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
