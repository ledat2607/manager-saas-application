import type { CreateProjectShemaDialogProps } from "@/components/dashboard_component/project/create-project";
import { getData, postData } from "@/lib/fetch-utils";
import type { Project } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      projectData: CreateProjectShemaDialogProps;
      workspaceId: string;
    }) =>
      postData(
        `/projects/${data.workspaceId}/create-project`,
        data.projectData,
      ),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", data.workspaceId],
      });
    },
  });
};

export const useProjectTasksQuery = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getData(`/projects/${projectId}/tasks`),
  });
};

export const useGetProjectById = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await getData<Project>(`/projects/${projectId}`);
      return response; // Vì getData của bạn đã .data rồi
    },
  });
};

export const useProjectProgress = (tasks: { status: string }[]) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "Done").length;
  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return progress;
};
