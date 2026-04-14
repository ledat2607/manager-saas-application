import { zodResolver } from "@hookform/resolvers/zod";
import React, { use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { ProfileFormData } from "./profile-card";
import { useChangePassword, useSetup2FA, useVerify2FA } from "hook/use-user";
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
  ShieldAlert,
  ShieldCheck,
  KeyRound,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogContent } from "@radix-ui/react-dialog";
import type { User } from "@/types";
import { Badge } from "@/components/ui/badge";

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

const ChangePasswordCard = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const authContext = userAuth();

  const {
    mutate: changePassword,
    isPending: isChangingPassword,
    error,
  } = useChangePassword();
  const { mutate: setup2FA, isPending } = useSetup2FA();

  const { mutate: verify2FA, isPending: isVerifying2FA } = useVerify2FA();

  const [qrCode, setQrCode] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [isStepVerify, setIsStepVerify] = useState(false);
  const [count, setCount] = useState(30);
  const [showQR, setShowQR] = useState(false);

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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showQR && count > 0) {
      timer = setInterval(() => {
        setCount((prev) => prev - 1);
      }, 1000);
    } else if (count === 0) {
      setShowQR(false); // Hết hạn thì ẩn QR đi
    }
    return () => clearInterval(timer);
  }, [showQR, count]);

  const handleSetup2FA = async () => {
    setup2FA(undefined, {
      onSuccess: (data: any) => {
        setQrCode(data.qrCode);
        setCount(30);
        setIsStepVerify(true);
        setShowQR(true);
      },
      onError: (err) => {
        toast.error("Không thể lấy mã QR, thử lại sau nhé!");
      },
    });
  };

  // Bước 2: Xác nhận mã OTP
  const handleVerify2FA = async () => {
    verify2FA(otp, {
      onSuccess: () => {
        toast.success("2FA verified successfully!");
        setIsStepVerify(false);
        setShowQR(false);
        setOtp("");
      },
      onError: (err) => {
        setOtp("");
        toast.error("Invalid OTP. Please try again.");
      },
    });
  };

  const handleOpen2FADialog = () => {
    if (user.twoFactor.isEnabled) {
    }
  };
  return (
    <>
      <Card className="border-none shadow-xl backdrop-blur-md overflow-hidden relative">
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

      <Card className="mt-6 overflow-hidden backdrop-blur-xl">
        <div className="h-1.5 w-full bg-linear-to-r from-rose-600 to-red-700" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-red-500 flex items-center gap-2">
              <KeyRound className="w-6 h-6 text-red-500" />
              Security Settings
            </CardTitle>
            <CardDescription className="text-slate-400">
              Protect your workspace with advanced security layers.
            </CardDescription>
          </div>

          {user.twoFactor.isEnabled ? (
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1" />
              Active
            </Badge>
          ) : (
            <Badge
              variant="default"
              className="bg-rose-500/10 text-rose-500 border-rose-500/20 px-3 py-2"
            >
              <ShieldAlert className="w-4 h-4 mr-1" />
              Disabled
            </Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-400 border border-slate-700/50">
            <div className="space-y-1">
              <p className="font-medium text-white">
                Two-factor Authentication
              </p>
              <p className="text-sm text-slate-500">
                Add an extra layer of security to your account using TOTP.
              </p>
            </div>

            {user.twoFactor.isEnabled ? (
              <Button
                variant="outline"
                className="cursor-pointer hover:bg-rose-500/10 hover:text-white transition-colors"
                onClick={() => {}}
              >
                Disable 2FA
              </Button>
            ) : (
              // <CardContent className="flex flex-col justify-center items-center gap-6">
              //   <Dialog onOpenChange={(open) => !open && setIsStepVerify(false)}>
              //     <DialogTrigger asChild>
              //       <Button
              //         onClick={handleSetup2FA}
              //         variant="outline"
              //         className="hover:bg-primary hover:text-white transition-all cursor-pointer"
              //       >
              //         2FA Enable
              //       </Button>
              //     </DialogTrigger>

              //     <DialogContent className="sm:max-w-md bg-slate-900 text-white border-slate-800 rounded-xl px-4 py-6">
              //       <DialogHeader>
              //         <DialogTitle>Thiết lập xác thực 2 lớp</DialogTitle>
              //       </DialogHeader>

              //       {isPending ? (
              //         <div className="flex flex-col items-center py-10">
              //           <p className="animate-pulse text-slate-400">
              //             Đang khởi tạo mã bảo mật...
              //           </p>
              //         </div>
              //       ) : (
              //         <div className="flex flex-col items-center space-y-6 py-4">
              //           {showQR ? (
              //             <>
              //               <p className="text-sm text-slate-400 text-center">
              //                 Scan the QR code with your authenticator app.
              //               </p>
              //               <div className="p-3 bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              //                 <img src={qrCode} alt="QR" className="w-44 h-44" />
              //               </div>

              //               <div className="text-center">
              //                 <p className="text-sm text-slate-400">
              //                   Mã QR sẽ hết hạn sau:
              //                 </p>
              //                 <p
              //                   className={`text-xl font-bold ${count < 10 ? "text-red-500 animate-pulse" : "text-primary"}`}
              //                 >
              //                   {count}s
              //                 </p>
              //               </div>

              //               <div className="w-full space-y-2">
              //                 <p className="text-xs text-slate-500 uppercase font-bold text-center">
              //                   Nhập mã xác nhận 6 số
              //                 </p>
              //                 <Input
              //                   value={otp}
              //                   onChange={(e) => setOtp(e.target.value)}
              //                   placeholder="000000"
              //                   className="text-center tracking-[1em] font-mono text-lg bg-slate-800 border-slate-700"
              //                   maxLength={6}
              //                 />
              //               </div>
              //               <Button onClick={handleVerify2FA} className="w-full">
              //                 Xác nhận
              //               </Button>
              //             </>
              //           ) : (
              //             <div className="text-center space-y-4 py-10">
              //               <p className="text-slate-400">
              //                 Mã QR đã hết hạn hoặc chưa được tạo.
              //               </p>
              //               <Button onClick={handleSetup2FA} variant="secondary">
              //                 Tạo mã QR mới
              //               </Button>
              //             </div>
              //           )}
              //         </div>
              //       )}
              //     </DialogContent>
              //   </Dialog>
              // </CardContent>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                onClick={handleOpen2FADialog}
              >
                Setup 2FA
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ChangePasswordCard;
