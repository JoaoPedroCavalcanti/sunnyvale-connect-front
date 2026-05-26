import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/reservations/hall")({
  component: () => <Outlet />,
});
