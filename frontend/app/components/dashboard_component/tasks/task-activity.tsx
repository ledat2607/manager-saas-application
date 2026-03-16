import { getData } from "@/lib/fetch-utils";
import type { ActivityLog } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import { getActivityIcon } from "./task-icon";
import { format, formatDistanceToNow } from "date-fns";

const TaskActivity = ({ resourceId }: { resourceId: string }) => {
  const { data, isPending } = useQuery({
    queryKey: ["task-activity", resourceId],
    queryFn: () => getData(`/tasks/${resourceId}/activity`),
  }) as {
    data: ActivityLog[];
    isPending: boolean;
  };
  if (isPending) {
    return (
      <div className="h-screen">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-bold mb-4">Activity</h3>
      <div className="space-y-4">
        {data?.map((activity) => (
          <div key={activity._id} className="flex gap-2">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {getActivityIcon(activity.action)}
            </div>
            <div>
              <p className="text-sm">
                <span className="text-xs mr-2 font-semibold text-muted-foreground">
                  {activity.user.name}
                </span>
                {activity.details?.details}
              </p>
              <p className="text-xs text-muted-foreground font-semibold">
                {" "}
                {formatDistanceToNow(new Date(activity.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskActivity;
