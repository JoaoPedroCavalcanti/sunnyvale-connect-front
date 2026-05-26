import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth/AuthProvider";
import { LoadingState } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  component: IndexRedirect,
});

function IndexRedirect() {
  const { status } = useAuth();
  if (status === "loading") return <LoadingState />;
  if (status === "authenticated") return <Navigate to="/home" />;
  return <Navigate to="/login" />;
}
