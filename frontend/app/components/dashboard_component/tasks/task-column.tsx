import React from "react";
import TaskCard from "./task-card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CircleDot, MoreHorizontal, Plus } from "lucide-react";
import type { Task } from "@/types";
import { Button } from "@/components/ui/button";

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  isFullWidth?: boolean;
}

const TaskColumn = ({
  title,
  tasks,
  onTaskClick,
  isFullWidth = false,
}: TaskColumnProps) => {
  // Helper to get status colors for the header icon
  const getStatusColor = (title: string) => {
    switch (title.toLowerCase()) {
      case "to do":
        return "text-slate-400";
      case "in progress":
        return "text-amber-500";
      case "done":
        return "text-emerald-500";
      default:
        return "text-blue-500";
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        isFullWidth ? "w-full" : "min-w-[320px] flex-1",
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <CircleDot className={cn("h-4 w-4", getStatusColor(title))} />
          <h2 className="font-bold text-sm tracking-tight text-slate-700 dark:text-slate-200">
            {title}
          </h2>
          <Badge
            variant="secondary"
            className="rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-2 py-0 text-[10px] font-bold"
          >
            {tasks?.length || 0}
          </Badge>
        </div>
      </div>

      {/* Task List Container */}
      <div
        className={cn(
          "rounded-xl transition-colors",
          !isFullWidth
            ? "bg-slate-50/50 dark:bg-slate-900/40 p-3 min-h-125"
            : "",
          isFullWidth &&
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
        )}
      >
        {tasks?.length === 0 ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg py-12",
              isFullWidth && "col-span-full",
            )}
          >
            <div className="bg-white dark:bg-slate-900 p-3 rounded-full shadow-sm mb-3">
              <CircleDot className="h-5 w-5 text-slate-300" />
            </div>
            <p className="text-xs font-medium text-slate-400">No tasks yet</p>
          </div>
        ) : (
          <div
            className={cn(
              "flex flex-col gap-3",
              isFullWidth && "contents", // 'contents' makes the TaskCards follow the parent grid
            )}
          >
            {tasks?.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={() => onTaskClick(task._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
