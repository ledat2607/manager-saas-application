import StatCard from "@/components/dashboard_component/dashboard/stat-card";
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  WorkspaceProductivityData,
} from "@/types";
import { useGetWorkspaceStatQuery } from "hook/use-worksapce";
import { Loader } from "lucide-react";
import React from "react";
import { useSearchParams } from "react-router";

const DashboardIndex = () => {
  const [searchParams] = useSearchParams();
  const workspaceId = searchParams.get("workspaceId");
  if (!workspaceId) return;
  const { data, isPending } = useGetWorkspaceStatQuery(workspaceId!) as {
    data: {
      stats: StatsCardProps;
      taskTrendsData: TaskTrendsData[];
      projectStatusData: ProjectStatusData[];
      taskPriorityData: TaskPriorityData[];
      workspaceProductivityData: WorkspaceProductivityData[];
      upcomingTasks: Task[];
      recentProjects: Project[];
    };
    isPending: boolean;
  };

  if (isPending) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  return (
    <div className="space-y-8 2xl:space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <StatCard data={data.stats} />
      {/* <StatisticsCharts /> */}
    </div>
  );
};

export default DashboardIndex;
