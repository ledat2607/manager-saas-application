import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderKanban, CheckCircle2, ClipboardList, Timer } from "lucide-react";
import type { StatsCardProps } from "@/types";
import { cn } from "@/lib/utils";

const StatCard = ({ data }: { data: StatsCardProps }) => {
  const stats = [
    {
      title: "Total Project",
      value: data.totalProjects,
      description: `${data.totalTaskInProgress} in progress`,
      icon: FolderKanban,
      color: "text-blue-100 dark:text-blue-100",
      bg: "bg-blue-300 dark:bg-blue-500/10",
      borderColor: "hover:border-blue-500/50",
    },
    {
      title: "Total Tasks",
      value: data.totalTasks,
      description: `${data.totalTaskComplete} completed`,
      icon: CheckCircle2,
      color: "text-emerald-100 dark:text-emerald-100",
      bg: "bg-emerald-300 dark:bg-emerald-500/10",
      borderColor: "hover:border-emerald-500/50",
    },
    {
      title: "Total To Do",
      value: data.totalTaskToDo,
      description: "Tasks waiting to be done",
      icon: ClipboardList,
      color: "text-orange-100 dark:text-orange-100",
      bg: "bg-orange-300 dark:bg-orange-500/10",
      borderColor: "hover:border-orange-500/50",
    },
    {
      title: "In Progress",
      value: data.totalTaskInProgress,
      description: "Task currently in progress",
      icon: Timer,
      color: "text-purple-100 dark:text-purple-100",
      bg: "bg-purple-300 dark:bg-purple-500/10",
      borderColor: "hover:border-purple-500/50",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 grid-cols-1">
      {stats.map((item, index) => (
        <Card
          key={index}
          className={cn(
            "relative overflow-hidden transition-all duration-300",
            "border-none group p-0", 
            "bg-transparent", // Card cha trong suốt
          )}
        >
          {/* LỚP NỀN (Màu đặc trưng của stats - sẽ lộ ra ở góc) */}
          <div
            className={cn(
              "absolute inset-0 z-0",
              item.bg, // Màu nền từ stats của bạn (ví dụ: bg-blue-500)
              "opacity-80 group-hover:opacity-100 transition-opacity",
            )}
          />

          {/* LỚP NỘI DUNG (Màu trắng/tối, bo góc để lộ nền) */}
          <div
            className={cn(
              "relative z-10 m-px h-[calc(100%-2px)]", // Tạo viền giả 1px
              "bg-white dark:bg-slate-900",
              "rounded-xl rounded-tr-[40px]", // Bo góc trên bên phải cực mạnh
              "transition-all duration-300",
              "p-4",
            )}
          >
            {/* Header: Icon nằm ở phần góc đã bo */}
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-0">
              <CardTitle className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {item.title}
              </CardTitle>

              {/* Icon nằm đè lên phần góc bo để tạo điểm nhấn */}
              <div
                className={cn(
                  "p-2 rounded-lg transition-transform group-hover:scale-110",
                  item.bg,
                  item.color,
                )}
              >
                <item.icon size={18} />
              </div>
            </CardHeader>

            <CardContent className="p-0 mt-4">
              <div className="text-3xl font-extrabold tracking-tight dark:text-slate-100">
                {item.value}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5 font-medium flex items-center gap-1">
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    item.color.split(" ")[0].replace("text", "bg"),
                  )}
                />
                {item.description}
              </p>
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatCard;
