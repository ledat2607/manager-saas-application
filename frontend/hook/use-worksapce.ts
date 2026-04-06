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

export const useGetWorkspaceStatQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "stats"],
    queryFn: async () => getData(`/workspaces/${workspaceId}/stats`),
  });
};

export const useGetWorkspaceDetailsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "details"],
    queryFn: async () => getData(`/workspaces/${workspaceId}`),
  });
};

export const useInviteMemberToWorkspace = () => {
  return useMutation({
    mutationFn: async (data: {
      workspaceId: string;
      email: string;
      role: string;
    }) => postData(`/workspaces/${data.workspaceId}/invite-member`, data),
  });
};
