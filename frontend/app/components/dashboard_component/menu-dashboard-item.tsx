import type { LucideIcon } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuDashboardItemProps {
  icon: LucideIcon;
  text: string;
  isActive: boolean;
  onClick?: () => void;
  isCollapsed?: boolean;
}

const MenuDashboardItem = ({
  icon: Icon,
  text,
  isActive,
  onClick,
  isCollapsed,
}: MenuDashboardItemProps) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative flex items-center gap-3 p-2.5 rounded-xl cursor-pointer 
        transition-all duration-300 group
        ${isCollapsed ? "justify-center" : "px-4"}
        ${!isActive && "hover:bg-white/10"} 
      `}
    >
      {/* Lớp nền Active với hiệu ứng Framer Motion */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="activeBackground"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-0 rounded-xl bg-linear-to-r from-blue-600 via-purple-500 to-pink-500 shadow-lg shadow-blue-500/20"
          />
        )}
      </AnimatePresence>

      {/* Icon và Nội dung - Cần để z-10 để nổi lên trên lớp nền active */}
      <div
        className={`relative z-10 flex items-center gap-3 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-100"}`}
      >
        <Icon
          className={`h-5 w-5 shrink-0 transition-transform duration-300 
          ${isActive ? "scale-110" : "group-hover:scale-110"}`}
        />

        {!isCollapsed && (
          <span className="font-semibold tracking-wide text-sm whitespace-nowrap">
            {text}
          </span>
        )}
      </div>

      {/* Hiệu ứng chấm nhỏ khi active bên cạnh (Chỉ hiện khi không collapsed) */}
      {isActive && !isCollapsed && (
        <motion.div
          layoutId="activeDot"
          className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
        />
      )}
    </div>
  );
};

export default MenuDashboardItem;
