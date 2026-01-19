import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signUpSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, Lock, Mail, PersonStanding } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import type z from "zod";
import { usePasswordValidation } from "hook/use-password-validation";
import { useSignUpMuatation } from "hook/use-auth";
import { toast } from "sonner";

export type SignUpFormData = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      confirmPassword: "",
      email: "",
      password: "",
    },
  });

  // Watch password and confirm password fields
  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");

  const passwordValidation = usePasswordValidation(password, confirmPassword);

  // Handle form submission
  const { mutate, isPending } = useSignUpMuatation();
  const handleSubmit = (values: z.infer<typeof signUpSchema>) => {
    mutate(values, {
      onSuccess: () => {
        toast.success(
          "Account created successfully! Please check your email to verify your account."
        );
        form.reset();
        navigate("/sign-in");
      },
      onError: (error) => {
        toast.error(error.message || "Something went wrong. Please try again.");
      },
    });
  };
  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="flex w-full rounded-xl overflow-hidden">
        {" "}
        <div className="flex-1 p-1 bg-background">
          <Card className="border border-border/20 dark:border-border/50 shadow-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Welcome 👋</CardTitle>
              <CardDescription className="text-sm">
                Sign up your account to get started.
              </CardDescription>

              <CardAction>
                <Link to="/sign-in">
                  <Button variant="primary" size="sm">
                    Sign In
                  </Button>
                </Link>
              </CardAction>
            </CardHeader>

            <CardContent className="space-y-6">
              <Form {...form}>
                <form
                  className="space-y-4"
                  onSubmit={form.handleSubmit(handleSubmit)}
                >
                  {/*Name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <PersonStanding className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              {...field}
                              type="name"
                              placeholder="John Doe"
                              className="pl-10 border-muted dark:border-muted/60 focus-visible:ring-2 focus-visible:ring-primary/60"
                              required
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="space-y-2">
                          <FormLabel htmlFor="email">Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                type="email"
                                placeholder="m@example.com"
                                className="pl-10 border-muted dark:border-muted/60 focus-visible:ring-2 focus-visible:ring-primary/60"
                                required
                              />
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <>
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
                                className="absolute right-3 top-1/2 -translate-y-1/2"
                              >
                                {showPassword ? <EyeOff /> : <Eye />}
                              </Button>
                            </div>
                            <div className="space-y-1 pt-2">
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
                          </>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
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

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={
                      !passwordValidation.isStrong ||
                      !passwordValidation.isMatch ||
                      form.formState.isSubmitting ||
                      isPending
                    }
                  >
                    {isPending ? (
                      <div className="flex items-center justify-between">
                        <span>Creating Account</span>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      </div>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
