import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";

export const Route = createFileRoute("/visitors")({
  component: VisitorsLayout,
});

function VisitorsLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}
