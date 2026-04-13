import { BackButton } from "@/components/dashboard_component/back-button";
import { CreateTaskDialog } from "@/components/dashboard_component/tasks/create-task-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Project, Task, TaskStatus } from "@/types";

import {
  useGetProjectById,
  useProjectProgress,
  useProjectTasksQuery,
} from "hook/use-project";
import { Loader, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import TaskColumn from "@/components/dashboard_component/tasks/task-column";

const ProjectDetail = () => {
  const { projectId, workspacesId } = useParams<{
    projectId: string;
    workspacesId: string;
  }>();

  const navigate = useNavigate();

  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "ALL">("ALL");

  const { data, isLoading } = useProjectTasksQuery(projectId!) as {
    data: {
      tasks: Task[];
      project: Project;
    };
    isLoading: boolean;
  };

  const { data: projectData, isLoading: projectLoading } = useGetProjectById(
    projectId!,
  );
  if (projectLoading || isLoading || !data) {
    return (
      <div className="flex items-center min-h-screen justify-center">
        <Loader className="animate-spin" />
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

  return (
    <div className="space-y-8">
      {/* Project Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <BackButton />
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">{project?.title}</h1>
          </div>
          {project?.description && (
            <p className="text-sm text-gray-500">{project?.description}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 min-w-56">
            <div className="text-sm text-muted-foreground">Progress:</div>
            <div className="flex items-center w-full gap-2">
              <Progress value={progressTask} className="h-2" />
              <p className="text-xs text-muted-foreground">{progressTask}% </p>
            </div>
          </div>
          <Button
            title="Create task"
            variant={"outline"}
            onClick={() => setIsCreateTask(true)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {/* Task Filter Tabs */}
      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setTaskFilter("ALL")}>
                All Tasks
              </TabsTrigger>
              <TabsTrigger value="todo" onClick={() => setTaskFilter("To Do")}>
                To Do
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                onClick={() => setTaskFilter("In Progress")}
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger value="done" onClick={() => setTaskFilter("Done")}>
                Done
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground text-xs text-balance">
                Status:
              </span>
              <div className="flex gap-3 ml-3">
                <Badge
                  variant="outline"
                  className="bg-background text-xs text-muted-foreground rounded-md p-2"
                >
                  {tasks?.filter((task) => task.status === "To Do").length} To
                  Do
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-background text-xs text-muted-foreground rounded-md p-2"
                >
                  {
                    tasks?.filter((task) => task.status === "In Progress")
                      .length
                  }{" "}
                  In Progress
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-background text-xs text-muted-foreground rounded-md p-2"
                >
                  {tasks?.filter((task) => task.status === "Done").length} Done
                </Badge>
              </div>
            </div>
          </div>
          <TabsContent value="all" className="m-0">
            <div className="grid lg:grid-cols-3 gap-4">
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
          </TabsContent>
          <TabsContent value="todo" className="m-0">
            <div className="grid md:grid-cols-2 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>
          <TabsContent value="in-progress" className="m-0">
            <div className="grid md:grid-cols-2 gap-4">
              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>{" "}
          <TabsContent value="done" className="m-0">
            <div className="grid md:grid-cols-2 gap-4">
              <TaskColumn
                title="Done"
                tasks={tasks.filter((task) => task.status === "Done")}
                onTaskClick={handleTaskClick}
                isFullWidth
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

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
