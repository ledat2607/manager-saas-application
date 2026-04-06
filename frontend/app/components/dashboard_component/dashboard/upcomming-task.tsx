import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import { format } from "date-fns";
import { CheckCircle, Circle } from "lucide-react";
import { Link, useSearchParams } from "react-router";

const UpCommingTask = ({ data }: { data: Task[] }) => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcomming Task</CardTitle>
        <CardDescription>Here are tasks that due soon</CardDescription>
      </CardHeader>
      <CardContent>
        {data?.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No Comming Task yet
          </p>
        ) : (
          data?.map((d) => (
            <Link
              to={`/worksapces/${workspaceId}/projects/${d.project}/tasks/${d._id}`}
              key={d._id}
              className="flex items-start space-x-3 border-b pb-3 pt-4 last:border-0"
            >
              <div
                className={cn(
                  "mt-.0.5 rounded-full p-1",
                  d.priority === "High" && "bg-red-100 text-red-700",
                  d.priority === "Medium" && "bg-yellow-100 text-yellow-700",
                  d.priority === "Low" && "bg-gray-100 text-gray-700",
                )}
              >
                {d.status === "Done" ? (
                  <CheckCircle className="size-4" />
                ) : (
                  <Circle className="size-4" />
                )}
              </div>
              <div className="space-y-1">
                <p className="font-medium text-sm">{d.title}</p>
                <div className="flex items-center justify-between">
                  <Badge
                    className={cn(
                      `rounded-md text-xs p-2`,
                      d.status === "Done"
                        ? "bg-green-500"
                        : d.status === "To Do"
                          ? "bg-blue-500"
                          : "bg-yellow-500",
                    )}
                  >
                    {d.status}
                  </Badge>
                  {d.dueDate && (
                    <>
                      <span className="ml-4">-</span>
                      <span className="ml-4 text-xs text-muted-foreground">{format(new Date(d.dueDate), "MMM d, yyyy")}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default UpCommingTask;
