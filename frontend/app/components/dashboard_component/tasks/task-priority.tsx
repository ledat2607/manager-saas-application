import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskPriority } from "@/types";
import { useUpdateTaskPriority } from "hook/use-task";
import { ShieldBan } from "lucide-react";
import { toast } from "sonner";

const TaskPrioritySelector = ({
  taskId,
  priority,
}: {
  taskId: string;
  priority: TaskPriority;
}) => {
  const { mutate, isPending } = useUpdateTaskPriority();

  const handleSelectPriority = (values: string) => {
    mutate(
      {
        taskId,
        priority: values as TaskPriority,
      },
      {
        onSuccess: () => {
          toast.success("Update task priority successfull!");
        },
        onError: (err: any) => {
          const errMes = err.response.data.message;
          toast.error(`Error: ${errMes}`);
        },
      },
    );
  };

  return (
    <>
     <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-2">
        <ShieldBan className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">
          Priority
        </span>
      </div>
      <Select
        value={priority || ""}
        onValueChange={handleSelectPriority}
        disabled={isPending}
      >
        <SelectTrigger>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="High">High</SelectItem>
          <SelectItem value="Medium">Medium</SelectItem>
          <SelectItem value="Low">Low</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default TaskPrioritySelector;
