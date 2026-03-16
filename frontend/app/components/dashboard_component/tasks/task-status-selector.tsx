import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskStatus } from "@/types";
import { useTaskUpdateStatus } from "hook/use-task";
import React from "react";
import { toast } from "sonner";

interface TaskStatusSelectorProps {
  status: TaskStatus;
  taskId: string;
}

const TaskStatusSelector = ({ status, taskId }: TaskStatusSelectorProps) => {
  const { mutate, isPending } = useTaskUpdateStatus();
  const handleSelectStatus = (values: string) => {
    mutate(
      {
        taskId,
        status: values as TaskStatus,
      },
      {
        onSuccess: () => {
          toast.success("Update task status successfull!");
        },
        onError: (err: any) => {
          const errMes = err.response.data.message;
          toast.error(`Error: ${errMes}`);
        },
      },
    );
  };

  return (
    <Select
      value={status || ""}
      onValueChange={handleSelectStatus}
      disabled={isPending}
    >
      <SelectTrigger>
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="To Do">To Do</SelectItem>
        <SelectItem value="In Progress">In Progress</SelectItem>
        <SelectItem value="Done">Done</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default TaskStatusSelector;
