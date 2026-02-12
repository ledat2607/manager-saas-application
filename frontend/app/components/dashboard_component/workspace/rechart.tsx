"use client";

import { Pie, PieChart, Sector } from "recharts";
// Xóa dòng import lỗi ở đây, chúng ta sẽ tự định nghĩa type nhanh bên dưới

import { Card, CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

// Dữ liệu thực tế từ ảnh của bạn: 9 Done, 3 Remaining (Tổng 12)
const chartData = [
  { status: "done", tasks: 9, fill: "var(--color-done)" },
  { status: "remaining", tasks: 3, fill: "var(--color-remaining)" },
];

const chartConfig = {
  tasks: {
    label: "Tasks",
  },
  done: {
    label: "Done",
    color: "#10b981", // Màu xanh lá giống UI của bạn
  },
  remaining: {
    label: "Remaining",
    color: "#374151", // Màu nền tối
  },
} satisfies ChartConfig;
export function WorkspaceChartPieDonutActive() {
  const chartData = [
    { status: "done", tasks: 9, fill: "#10b981" },
    { status: "remaining", tasks: 3, fill: "#374151" },
  ];

  return (
    <ChartContainer config={{}} className="h-full w-full aspect-square">
      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={chartData}
          dataKey="tasks"
          nameKey="status"
          innerRadius={10} // Nhỏ lại cho vừa túi tiền
          outerRadius={15}
          strokeWidth={2}
          stroke="none"
          startAngle={90}
          endAngle={-270}
        />
        <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  );
}
