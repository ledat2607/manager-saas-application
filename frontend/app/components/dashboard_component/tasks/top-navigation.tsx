import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Task, User } from "@/types";
import {
  useArchievedTask,
  useDeleteTask,
  useWatchStatusTask,
} from "hook/use-task";
import { Archive, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import DeleteDialog from "./delete-dialog";

interface TopNavigationProps {
  task: Task;
  user: User;
}

const TopNavigation = ({ task, user }: TopNavigationProps) => {
  const { mutate: watchTask, isPending: pendingWatch } = useWatchStatusTask();
  const { mutate: archiveTask } = useArchievedTask();

  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();

  const isUserWatching = task?.watchers?.some((w: any) => w?._id === user?._id);

  const { mutate: deleteTask } = useDeleteTask();
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
            {task.project.title}
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
  );
};

export default TopNavigation;
