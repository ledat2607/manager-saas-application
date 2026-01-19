import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { useVerifyEmailMutation } from "hook/use-auth";
import { toast } from "sonner";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const { mutate } = useVerifyEmailMutation();
  useEffect(() => {
    const token = searchParams.get("token");

    // Giả lập gọi API
    const verify = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (token) {
        setStatus("success");
        mutate(
          { token },
          {
            onSuccess: () => {
              setStatus("success");
            },
            onError: (error: any) => {
              const errMess = error.response?.data?.message;
              setStatus("error");
              toast.error(errMess || "Xác thực thất bại");
            },
          },
        );
      } else {
        setStatus("error");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div className="flex items-center justify-center p-4 bg-transparent">
      <Card className="w-full max-w-md border-none shadow-xl bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-10 pb-8 px-6 text-center">
          {/* Trạng thái Loading */}
          {status === "loading" && (
            <div className="flex flex-col items-center space-y-4 animate-in fade-in duration-500">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-slate-800">
                  Đang xác thực...
                </h3>
                <p className="text-sm text-slate-500">
                  Vui lòng chờ trong giây lát trong khi chúng tôi kiểm tra mã
                  của bạn.
                </p>
              </div>
            </div>
          )}

          {/* Trạng thái Thành công */}
          {status === "success" && (
            <div className="flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-500">
              <div className="rounded-full bg-green-50 p-3">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">
                  Xác thực thành công!
                </h3>
                <p className="text-slate-500">
                  Email của bạn đã được xác nhận. Bây giờ bạn có thể truy cập
                  đầy đủ các tính năng của hệ thống.
                </p>
              </div>
              <Button
                asChild
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
              >
                <Link to="/sign-in">Đi đến Đăng nhập</Link>
              </Button>
            </div>
          )}

          {/* Trạng thái Thất bại */}
          {status === "error" && (
            <div className="flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-500">
              <div className="rounded-full bg-red-50 p-3">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-900">
                  Xác thực thất bại
                </h3>
                <p className="text-slate-500">
                  Mã xác thực không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra
                  lại email của bạn.
                </p>
              </div>
              <div className="flex flex-col w-full gap-3 mt-6">
                <Button variant="outline" asChild className="w-full">
                  <Link
                    to="/sign-in"
                    className="flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Quay lại Đăng nhập
                  </Link>
                </Button>
                <button className="text-sm text-blue-600 font-medium hover:underline">
                  Gửi lại email xác nhận
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
