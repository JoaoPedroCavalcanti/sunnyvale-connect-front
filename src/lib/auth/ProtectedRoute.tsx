// Wrap any route component that requires an authenticated user. Shows a
// minimal splash while the auth state is being reconciled on first load,
// and redirects to /login if no valid session exists.

import { Navigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "./AuthProvider";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (status === "anonymous") {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
