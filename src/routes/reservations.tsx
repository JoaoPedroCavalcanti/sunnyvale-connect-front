import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";

export const Route = createFileRoute("/reservations")({
  component: ReservationsLayout,
});

function ReservationsLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}
