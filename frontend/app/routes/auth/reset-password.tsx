import { resetPasswordSchema } from "@/lib/schema";
import type z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {  Link, useSearchParams } from "react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const handleSubmit = (data: ResetPasswordFormData) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-sm text-muted-foreground truncate">
            Enter your new password below.
          </p>
        </div>
        <Card>
          <CardHeader>
            <Link to="/sign-in">
              <Button>
                <ArrowLeft className="w-4 h-4" />
                Back to Sign in
              </Button>
            </Link>
          </CardHeader>
          <CardContent></CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
