import { createFileRoute, Outlet } from "@tanstack/react-router";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";

export const Route = createFileRoute("/payments")({
  component: PaymentsLayout,
});

function PaymentsLayout() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  );
}
