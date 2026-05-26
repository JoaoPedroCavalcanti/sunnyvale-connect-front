import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";

export const Route = createFileRoute("/service-requests")({
  component: RequestsLayout,
});

function RequestsLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}
