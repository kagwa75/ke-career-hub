import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";

import { AdminLayout } from "@/components/admin/admin-layout";

export const Route = createFileRoute("/admin")({
  component: AdminRoute,
});

function AdminRoute() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const bare = pathname === "/admin/login";

  return bare ? (
    <Outlet />
  ) : (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
