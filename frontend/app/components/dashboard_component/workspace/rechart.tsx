"use client";

import { Pie, PieChart } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  tasks: {
    label: "Tasks",
  },
  done: {
    label: "Done",
    color: "#10b981",
  },
  remaining: {
    label: "Remaining",
    color: "#e5e7eb", // Màu xám nhạt cho phần còn lại
  },
} satisfies ChartConfig;

export function WorkspaceChartPieDonutActive({ data }: { data: any[] }) {
  // 1. Gom tất cả tasks từ tất cả projects vào 1 mảng duy nhất
  const allTasks = data?.flatMap((project) => project.tasks || []) || [];

  // 2. Đếm số lượng task theo trạng thái
  // Lưu ý: Kiểm tra chính xác cái 'status' trong DB của cậu (thường là 'Completed' hoặc 'Done')
  const doneTasks = allTasks.filter(
    (task) => task.status === "Done" || task.status === "Completed",
  ).length;

  const remainingTasks = allTasks.length - doneTasks;

  // 3. Chuẩn bị dữ liệu cho Chart
  // Nếu không có task nào, mặc định hiển thị 100% remaining để biểu đồ không bị trống
  const chartData = [
    {
      status: "done",
      tasks: doneTasks,
      fill: "#10b981",
    },
    {
      status: "remaining",
      tasks: allTasks.length === 0 ? 1 : remainingTasks,
      fill: "#374151",
    },
  ];

  return (
    // Sử dụng aspect-square và set h-full để nó khớp với container bên ngoài
    <ChartContainer config={chartConfig} className="h-12 w-12 aspect-square">
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="tasks"
          nameKey="status"
          innerRadius={12} // Tăng một chút cho rõ ràng
          outerRadius={20}
          strokeWidth={0}
          startAngle={90}
          endAngle={-270}
        />
      </PieChart>
    </ChartContainer>
  );
}
