import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Subtask } from "@/types";
import { useAddSubtask, useUpdateStatusSubtask } from "hook/use-task";
import { Blocks, Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const SubtaskDetails = ({
  subTasks,
  taskId,
}: {
  subTasks: Subtask[];
  taskId: string;
}) => {
  const [newSubtask, setNewSubtask] = useState("");

  const { mutate, isPending } = useAddSubtask();
  const { mutate: updateStatusSubtask, isPending: pendingUpdateStatus } =
    useUpdateStatusSubtask();

  const handleToggleSubTask = (subTaskId: string, checked: boolean) => {
    updateStatusSubtask(
      {
        subTaskId: subTaskId,
        taskId: taskId,
        completed: checked,
      },
      {
        onSuccess: () => {
          toast.success("Update subtask status successfull");
        },
        onError: (err: any) => {
          const errMes = err.response.data.message;
          toast.error(errMes);
          console.log(err);
        },
      },
    );
  };
  const handleAddNewSubtask = () => {
    mutate(
      {
        taskId: taskId,
        title: newSubtask,
      },
      {
        onSuccess: () => {
          toast.success(`Create new subtask successfull`);
          setNewSubtask("");
        },
        onError: (err: any) => {
          const errMess = err.response.data.message;
          toast.error(errMess);
          console.log(err);
        },
      },
    );
  };
  return (
    <div className="mb-6 mt-6">
      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
        <Blocks className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-wider">
          Subtask
        </span>
      </div>
      <div className="space-y-2 mb-4 mt-4">
        {subTasks.length > 0 ? (
          subTasks.map((subTask) => (
            <div
              key={subTask._id}
              className="flex gap-2 items-center font-semibold"
            >
              <Checkbox
                disabled={pendingUpdateStatus}
                checked={subTask.completed}
                id={subTask._id}
                onCheckedChange={(checked) =>
                  handleToggleSubTask(subTask._id, !!checked)
                }
              />
              <label
                className={cn(
                  `text-sm`,
                  subTask.completed && "line-through text-muted-foreground",
                )}
              >
                {subTask.title}
              </label>
            </div>
          ))
        ) : (
          <div className="text-sm text-muted-foreground">No subtask found</div>
        )}
      </div>
      <div className="flex">
        <Input
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          placeholder="Add new subtask"
          className="mr-2"
        />
        <Button
          disabled={isPending}
          onClick={handleAddNewSubtask}
          variant={"primary"}
        >
          <Plus className="mr-2" />
          Add
        </Button>
      </div>
    </div>
  );
};

export default SubtaskDetails;
