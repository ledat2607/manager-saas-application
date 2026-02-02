import type { WorkspaceForm } from "@/components/dashboard_component/workspace/create-workspace";
import { postData } from "@/lib/fetch-utils";
import { useMutation } from "@tanstack/react-query";

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: async (data: WorkspaceForm) => postData("/workspaces/create-workspace", data),
  });
};
