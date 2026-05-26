import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { ReservationForm } from "./reservations.bbq.new";

export const Route = createFileRoute("/reservations/hall/new")({
  component: () => (
    <ProtectedRoute>
      <ReservationForm space="Salão de festas" backTo="/reservations/hall" kind="hall" />
    </ProtectedRoute>
  ),
});
