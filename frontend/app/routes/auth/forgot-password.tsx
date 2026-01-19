import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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
import { forgortPasswordSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPasswordRequest } from "hook/use-auth";
import { ArrowLeft, CheckCircle, Loader2, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";
import type z from "zod";

type ForgotPasswordData = z.infer<typeof forgortPasswordSchema>;

const ForgotPassword = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const { mutate, isPending } = useResetPasswordRequest();
  const form = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgortPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = (data: ForgotPasswordData) => {
    mutate(data, {
      onSuccess: () => {
        setIsSuccess(true);
        toast.success(`Check email : ${data.email} to recovery password`);
      },
      onError: (error) => {
        console.log(error);
        toast.error(error.message);
      },
    });
  };
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Send Reset Password Request</h1>
          <p className="text-sm text-muted-foreground truncate">
            Enter your email below to receive a password reset link.
          </p>
        </div>
        <Card>
          <CardContent>
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
                <h1 className="text-2xl font-bold">Email Sent Successfully</h1>
                <p className="text-sm text-muted-foreground truncate">
                  Please check your email for the password reset link.
                </p>
              </div>
            ) : (
              <>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
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
                    <div className="flex justify-between items-center w-full">
                      <Button type="submit" className="bg-muted-foreground">
                        {isPending ? (
                          <div className="flex items-center gap-4">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            Sending....
                          </div>
                        ) : (
                          <div className="flex items-center gap-4">
                            <Send className="w-6 h-6" />
                            Send email recovery
                          </div>
                        )}
                      </Button>
                      <Link to="/sign-in">
                        <Button>
                          <ArrowLeft className="w-4 h-4" />
                          Back to Sign in
                        </Button>
                      </Link>
                    </div>
                  </form>
                </Form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
