import { createFileRoute } from "@tanstack/react-router";
import { ReservationForm } from "./reservations.bbq.new";

export const Route = createFileRoute("/reservations/hall/new")({
  component: () => <ReservationForm space="Salão de festas" backTo="/reservations/hall" />,
});
