import type { Task } from "@/types";
import {
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  Folder,
  LineChart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router";
import { format, formatDistanceToNow } from "date-fns";

const ListViewTask = ({ sortTask }: { sortTask: Task[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My task</CardTitle>
        <CardDescription>{sortTask.length} task found</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {sortTask?.map((task) => (
            <div
              key={task._id}
              className="group p-5 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-all border-b border-border/50 last:border-none"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Side: Status & Title */}
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {task.status === "Done" ? (
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                        <CheckCircle className="size-5" />
                      </div>
                    ) : task.status === "To Do" ? (
                      <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full">
                        <Clock className="size-5" />
                      </div>
                    ) : (
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                        <LineChart className="size-5" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Link
                      to={`/workspaces/${task.project.workspace}/projects/${task.project._id}/tasks/${task._id}`}
                      className="text-base font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1"
                    >
                      {task.title}
                      <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity size-4" />
                    </Link>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {task.status}
                      </span>
                      {task.priority && (
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            task.priority === "High"
                              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {task.priority}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Metadata */}
                <div className="flex flex-wrap lg:flex-col items-start lg:items-end gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {task.dueDate && (
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Calendar className="size-3.5" />
                      <span className="font-medium">
                        {format(task.dueDate, "MMM d, yyyy")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Folder className="size-3.5" />
                    <span>{task.project.title}</span>
                  </div>
                  <div className="text-[12px] opacity-70">
                    Updated{" "}
                    {formatDistanceToNow(task.updatedAt, {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {sortTask.length === 0 && (
            <span className="text-2xl text-center">No task found</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListViewTask;
