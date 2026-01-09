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
import { Link } from "react-router";

import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Github,
  Chrome,
  Facebook,
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
import { motion } from "framer-motion";

const SignInForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof signInSchema>) => {
    console.log(values);
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="flex w-full max-w-4xl rounded-xl overflow-hidden shadow-lg dark:shadow-white border-2 dark:border-white">
        {/* Left - Form */}
        <div className="flex-1 p-8 bg-background">
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
                    Login
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

        {/* Right - Image */}
        <div className="hidden lg:relative lg:flex flex-1 overflow-hidden">
          <motion.img
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            src="./gradient.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-l from-background/80 via-background/20 to-transparent" />

          {/* Soft noise */}
          <div className="absolute inset-0 opacity-[0.06] bg-[url('/noise.png')]" />
        </div>
      </div>
    </div>
  );
};

export default SignInForm;
