import { postData } from "@/lib/fetch-utils";
import type { SignUpFormData } from "@/routes/auth/_components/sign-up-form";
import { useMutation } from "@tanstack/react-query";

export const useSignUpMuatation = () => {
  // Implementation of the sign-up mutation hook
  return useMutation({
    mutationFn: (data: SignUpFormData) => postData("/auth/register", data),
  });
};

export const useVerifyEmailMutation = () => {
  return useMutation({
    mutationFn: ({ token }: { token: string }) =>
      postData("/auth/verify-email", { token }),
  });
};

export const useSignInMutation = () => {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      postData("/auth/login", data),
  });
};

export const useResetPasswordRequest = () => {
  return useMutation({
    mutationFn: (data: { email: string }) =>
      postData("/auth/reset-password-request", data),
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: {
      token: string;
      newPassword: string;
      confirmNewPassword: string;
    }) => postData("/auth/reset-password", data),
  });
};
