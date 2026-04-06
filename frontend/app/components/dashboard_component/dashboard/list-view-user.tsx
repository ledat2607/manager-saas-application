import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FilterMembers } from "@/types";
import { CalendarDays, Mail } from "lucide-react";
import React from "react";

const ListViewuser = ({
  filterMembers,
}: {
  filterMembers: FilterMembers[];
}) => {
  return (
    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle className="text-xl font-semibold tracking-tight">
            Team Members
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage your workspace collaborators and roles.
          </p>
        </div>
        <Badge
          variant="secondary"
          className="rounded-full px-3 py-1 font-medium"
        >
          {filterMembers.length} Total
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col">
          {filterMembers.map((member) => (
            <div
              key={member.user._id}
              className="flex items-center justify-between p-4 transition-all hover:bg-accent/50 group border-t first:border-t-0"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-11 w-11 border-2 border-background shadow-sm">
                    <AvatarImage
                      src={member.user.profilePicture}
                      alt={member.user.name}
                    />
                    <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                      {member.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {/* Chấm tròn nhỏ thể hiện trạng thái (ví dụ owner) */}
                  {member.role === "owner" && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-emerald-500" />
                  )}
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-sm leading-none group-hover:text-primary transition-colors">
                    {member.user.name}
                  </span>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <Mail className="mr-1 h-3 w-3" />
                    {member.user.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Ngày tham gia - Dạng text tinh tế */}
                <div className="hidden md:flex flex-col items-end gap-1">
                  <div className="flex items-center text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                    <CalendarDays className="mr-1 h-3 w-3" />
                    Joined
                  </div>
                  <span className="text-xs font-medium">
                    {new Date(member.joinedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Badge Role - Custom Style */}
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize px-2.5 py-0.5 text-[11px] font-bold border-transparent shadow-none",
                    member.role === "owner"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
                  )}
                >
                  {member.role}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListViewuser;
