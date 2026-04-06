import type { LucideIcon } from "lucide-react";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils"; // Giả định bạn dùng shadcn helper

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
      className={cn(
        "relative flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all duration-300 group",
        isCollapsed ? "justify-center" : "px-4",
        // Hover state cho Light và Dark mode khi không active
        !isActive && "hover:bg-slate-200/50 dark:hover:bg-white/10",
      )}
    >
      {/* Lớp nền Active - Gradient xịn cho cả 2 mode */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="activeBackground"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "absolute inset-0 z-0 rounded-xl shadow-lg",
              // Gradient cho Light Mode: Sáng hơn một chút
              "bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 shadow-blue-500/30",
              // Gradient cho Dark Mode: Giữ nguyên hoặc đậm hơn tùy ý
              "dark:from-blue-600 dark:via-purple-600 dark:to-pink-600 dark:shadow-blue-900/40",
            )}
          />
        )}
      </AnimatePresence>

      {/* Nội dung chính */}
      <div
        className={cn(
          "relative z-10 flex items-center gap-3 transition-colors duration-300",
          // Màu chữ khi Active: Luôn trắng để nổi trên Gradient
          isActive
            ? "text-white"
            : "text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100",
        )}
      >
        <Icon
          className={cn(
            "h-5 w-5 shrink-0 transition-transform duration-300",
            (isActive || !isCollapsed) && "group-hover:scale-110",
            isActive && "scale-110",
          )}
        />

        {!isCollapsed && (
          <span className="font-semibold tracking-wide text-sm whitespace-nowrap">
            {text}
          </span>
        )}
      </div>

      {/* Chấm nhỏ Active */}
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
