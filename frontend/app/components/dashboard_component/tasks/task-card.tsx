import React from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import { AlertCircle, Calendar, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TaskCard = ({ task, onClick }: { task: Task; onClick: () => void }) => {
  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
      case "Medium":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400";
    }
  };

  return (
    <Card
      onClick={onClick}
      className="group p-2 cursor-pointer border-none bg-white dark:bg-card shadow-sm hover:shadow-xl transition-all duration-300 ring-1 ring-slate-200 dark:ring-slate-800 hover:ring-primary/50"
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <Badge
            className={cn(
              "font-semibold text-xs text-white shadow-none border-none rounded-md px-2.5 py-0.5",
              getPriorityStyles(task.priority),
            )}
          >
            {task.priority}
          </Badge>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {task.status !== "To Do" && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-full hover:bg-slate-100"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("to do");
                }}
              >
                <AlertCircle className="size-4 text-slate-500" />
              </Button>
            )}
            {task.status !== "In Progress" && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-full hover:bg-blue-50 hover:text-blue-600"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("in progress");
                }}
              >
                <Clock className="size-4" />
              </Button>
            )}
            {task.status !== "Done" && (
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-full hover:bg-green-50 hover:text-green-600"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("done");
                }}
              >
                <CheckCircle className="size-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2">
        <h4 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
          {task.title}
        </h4>

        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-4">
            {task.description}
          </p>
        )}

        {/* Tiến độ subtasks (Progress Bar nhìn sẽ hiện đại hơn text thuần) */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mb-4 space-y-1.5">
            <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider text-slate-400">
              <span>Progress</span>
              <span>
                {Math.round(
                  (task.subtasks.filter((s) => s.completed).length /
                    task.subtasks.length) *
                    100,
                )}
                %
              </span>
            </div>
            <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{
                  width: `${(task.subtasks.filter((s) => s.completed).length / task.subtasks.length) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50 dark:border-slate-800">
          <div className="flex -space-x-2">
            {task.assignees?.slice(0, 3).map((member) => (
              <Avatar
                key={member._id}
                className="size-7 ring-2 ring-background"
              >
                <AvatarImage src={member.profilePicture} />
                <AvatarFallback className="text-[10px]">
                  {member.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            ))}
            {task.assignees && task.assignees.length > 3 && (
              <div className="size-7 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-background flex items-center justify-center text-[10px] font-medium text-slate-500">
                +{task.assignees.length - 3}
              </div>
            )}
          </div>

          {task.dueDate && (
            <div
              className={cn(
                "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md",
                new Date(task.dueDate) < new Date()
                  ? "text-red-500 bg-red-50"
                  : "text-slate-500 bg-slate-50",
              )}
            >
              <Calendar className="size-3" />
              {format(new Date(task.dueDate), "MMM d")}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
