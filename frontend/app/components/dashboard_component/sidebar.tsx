import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  Settings,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "../ui/separator";
import MenuDashboardItem from "./menu-dashboard-item";
import { useLocation, useNavigate } from "react-router";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation(); // Lấy thông tin URL hiện tại
  const navigate = useNavigate();

  // Danh sách menu để render tự động
  const menuItems = [
    { icon: LayoutDashboard, text: "Dashboard", path: "/dashboard" },
    { icon: Database, text: "Workspace", path: "/workspaces" },
    { icon: Users, text: "Teams", path: "/teams" },
    { icon: Settings, text: "Settings", path: "/settings" },
  ];

  return (
    <div className="flex flex-col h-full relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggle}
        className="absolute -right-7 top-2 h-6 w-6 rounded-full border bg-background shadow-md z-10"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </Button>

      <div
        className={`flex items-center gap-4 pb-6 ${isCollapsed ? "justify-center" : ""}`}
      >
        <img src="./logoTM.png" alt="Logo" className="w-8" />
        {!isCollapsed && <span className="font-bold">Task Manager</span>}
      </div>

      <Separator />

      <div className="flex flex-col space-y-2 pt-4">
        {menuItems.map((item) => (
          <MenuDashboardItem
            key={item.path}
            icon={item.icon}
            text={item.text}
            isCollapsed={isCollapsed}
            // Logic quan trọng: Active khi path khớp với URL hiện tại
            isActive={location.pathname === item.path}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
