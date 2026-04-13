import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import type { ProfileFormData } from "./profile-card";
import { useChangePassword } from "hook/use-user";
import { toast } from "sonner";
import { userAuth } from "@/provider/auth-context";
import { useNavigate } from "react-router";
import z from "zod";
import { changePasswordSchema } from "@/lib/schema";
import { usePasswordValidation } from "hook/use-password-validation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Loader,
  Camera,
  User as UserIcon,
  Lock,
  Mail,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePasswordCard = () => {
  const navigate = useNavigate();
  const authContext = userAuth();

  const {
    mutate: changePassword,
    isPending: isChangingPassword,
    error,
  } = useChangePassword();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handlePasswordChange = (values: ChangePasswordFormData) => {
    changePassword(values, {
      onSuccess: () => {
        toast.success("Security updated. Relogging...");
        setTimeout(() => {
          authContext.logout();
          navigate("/sign-in");
        }, 3000);
      },
    });
  };

  const passwordValidation = usePasswordValidation(
    form.watch("currentPassword"),
    form.watch("newPassword"),
  );

  return (
    <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Lock className="h-24 w-24" />
      </div>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Lock className="h-5 w-5 text-pink-500" /> Password & Security
        </CardTitle>
        <CardDescription>Strengthen your account safety.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handlePasswordChange)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        className="rounded-xl"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Password Rules Visual */}
            <div className="p-4 rounded-2xl bg-muted/30 border border-muted-foreground/10 space-y-2">
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest mb-2">
                Password Requirements
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5">
                {passwordValidation.rules.map((rule) => (
                  <div
                    key={rule.label}
                    className={cn(
                      "text-xs flex items-center gap-2 transition-colors",
                      rule.passed
                        ? "text-emerald-500"
                        : "text-muted-foreground",
                    )}
                  >
                    {rule.passed ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-current ml-1" />
                    )}
                    {rule.label}
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isChangingPassword}
              className="w-full sm:w-fit rounded-xl px-8 bg-pink-600 hover:bg-pink-700 shadow-lg shadow-pink-500/20"
            >
              {isChangingPassword ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Secure Account"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordCard;
