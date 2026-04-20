import { BackButton } from "@/components/dashboard_component/back-button";
import { CreateTaskDialog } from "@/components/dashboard_component/tasks/create-task-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { Project, Task, TaskStatus } from "@/types";

import {
  useGetProjectById,
  useProjectProgress,
  useProjectTasksQuery,
} from "hook/use-project";
import {
  Loader,
  Plus,
  LayoutGrid,
  ListChecks,
  Calendar,
  CheckCircle2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import TaskColumn from "@/components/dashboard_component/tasks/task-column";
import { cn } from "@/lib/utils";

const ProjectDetail = () => {
  const { projectId, workspacesId } = useParams<{
    projectId: string;
    workspacesId: string;
  }>();

  const navigate = useNavigate();
  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "ALL">("ALL");

  const { data, isLoading } = useProjectTasksQuery(projectId!) as {
    data: { tasks: Task[]; project: Project };
    isLoading: boolean;
  };

  const { data: projectData, isLoading: projectLoading } = useGetProjectById(
    projectId!,
  );

  if (projectLoading || isLoading || !data) {
    return (
      <div className="flex items-center min-h-screen justify-center">
        <Loader className="animate-spin text-primary" />
      </div>
    );
  }

  const { project, tasks } = data;
  const progressTask = useProjectProgress(tasks || []);

  const handleTaskClick = (taskId: string) => {
    navigate(
      `/workspaces/${workspacesId}/projects/${projectId}/tasks/${taskId}`,
    );
  };

  const stats = [
    { label: "Total Tasks", value: tasks.length, color: "text-slate-600" },
    {
      label: "In Progress",
      value: tasks.filter((t) => t.status === "In Progress").length,
      color: "text-amber-500",
    },
    {
      label: "Completed",
      value: tasks.filter((t) => t.status === "Done").length,
      color: "text-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* --- HERO HEADER SECTION --- */}
      <header className="border-b rounded-md pb-8 pt-4 sticky top-0 z-10 backdrop-blur-2xl bg-white/50 dark:bg-slate-900/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-6">
            <BackButton />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
                  {project?.title}
                </h1>
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 p-1 text-xs font-medium rounded-md"
                >
                  {project?.status || "Active"}
                </Badge>
              </div>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                {project?.description || "No project description provided."}
              </p>
            </div>

            {/* Quick Stats Card */}
            <div className="flex items-center gap-6 bg-white dark:bg-slate-900 p-5 rounded-xl border shadow-sm shrink-0">
              <div className="flex gap-8 px-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="text-2xl font-bold tracking-tight">
                      {stat.value}
                    </span>
                    <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              <Separator orientation="vertical" className="h-10" />

              <div className="flex flex-col min-w-35 gap-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span className="text-muted-foreground text-[10px]">
                    Progress
                  </span>
                  <span className="text-primary">{progressTask}%</span>
                </div>
                <Progress value={progressTask} className="h-2 shadow-sm" />
              </div>

              <Button
                onClick={() => setIsCreateTask(true)}
                className="ml-2 shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="mr-2 h-4 w-4" /> New Task
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT SECTION --- */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        <Tabs defaultValue="all" className="w-full space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <TabsList className="bg-transparent h-auto p-0 gap-8 border-b w-full md:w-auto rounded-none justify-start">
              <TabsTrigger
                value="all"
                onClick={() => setTaskFilter("ALL")}
                className="rounded-none data-[state=active]:bg-blue-500 rounded-t-xl data-[state=active]:text-white px-0 pb-3 font-semibold shadow-none transition-all p-2 cursor-pointer"
              >
                <LayoutGrid className="w-4 h-4 mr-2" /> Board View
              </TabsTrigger>
              <TabsTrigger
                value="todo"
                onClick={() => setTaskFilter("To Do")}
                className="rounded-none data-[state=active]:bg-blue-500 rounded-t-xl data-[state=active]:text-white px-0 pb-3 font-semibold shadow-none transition-all p-2 cursor-pointer"
              >
                To Do
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                onClick={() => setTaskFilter("In Progress")}
                className="rounded-none data-[state=active]:bg-blue-500 rounded-t-xl data-[state=active]:text-white px-0 pb-3 font-semibold shadow-none transition-all p-2 cursor-pointer"
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger
                value="done"
                onClick={() => setTaskFilter("Done")}
                className="rounded-none data-[state=active]:bg-blue-500 rounded-t-xl data-[state=active]:text-white px-0 pb-3 font-semibold shadow-none transition-all p-2 cursor-pointer"
              >
                Done
              </TabsTrigger>
            </TabsList>

            {/* Visual Status Indicators */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900/50 px-4 py-2 rounded-full border border-dashed">
              <div className="flex items-center gap-2 text-[11px] font-medium">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="text-muted-foreground">
                  {tasks.filter((t) => t.status === "To Do").length} To Do
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium">
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-muted-foreground">
                  {tasks.filter((t) => t.status === "In Progress").length}{" "}
                  Active
                </span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-medium">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">
                  {tasks.filter((t) => t.status === "Done").length} Done
                </span>
              </div>
            </div>
          </div>

          <TabsContent value="all" className="m-0 outline-none">
            <div className="bg-slate-50/50 dark:bg-slate-900/20 p-6 rounded-2xl border border-dashed min-h-[500px]">
              <div className="grid lg:grid-cols-3 gap-8">
                <TaskColumn
                  title="To Do"
                  tasks={tasks.filter((task) => task.status === "To Do")}
                  onTaskClick={handleTaskClick}
                />
                <TaskColumn
                  title="In Progress"
                  tasks={tasks.filter((task) => task.status === "In Progress")}
                  onTaskClick={handleTaskClick}
                />
                <TaskColumn
                  title="Done"
                  tasks={tasks.filter((task) => task.status === "Done")}
                  onTaskClick={handleTaskClick}
                />
              </div>
            </div>
          </TabsContent>

          {/* Filtering individual tabs */}
          {["todo", "in-progress", "done"].map((statusValue) => (
            <TabsContent
              key={statusValue}
              value={statusValue}
              className="m-0 outline-none"
            >
              <div className="bg-white dark:bg-slate-900/40 p-6 rounded-2xl border min-h-[400px]">
                <TaskColumn
                  title={statusValue.replace("-", " ")}
                  tasks={tasks.filter(
                    (task) =>
                      task.status.toLowerCase().replace(" ", "-") ===
                      statusValue,
                  )}
                  onTaskClick={handleTaskClick}
                  isFullWidth
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Task Create Dialog */}
      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId!}
        projectMembers={project?.members as any}
      />
    </div>
  );
};

export default ProjectDetail;
