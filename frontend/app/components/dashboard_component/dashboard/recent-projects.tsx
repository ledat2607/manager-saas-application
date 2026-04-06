import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getProjectProgress, getTaskStatusColor } from "@/lib";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";
import React from "react";
import { Link, useSearchParams } from "react-router";

const RecentProjects = ({ data }: { data: Project[] }) => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Projects</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-muted-foreground font-semibold py-8">
            No Recent project yet
          </p>
        ) : (
          data.map((rp) => {
            const projectProgress = getProjectProgress(rp.tasks);
            return (
              <div className="border rounded-lg p-4 mb-2" key={rp._id}>
                <div className="flex items-center justify-between mb-2">
                  <Link to={`/workspaces/${workspaceId}/projects/${rp._id}`}>
                    <h3 className="font-semibold hover:text-primary transition-colors">
                      {rp.title}
                    </h3>
                  </Link>
                  <span
                    className={cn(
                      "px-2 py-1 text-xs rounded-full",
                      getTaskStatusColor(rp.status),
                    )}
                  >
                    {rp.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                  {rp.description}
                </p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <Progress value={projectProgress} className="h-2 mr-2" />
                    <p className="text-xs text-muted-foreground">
                      {projectProgress}%{" "}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default RecentProjects;
