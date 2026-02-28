import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import { AlertCircle, Clock } from "lucide-react";
import React from "react";
import { Link } from "react-router";

interface ProjectCardProps {
  workspaceId: string;
  project: Project;
  progress: number;
  key: string;
}

const statusStyles: Record<string, string> = {
  Planning:
    "bg-blue-500 text-white hover:text-blue-500 hover:bg-white border-blue-200",
  "In Progress":
    "bg-amber-500 text-white hover:text-amber-500 hover:bg-white border-amber-200",
  "On Hold":
    "bg-slate-500 text-white hover:text-slate-500 hover:bg-white border-slate-200",
  Completed:
    "bg-emerald-500 text-white hover:text-emerald-500 hover:bg-white border-emerald-200",
  Cancelled:
    "bg-red-500 text-white hover:text-red-500 hover:bg-white border-red-200",
};
const ProjectCard = ({
  workspaceId,
  project,
  progress,
  key,
}: ProjectCardProps) => {
  const badgeStyle =
    statusStyles[project.status] || "bg-gray-100 text-gray-700";

  const getDueStatus = (dueDate: Date) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "overdue"; // Đã quá hạn
    if (diffDays <= 3) return "urgent"; // Sắp hết hạn (trong 3 ngày)
    return "normal"; // Còn nhiều thời gian
  };

  const statusConfig = {
    overdue: "text-red-600 dark:text-red-400 font-bold animate-pulse",
    urgent: "text-amber-600 dark:text-amber-400 font-medium",
    normal: "text-muted-foreground dark:text-slate-400",
  };

  const dueStatus = getDueStatus(project.dueDate);
  const formattedDate = new Date(project.dueDate).toLocaleDateString("vi-VN");
  return (
    <Link to={`/workspaces/${workspaceId}/projects/${project._id}`}>
      <Card className="transition-all duration-300 hover:translate-y-1 hover:shadow-lg mt-4 p-3">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">
                {project.title}
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                {project.description}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={cn(
                "px-2 py-0.5 rounded-full font-medium shadow-sm text-xs",
                badgeStyle,
              )}
            >
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4">
            <div className="space-y-1">
              {/*Progress bar */}
              <div className="flex justify-between text-xs items-center">
                <span>Progress:</span>
                <div className="w-full ml-2 flex items-center space-x-2">
                  <Progress value={progress} />
                  <span className="text-muted-foreground text-balance">
                    {progress}%
                  </span>
                </div>
              </div>

              {/* Task count */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm gap-2 text-muted-foreground">
                  <span>{project.tasks.length}</span>
                  <span>Tasks</span>
                </div>

                {/* Due date */}
                {project.dueDate && (
                  <div className="flex items-center gap-1.5">
                    {/* Thêm icon để cảnh báo trực quan hơn */}
                    {dueStatus === "overdue" && (
                      <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                    )}
                    {dueStatus === "urgent" && (
                      <Clock className="h-3.5 w-3.5 text-amber-500" />
                    )}

                    <span
                      className={cn(
                        "text-xs transition-colors",
                        statusConfig[dueStatus],
                      )}
                    >
                      {dueStatus === "overdue"
                        ? `Quá hạn: ${formattedDate}`
                        : formattedDate}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;
