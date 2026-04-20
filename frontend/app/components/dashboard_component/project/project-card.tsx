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

    if (diffDays < 0) return "overdue";
    if (diffDays <= 3) return "urgent";
    return "normal";
  };
  console.log(project);
  const statusConfig = {
    overdue: "text-red-600 dark:text-red-400 font-bold animate-pulse",
    urgent: "text-amber-600 dark:text-amber-400 font-medium",
    normal: "text-muted-foreground dark:text-slate-400",
  };

  const dueStatus = getDueStatus(project.dueDate);
  const formattedDate = new Date(project.dueDate).toLocaleDateString("vi-VN");
  return (
    <Link to={`/workspaces/${workspaceId}/projects/${project._id}`}>
      <Card className="group relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md">
        <div
          className={cn(
            "absolute top-0 left-0 h-1 w-full",
            badgeStyle.split(" ")[0],
          )}
        />
        {/* Header: Chống vỡ Badge và Title */}
        <CardHeader className="p-4 pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              {" "}
              {/* min-w-0 giúp text-truncate hoạt động */}
              <CardTitle className="truncate text-base font-bold transition-colors group-hover:text-blue-600">
                {project.title}
              </CardTitle>
              <CardDescription className="line-clamp-1 text-xs">
                {project.description || "No description"}
              </CardDescription>
            </div>
            <Badge
              className={cn(
                "shrink-0 whitespace-nowrap px-2 py-0 text-[10px]",
                badgeStyle,
              )}
            >
              {project.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-4 pt-0">
          <div className="flex flex-col gap-4">
            {/* Progress: Tách biệt rõ ràng */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground">
                <span>Tiến độ</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>

            {/* Footer: Dùng flex-wrap để tự xuống dòng khi thiếu chỗ */}
            <div className="flex flex-wrap items-center justify-between gap-y-2 border-t pt-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {project.tasks.length}
                </span>
                <span>Tasks</span>
              </div>

              {project.dueDate && (
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium",
                    dueStatus === "overdue"
                      ? "bg-red-50 text-red-600"
                      : "bg-slate-50 text-slate-500",
                  )}
                >
                  {dueStatus === "overdue" && (
                    <AlertCircle className="h-3 w-3" />
                  )}
                  <span className="whitespace-nowrap">
                    {dueStatus === "overdue"
                      ? `Quá hạn: ${formattedDate}`
                      : formattedDate}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;
