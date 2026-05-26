import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";

export const Route = createFileRoute("/profile")({
  component: ProfileLayout,
});

function ProfileLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}
