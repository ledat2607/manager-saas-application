import { userAuth } from "@/provider/auth-context";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { Skeleton } from "@/components/ui/skeleton";
import HeaderDashboard from "@/components/dashboard_component/header";

import Sidebar from "@/components/dashboard_component/sidebar";
import { Separator } from "@/components/ui/separator";
import CreateWorkspace from "@/components/dashboard_component/workspace/create-workspace";
import { getData } from "@/lib/fetch-utils";

export const clientLoader = async () => {
  try {
    // Chỉ cần lấy thẳng data từ API trả về
    const data = await getData("/workspaces");
    return data; // Trả về object { workspaces: [...] }
  } catch (error) {
    console.error(error);
    return { workspaces: [] };
  }
};

const DashboardLayout = () => {
  const [isCreatingWorkspace, setIsCreatingWorkspace] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const {
    user,
    logout,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = userAuth();
  const [isMinimumTimePassed, setIsMinimumTimePassed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinimumTimePassed(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const showLoading = isAuthLoading || !isMinimumTimePassed;

  if (showLoading) {
    return <DashboardSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to={"/sign-in"} />;
  }

  return (
    <div className="flex h-screen w-full gap-2">
      {/*Sidebar */}
      <div
        className={`hidden md:flex flex-col border-r bg-muted/10 p-4 space-y-6 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-17.5" : "w-64"
        }`}
      >
        {/* Truyền props xuống để Sidebar con biết đường mà ẩn text */}
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
      </div>
      <div className="flex flex-1 flex-col h-full px-4">
        {/*Header */}
        <HeaderDashboard
          onCreateWorkspace={() => setIsCreatingWorkspace(true)}
          user={user}
        />

        <main className="flex-1 overflow-y-auto h-full w-full">
          <div className="mx-auto px-2 lg:px-8 sm:px-6 py-0 md:py-8 w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>
      <CreateWorkspace
        isCreatingWorkspace={isCreatingWorkspace}
        setIsCreatingWorkspace={setIsCreatingWorkspace}
      />
    </div>
  );
};

export default DashboardLayout;

const DashboardSkeleton = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="hidden md:flex w-64 flex-col border-r bg-muted/10 p-2 space-y-4">
        <Skeleton className="h-10 w-32" /> {/* Logo */}
        <Separator />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
        <div className="mt-auto">
          <Skeleton className="h-12 w-full rounded-xl" /> {/* User Profile */}
        </div>
      </div>

      <div className="flex flex-1 flex-col h-full">
        {/* Header Skeleton */}
        <header className="h-16 border-b flex items-center justify-between px-6">
          <Skeleton className="h-6 w-32" /> {/* Breadcrumb */}
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </header>

        {/* Main Content Skeleton */}
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48" /> {/* Page Title */}
            <Skeleton className="h-10 w-24" /> {/* Action Button */}
          </div>

          {/* Grid Cards Simulation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>

          {/* Table Simulation */}
          <Skeleton className="h-100 w-full rounded-xl" />
        </main>
      </div>
    </div>
  );
};
