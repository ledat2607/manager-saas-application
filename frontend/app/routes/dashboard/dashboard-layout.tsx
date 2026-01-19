import { userAuth } from "@/provider/auth-context";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = userAuth();
  console.log(user);
  return <div>hello</div>;
};

export default DashboardLayout;
