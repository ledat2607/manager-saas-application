import RecentProjects from "@/components/dashboard_component/dashboard/recent-projects";
import StatCard from "@/components/dashboard_component/dashboard/stat-card";
import StatisticsCharts from "@/components/dashboard_component/dashboard/statisChart-data";
import UpCommingTask from "@/components/dashboard_component/dashboard/upcomming-task";
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendData,
  WorkspaceProductivityData,
} from "@/types";
import { useGetWorkspaceStatQuery } from "hook/use-worksapce";

import { useSearchParams } from "react-router";

const DashboardIndex = () => {
  const [searchParams] = useSearchParams();

  const workspaceId = searchParams.get("workspaceId");

  const { data, isPending } = useGetWorkspaceStatQuery(workspaceId!) as {
    data: {
      stats: StatsCardProps;
      taskTrendData: TaskTrendData[];
      projectStatusData: ProjectStatusData[];
      taskPriorityData: TaskPriorityData[];
      workspaceProductivityData: WorkspaceProductivityData[];
      upCommingTask: Task[];
      recentProjects: Project[];
    };
    isPending: boolean;
  };


  if (!workspaceId || isPending) {
    return (
      <div className="p-6">
        <DashboardSkeleton />
      </div>
    );
  }
  return (
    <div className="space-y-8 2xl:space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <StatCard data={data.stats} />
      <StatisticsCharts
        stats={data.stats}
        taskTrendData={data.taskTrendData}
        projectStatusData={data.projectStatusData}
        taskPriorityData={data.taskPriorityData}
        workspaceProductivityData={data.workspaceProductivityData}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentProjects data={data.recentProjects} />
        <UpCommingTask data={data.upCommingTask} />
      </div>
    </div>
  );
};

export default DashboardIndex;

// Bạn có thể dùng thư viện Skeleton của Shadcn UI hoặc tự viết CSS đơn giản
const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 2xl:space-y-12 animate-pulse">
      {/* Skeleton cho Tiêu đề */}
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-gray-200 rounded-md"></div>
      </div>

      {/* Skeleton cho StatCards (Giả sử bạn có 4 thẻ) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-xl w-full"></div>
        ))}
      </div>

      {/* Skeleton cho Charts (Nếu bạn định mở StatisticsCharts sau này) */}
      <div className="h-75 bg-gray-100 rounded-xl w-full"></div>
    </div>
  );
};
