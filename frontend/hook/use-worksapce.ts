import type { WorkspaceForm } from "@/components/dashboard_component/workspace/create-workspace";
import { getData, postData } from "@/lib/fetch-utils";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: async (data: WorkspaceForm) =>
      postData("/workspaces/create-workspace", data),
  });
};

export const useGetWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => getData("/workspaces"),
  });
};

export const useGetWorkspaceQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspaceId", workspaceId],
    queryFn: async () => getData(`/workspaces/${workspaceId}/projects`),
  });
};
