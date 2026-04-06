import type { Task, TaskStatus } from "@/types";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "sonner";
import { Calendar, CalendarDays } from "lucide-react";
import { useTaskUpdateStatus } from "hook/use-task";
import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const BoardView = ({ sortTask }: { sortTask: Task[] }) => {
  const { mutate, isPending } = useTaskUpdateStatus();
  const [localTasks, setLocalTasks] = useState<Task[]>(sortTask);

  // 2. Đồng bộ lại localTasks mỗi khi dữ liệu từ Server (props) thay đổi
  useEffect(() => {
    setLocalTasks(sortTask);
  }, [sortTask]);

  // 3. Tính toán các cột dựa trên localTasks thay vì sortTask
  const todoTasks = localTasks.filter((task) => task.status === "To Do");
  const inprogressTasks = localTasks.filter(
    (task) => task.status === "In Progress",
  );
  const doneTasks = localTasks.filter((task) => task.status === "Done");

  const columns = [
    { id: "To Do", title: "To Do", tasks: todoTasks, color: "bg-yellow-500" },
    {
      id: "In Progress",
      title: "In Progress",
      tasks: inprogressTasks,
      color: "bg-blue-500",
    },
    { id: "Done", title: "Done", tasks: doneTasks, color: "bg-green-500" },
  ];

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // Ép kiểu về TaskStatus để khớp với mutationFn
    const newStatus = destination.droppableId as TaskStatus;

    mutate(
      { taskId: draggableId, status: newStatus },
      {
        onSuccess: () => {
          toast.success("Cập nhật trạng thái thành công!");
        },
        onError: () => {
          toast.error("Cập nhật thất bại!");
        },
      },
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div
            key={col.id}
            className="flex flex-col min-w-75 bg-slate-50/50 dark:bg-slate-900/40 rounded-xl p-4 border border-border/50"
          >
            {/* Header của cột */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className={`size-2 rounded-full ${col.color}`} />
                <h3 className="font-bold text-sm uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  {col.title}
                </h3>
                <span className="ml-2 bg-slate-200 dark:bg-slate-800 text-[15px] px-5 py-0.5 rounded-full font-bold">
                  {col.tasks.length}
                </span>
              </div>
            </div>

            {/* Vùng thả (Droppable) */}
            <Droppable droppableId={col.id}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3 min-h-125"
                >
                  {col.tasks.map((task, index) => {
                    const startDateFormatted = task.startDate
                      ? format(new Date(task.startDate), "MMM d")
                      : null;
                    const dueDateFormatted = format(
                      new Date(task.dueDate),
                      "MMM d",
                    );
                    return (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "group bg-white dark:bg-slate-800 p-4 rounded-lg border border-border shadow-sm hover:border-primary/50 transition-all",
                              snapshot.isDragging &&
                                "shadow-xl ring-2 ring-primary/20 rotate-2",
                            )}
                          >
                            <Link
                              to={`/workspaces/${task.project.workspace}/projects/${task.project}/tasks/${task._id}`}
                              className="block space-y-2"
                            >
                              <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors">
                                  {task.title}
                                </h4>
                              </div>

                              {task.description && (
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {task.description}
                                </p>
                              )}

                              <div className="flex items-center justify-between pt-2">
                                <Badge
                                  variant={
                                    task.priority === "High"
                                      ? "destructive"
                                      : "secondary"
                                  }
                                  className="text-[10px] px-2 py-0"
                                >
                                  {task.priority}
                                </Badge>

                                <div className="flex items-center gap-1.5 text-[13px] font-medium">
                                  {/* Icon màu xám nhẹ để không lấn át text */}
                                  <CalendarDays className="w-4 h-4 text-slate-400" />

                                  <div className="flex items-center gap-1">
                                    {/* Chỉ hiện Start Date nếu có dữ liệu */}
                                    {startDateFormatted && (
                                      <>
                                        <span className="text-slate-300">
                                          {startDateFormatted}
                                        </span>
                                        <span className="text-slate-500">
                                          -
                                        </span>
                                      </>
                                    )}

                                    {/* Due Date - giữ màu đỏ nếu cần cảnh báo như ảnh cũ */}
                                    <span className="text-[#ef4444]">
                                      {dueDateFormatted}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default BoardView;
