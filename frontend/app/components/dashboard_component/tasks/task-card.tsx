import React from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import {
  Calendar,
  MoreHorizontal,
  MessageSquare,
  CheckSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TaskCard = ({ task, onClick }: { task: Task; onClick: () => void }) => {
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400";
      case "Medium":
        return "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  const completedSubtasks =
    task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;
  const progressPercent =
    totalSubtasks > 0
      ? Math.round((completedSubtasks / totalSubtasks) * 100)
      : 0;

  return (
    <TooltipProvider>
      <Card
        onClick={onClick}
        className="group relative flex flex-col overflow-hidden border border-slate-200 bg-white p-3.5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md dark:border-slate-800 dark:bg-slate-950"
      >
        {/* Subtle Side Accent for Priority */}
        <div
          className={cn(
            "absolute left-0 top-0 h-full w-[3px] opacity-0 transition-opacity group-hover:opacity-100",
            task.priority === "High"
              ? "bg-rose-500"
              : task.priority === "Medium"
                ? "bg-amber-500"
                : "bg-slate-400",
          )}
        />

        <div className="space-y-3">
          {/* Header: Priority & Quick Actions */}
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={cn(
                "rounded-md px-2 py-0 text-[10px] font-bold uppercase tracking-wider shadow-none",
                getPriorityStyles(task.priority),
              )}
            >
              {task.priority}
            </Badge>
            <button className="text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-slate-600 dark:hover:text-slate-200">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Title & Description */}
          <div className="space-y-1">
            <h4 className="text-[14px] font-semibold leading-tight text-slate-900 transition-colors group-hover:text-primary dark:text-slate-100">
              {task.title}
            </h4>
            {task.description && (
              <p className="line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">
                {task.description}
              </p>
            )}
          </div>

          {/* Subtask Progress Mini-Bar */}
          {totalSubtasks > 0 && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                <div className="flex items-center gap-1">
                  <CheckSquare className="h-3 w-3" />
                  <span>
                    {completedSubtasks}/{totalSubtasks} Subtasks
                  </span>
                </div>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    progressPercent === 100 ? "bg-emerald-500" : "bg-primary",
                  )}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer: Assignees & Meta */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center -space-x-2">
              {task.assignees?.slice(0, 3).map((member) => (
                <Tooltip key={member._id}>
                  <TooltipTrigger asChild>
                    <Avatar className="h-6 w-6 border-2 border-white ring-offset-background transition-transform hover:z-10 hover:scale-110 dark:border-slate-950">
                      <AvatarImage src={member.profilePicture} />
                      <AvatarFallback className="bg-slate-100 text-[10px] font-bold">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{member.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {task.assignees && task.assignees.length > 3 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-slate-50 text-[9px] font-bold text-slate-500 dark:border-slate-950 dark:bg-slate-800">
                  +{task.assignees.length - 3}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 text-slate-400">
            
              <div className="flex items-center gap-1 text-[11px]">
              
              </div>

              {task.dueDate && (
                <div
                  className={cn(
                    "flex items-center gap-1 text-[11px] font-medium",
                    new Date(task.dueDate) < new Date()
                      ? "text-rose-500"
                      : "text-slate-500",
                  )}
                >
                  <Calendar className="h-3 w-3" />
                  <span>{format(new Date(task.dueDate), "MMM d")}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};

export default TaskCard;
