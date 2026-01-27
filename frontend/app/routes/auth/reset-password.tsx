import { resetPasswordSchema } from "@/lib/schema";
import type z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useResetPassword } from "hook/use-auth";
// Import thêm các component UI
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePasswordValidation } from "hook/use-password-validation";
import { toast } from "sonner";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, isPending } = useResetPassword();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmNewPassword: "",
      token: token || "",
    },
  });

  //password validate
  const password = form.watch("newPassword");
  const confirmNewPassword = form.watch("confirmNewPassword");

  const passwordValidation = usePasswordValidation(
    password,
    confirmNewPassword,
  );
  const handleSubmit = (data: ResetPasswordFormData) => {
    mutate(data, {
      onSuccess: () => {
        setIsSuccess(true);
        toast.success(`Update password successful`);
        form.reset();
        setTimeout(() => {
          navigate("/sign-in");
        }, 3000);
      },
      onError: (error) => {
        toast.error(error.message);
        console.log(error);
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center space-y-2">
          <h1 className="text-2xl font-bold text-center">Reset Password</h1>
          <p className="text-sm text-muted-foreground text-center">
            Enter your new password below.
          </p>
        </div>

        <Card>
          <CardHeader>
            <Link to="/sign-in" className="w-fit">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Sign in
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <div className="text-center space-y-4">
                <p className="text-green-600 font-medium">
                  Password reset successfully!
                </p>
                <Link to="/sign-in">
                  <Button className="w-full">Go to Login</Button>
                </Link>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  {/* New Password Field */}
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          {/* THAY THẾ <> BẰNG <div> */}
                          <div className="space-y-2">
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 border-muted dark:border-muted/60"
                              />
                              <Button
                                variant="ghost"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>

                            {/* Phần validation rules */}
                            <div className="space-y-1 pt-1">
                              {passwordValidation.rules.map((rule) => (
                                <div
                                  key={rule.label}
                                  className={`text-xs flex items-center gap-2 ${
                                    rule.passed
                                      ? "text-green-500"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  <span>{rule.passed ? "✔" : "•"}</span>
                                  {rule.label}
                                </div>
                              ))}
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Confirm Password Field */}
                  <FormField
                    control={form.control}
                    name="confirmNewPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                            <Input
                              {...field}
                              type={showPasswordConfirm ? "text" : "password"}
                              placeholder="••••••••"
                              className="pl-10 border-muted dark:border-muted/60"
                            />

                            <Button
                              variant="ghost"
                              type="button"
                              onClick={() =>
                                setShowPasswordConfirm(!showPasswordConfirm)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showPasswordConfirm ? <EyeOff /> : <Eye />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {!passwordValidation.isMatch && (
                    <p className="text-xs text-destructive">
                      Passwords do not match
                    </p>
                  )}
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Reset Password
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
