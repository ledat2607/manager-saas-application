import type { ChangePasswordFormData } from "@/components/dashboard_component/user/change-password-card";
import type { ProfileFormData } from "@/components/dashboard_component/user/profile-card";
import { getData, postData, putData } from "@/lib/fetch-utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetProfileQuery = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => getData(`/users/profile`),
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      putData("/users/change-password", data),
  });
};

export const useUpdateUserProfile = () => {
  return useMutation({
    mutationFn: (data: ProfileFormData) =>
      putData("/users/change-profile", data),
  });
};

export const useGetNotifications = (workspaceId: string) => {
  return useQuery({
    queryKey: ["notifications", workspaceId],
    queryFn: async () => getData(`/users/notifications/${workspaceId}`),
  });
};

export const useUpdateAdvancedDetails = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      skills: string[];
      bio?: string;
      preferences: {
        language: string;
        timezone: string;
        theme?: string;
      };
    }) => putData("/users/update-advanced-details", payload),

    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["user", data._id] });
    },
  });
};

export const useUpdatePicture = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      profilePicture: string;
      type: "avatar" | "background";
    }) => putData("/users/update-picture", payload),
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["user", data._id] });
    },
  });
};

export const useSetup2FA = () => {
  return useMutation({
    mutationFn: () => postData("/users/setup-2fa", {}),
  });
};

export const useVerify2FA = () => {
  return useMutation({
    mutationFn: (otp: string) => postData("/users/verify-2fa", { otp }),
  });
};
