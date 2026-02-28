import type { CreateProjectShemaDialogProps } from "@/components/dashboard_component/project/create-project";
import { postData } from "@/lib/fetch-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      projectData: CreateProjectShemaDialogProps;
      workspaceId: string;
    }) => postData(`/projects/${data.workspaceId}/create-project`, data.projectData),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({
        queryKey: ["projects", data.workspaceId],
      });
    },
  });
};
