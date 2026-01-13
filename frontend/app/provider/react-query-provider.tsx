import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { AuthProvider } from "./auth-context";

export const queryClientConfig = new QueryClient();

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClientConfig}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
