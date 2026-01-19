import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Github,
  Chrome,
  Facebook,
  Home,
  Loader2,
  Send,
} from "lucide-react";
import { useForm } from "react-hook-form";
import type z from "zod";
import { signInSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSignInMutation } from "hook/use-auth";
import { toast } from "sonner";
import { userAuth } from "@/provider/auth-context";

const SignInForm = () => {
  const { mutate, isPending } = useSignInMutation();
  const { login } = userAuth();
  const navigation = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof signInSchema>) => {
    mutate(values, {
      onSuccess: (data: any) => {
        toast.success(data.message || "Đăng nhập thành công");
        login(data);
        form.reset();
        navigation("/dashboard");
      },
      onError: (error: any) => {
        const errMess = error.response?.data?.message;
        toast.error(errMess || "Đăng nhập thất bại");
      },
    });
  };

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div className="flex w-full rounded-xl overflow-hidden">
        {/* Left - Form */}
        <div className="flex-1 p-1 bg-background">
          <Card className="border border-border/20 dark:border-border/50 shadow-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                Welcome back 👋
              </CardTitle>
              <CardDescription className="text-sm">
                Sign in to continue your work
              </CardDescription>

              <CardAction>
                <Link to="/sign-up">
                  <Button variant="primary" size="sm">
                    Sign up
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
                        <div className="space-y-2">
                          <FormLabel
                            htmlFor="email"
                            className="flex justify-between"
                          >
                            Password
                            <a
                              href="#"
                              className="ml-auto text-xs text-muted-foreground hover:underline"
                            >
                              Forgot password?
                            </a>
                          </FormLabel>

                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                {...field}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="pl-10 border-muted dark:border-muted/60 focus-visible:ring-2 focus-visible:ring-primary/60"
                                required
                              />
                              <Button
                                variant={"ghost"}
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    {isPending ? (
                      <div className="flex items-center gap-4">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <p>Signing....</p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <Send className="w-4 h-4" />
                        <span>Sign In</span>
                      </div>
                    )}
                  </Button>
                </form>
              </Form>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-linear-to-r from-transparent via-border to-transparent" />
                <span className="text-xs text-muted-foreground">
                  Or continue with
                </span>
                <span className="h-px flex-1 bg-linear-to-l from-transparent via-border to-transparent" />
              </div>

              {/* Social login */}
              <div className="flex justify-center gap-3">
                <Button variant="outline" size="icon">
                  <Chrome className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Facebook className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Link
        to="/"
        className="text-balance truncate text-muted-foreground text-sm underline pt-8"
      >
        <Button variant={"outline"}>
          <Home className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};

export default SignInForm;
