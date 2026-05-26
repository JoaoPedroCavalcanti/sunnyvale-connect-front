import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/reservations/bbq")({
  component: () => <Outlet />,
});
