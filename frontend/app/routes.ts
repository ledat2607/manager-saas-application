import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // ===== MAIN APP ROUTES (KHÔNG CÓ LAYOUT) =====
  index("routes/root/home.tsx"),

  //===Dashboard===
  layout("routes/dashboard/dashboard-layout.tsx", [
    route("dashboard", "routes/dashboard/index.tsx"),
    route("workspaces", "routes/dashboard/workspaces/index.tsx"),
    // route(
    //   "workspaces/:workspacesId",
    //   "routes/dashboard/workspaces/:workspacesId/index.tsx",
    // ),
  ]),

  // ===== AUTH LAYOUT =====
  layout("routes/auth/auth-layout.tsx", [
    route("sign-in", "routes/auth/sign-in.tsx"),
    route("sign-up", "routes/auth/sign-up.tsx"),
    route("forgot-password", "routes/auth/forgot-password.tsx"),
    route("verify-email", "routes/auth/verify-email.tsx"),
    route("reset-password", "routes/auth/reset-password.tsx"),
  ]),
] satisfies RouteConfig;
