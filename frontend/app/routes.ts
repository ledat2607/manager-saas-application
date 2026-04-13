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
    route(
      "workspaces/:workspacesId",
      "routes/dashboard/workspaces/workspace-detail.tsx",
    ),
    route(
      "workspaces/:workspacesId/projects/:projectId",
      "routes/dashboard/project/project-detail.tsx",
    ),
    route(
      "workspaces/:workspacesId/projects/:projectId/tasks/:taskId",
      "routes/dashboard/task/task-detail.tsx",
    ),
    route("my-tasks", "routes/dashboard/my-tasks.tsx"),
    route("my-teams", "routes/dashboard/my-teams.tsx"),
    route(
      "workspace-invite/:workspaceId",
      "routes/dashboard/workspace-invite.tsx",
    ),
  ]),

  // ===== AUTH LAYOUT =====
  layout("routes/auth/auth-layout.tsx", [
    route("sign-in", "routes/auth/sign-in.tsx"),
    route("sign-up", "routes/auth/sign-up.tsx"),
    route("forgot-password", "routes/auth/forgot-password.tsx"),
    route("verify-email", "routes/auth/verify-email.tsx"),
    route("reset-password", "routes/auth/reset-password.tsx"),
  ]),

  layout("routes/user/user-layout.tsx", [
    route("/profile", "routes/user/profile.tsx"),
  ]),
] satisfies RouteConfig;
