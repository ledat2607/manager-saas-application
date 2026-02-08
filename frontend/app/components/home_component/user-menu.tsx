import type { User } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  LayoutDashboard,
  LogOut,
  Settings,
  UserIcon,
  Circle,
} from "lucide-react";
import { useNavigate } from "react-router";
import { userAuth } from "@/provider/auth-context";
import { useTranslation } from "react-i18next"; // Đã sửa đường dẫn import
import { useEffect, useState } from "react";
import { useSocket } from "@/context/socket-context";

interface UserMenuProps {
  user: User | null;
}

const UserMenu = ({ user }: UserMenuProps) => {
  const navigate = useNavigate();
  const { logout } = userAuth();
  const { t } = useTranslation();

  // 1. Lấy dữ liệu socket
  const { onlineUsers, updateStatus } = useSocket();
  const currentStatus = (user?._id && onlineUsers[user._id]) || "offline";

  // 2. Logic tự động phát hiện trạng thái "Away"
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const resetTimer = () => {
      // Nếu đang là 'away' mà có tương tác thì chuyển lại 'online'
      if (currentStatus === "away") {
        updateStatus("online");
      }
      clearTimeout(idleTimer);
      // Sau 5 phút không hoạt động sẽ chuyển sang 'away'
      idleTimer = setTimeout(() => {
        updateStatus("away");
      }, 10 * 1000);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearTimeout(idleTimer);
    };
  }, [currentStatus, updateStatus]);

  const handleLogout = async () => {
    await logout();
    navigate("/sign-in");
  };

  // 3. Cấu hình màu sắc Badge
  const statusColors: Record<string, string> = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    busy: "bg-red-500",
    offline: "bg-gray-400",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full ring-2 ring-primary/10 hover:bg-transparent"
        >
          <div className="relative">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src={user?.profilePicture} alt={user?.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            {/* Dynamic Status Badge */}
            <span
              className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-background 
  ${statusColors[currentStatus]} 
  ${currentStatus === "online" ? "animate-pulse" : ""}`}
            />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3 px-1 py-1.5">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-semibold leading-none flex items-center gap-2">
                {user?.name}
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded-full bg-secondary text-secondary-foreground font-normal">
                  {currentStatus}
                </span>
              </p>
              <p className="text-xs leading-none text-muted-foreground italic">
                {user?.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Mục đổi trạng thái thủ công */}
        <div className="px-2 py-1.5">
          <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1 px-2">
            Trạng thái
          </p>
          <div className="flex gap-1">
            {["online", "busy", "away"].map((st) => (
              <Button
                key={st}
                variant="ghost"
                size="sm"
                className={`h-7 px-2 text-xs ${currentStatus === st ? "bg-secondary" : ""}`}
                onClick={() => updateStatus(st)}
              >
                <Circle
                  className={`mr-1 h-2 w-2 fill-current ${statusColors[st]}`}
                />
                {t(st)}
              </Button>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => navigate("/dashboard")}
          className="cursor-pointer"
        >
          <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{t("dashboard")}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/profile")}
          className="cursor-pointer"
        >
          <UserIcon className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{t("profile")}</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => navigate("/settings")}
          className="cursor-pointer"
        >
          <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
          <span>{t("settings")}</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t("logout")}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
