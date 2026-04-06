import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import type { FilterMembers } from "@/types";
import {
  CalendarDays,
  Mail,
  MoreHorizontal,
  ShieldCheck,
  User,
} from "lucide-react";
import React from "react";
// Nếu cậu dùng dropdown để quản lý, import thêm:
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userAuth } from "@/provider/auth-context";

const BoardViewUser = ({
  filterMembers,
}: {
  filterMembers: FilterMembers[];
}) => {
  const { user } = userAuth();
  console.log(user);
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
      {filterMembers.map((member) => (
        <Card
          key={member.user._id}
          className="relative overflow-hidden group border-none shadow-sm hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm"
        >
          {/* Một dải màu nhỏ trên cùng tạo điểm nhấn */}
          <div
            className={cn(
              "absolute top-0 left-0 right-0 h-1.5",
              member.role === "owner" ? "bg-emerald-500" : "bg-blue-500",
            )}
          />

          <CardContent className="pt-8 pb-4 text-center">
            {/* Nút tác vụ nhanh (Dropdown) - Tạm thời ẩn để giao diện sạch */}
            <div
              className={cn(
                "absolute top-4 right-4",
                user?._id === member.user._id || member.role !== "owner"
                  ? "hidden"
                  : "block",
              )}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Change Role</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Remove
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Avatar & Indicator */}
            <div className="relative inline-flex mb-4">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage
                  src={member.user.profilePicture}
                  alt={member.user.name}
                />
                <AvatarFallback className="bg-linear-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-3xl font-bold">
                  {member.user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {member.role === "owner" && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-background shadow-md">
                  <ShieldCheck className="h-5 w-5" />
                </div>
              )}
              {member.role === "manager" && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-1.5 rounded-full border-4 border-background shadow-md">
                  <User className="h-5 w-5" />
                </div>
              )}
            </div>

            {/* Thông tin chính */}
            <div className="space-y-1.5">
              <h4 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1 px-2">
                {member.user.name}
              </h4>
              <p className="flex items-center justify-center text-xs text-muted-foreground px-4 truncate">
                <Mail className="mr-1.5 h-3 w-3 shrink-0" />
                {member.user.email}
              </p>
            </div>

            {/* Role Badge */}
            <div className="mt-5">
              <Badge
                variant="outline"
                className={cn(
                  "capitalize px-3 py-1 text-[11px] font-bold border-transparent shadow-none rounded-full",
                  member.role === "owner"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                    : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
                )}
              >
                {member.role}
              </Badge>
            </div>
          </CardContent>

          {/* Footer Card: Hiển thị ngày join tinh tế */}
          <CardFooter className="px-5 py-3 border-t bg-accent/20 backdrop-blur-sm justify-center">
            <div className="flex items-center text-[11px] font-medium text-muted-foreground">
              <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
              Joined
              <span className="text-foreground ml-1 font-semibold">
                {new Date(member.joinedAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BoardViewUser;
