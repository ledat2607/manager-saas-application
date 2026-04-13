import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter, // Thêm nếu cần
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Workspace } from "@/types";
import {
  useAccecptWorkspaceInvite,
  useAccecptWorkspaceInviteLink,
  useGetWorkspaceDetailsQuery,
} from "hook/use-worksapce";
import { Loader, Users, CheckCircle2 } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "sonner";

const WorkspaceInvite = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("tk");

  const { data: workspace, isLoading } = useGetWorkspaceDetailsQuery(
    workspaceId!,
  ) as {
    data: Workspace;
    isLoading: boolean;
  };

  const { mutate: acceptInvite, isPending: isAccepting } =
    useAccecptWorkspaceInvite();

  const { mutate: acceptInviteLink, isPending: isAcceptingLink } =
    useAccecptWorkspaceInviteLink();

  const handleAcceptInvite = () => {
    if (!workspaceId) return;

    if (token) {
      acceptInvite(token, {
        onSuccess: () => {
          toast.success("Tham gia thành công!");
          navigate(`/workspaces/${workspaceId}`);
        },
        onError: () => toast.error("Liên kết mời không hợp lệ hoặc đã hết hạn"),
      });
    } else {
      acceptInviteLink(workspaceId, {
        onSuccess: () => {
          toast.success("Tham gia thành công!");
          navigate(`/workspaces/${workspaceId}`);
        },
        onError: () => toast.error("Không thể tham gia không gian này"),
      });
    }
  };

  const handleDeclineInvite = () => {
    toast.info(
      "Từ chối lời mời hiện chưa được hỗ trợ. Vui lòng liên hệ với quản trị viên của bạn.",
    );
    navigate("/workspaces");
  };
  const isPending = isAccepting || isAcceptingLink;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader className="size-6 animate-spin text-[#10b981]" />
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
        <Card className="max-w-md w-full shadow-lg border-red-100">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-slate-800">
              Lời mời không hợp lệ
            </CardTitle>
            <CardDescription className="text-slate-500">
              Liên kết mời này đã hết hạn hoặc không tồn tại. Vui lòng kiểm tra
              lại.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button variant="outline" onClick={() => navigate("/workspaces")}>
              Quay lại trang chủ
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <Card className="max-w-md w-full shadow-xl border-none overflow-hidden bg-white">
        {/* Banner màu chủ đạo của Workspace */}
        <div
          className="h-3 w-full"
          style={{ backgroundColor: workspace.color || "#10b981" }}
        />

        <CardHeader className="text-center pt-8">
          <div
            className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-inner"
            style={{ backgroundColor: `${workspace.color || "#10b981"}20` }}
          >
            <Users
              className="size-8"
              style={{ color: workspace.color || "#10b981" }}
            />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900 leading-tight">
            Tham gia {workspace.name}
          </CardTitle>
          <CardDescription className="text-slate-500 mt-2">
            {workspace.description ||
              "Bạn đã được mời tham gia vào không gian làm việc này."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pb-8">
          {/* Thông tin thêm về Workspace */}
          <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center border border-slate-100">
            <div className="text-sm">
              <p className="text-slate-400 font-medium">Thành viên</p>
              <p className="text-slate-900 font-semibold">
                {workspace.members?.length || 0} người
              </p>
            </div>
            <div className="text-sm text-right">
              <p className="text-slate-400 font-medium">Dự án</p>
              <p className="text-slate-900 font-semibold">
                {workspace?.projects?.length || 0} dự án
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full h-11 text-white font-semibold transition-all hover:opacity-90 shadow-md"
              style={{ backgroundColor: "#10b981" }}
              onClick={handleAcceptInvite}
              disabled={isPending}
            >
              {isPending ? (
                <Loader className="mr-2 size-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-2 size-4" />
              )}
              Chấp nhận lời mời
            </Button>

            <Button
              variant="ghost"
              className="w-full text-slate-500 hover:text-slate-700"
              onClick={() => navigate("/workspaces")}
              disabled={isPending}
            >
              Để sau
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceInvite;
