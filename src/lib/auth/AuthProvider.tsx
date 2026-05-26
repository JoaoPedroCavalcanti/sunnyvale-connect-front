// Auth context. Loads the current user on mount if a token is present,
// exposes login/logout helpers, and wires the api client's "401 after
// refresh failure" handler into a logout + redirect to /login.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { setUnauthorizedHandler } from "@/lib/api/client";
import {
  fetchCurrentUser,
  login as apiLogin,
  logout as apiLogout,
  type User,
} from "@/lib/api/auth";
import { getAccessToken } from "@/lib/auth/storage";

type AuthState =
  | { status: "loading"; user: null }
  | { status: "authenticated"; user: User }
  | { status: "anonymous"; user: null };

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Start anonymous on the server (no token there) and reconcile on the client.
  const [state, setState] = useState<AuthState>(() =>
    typeof window === "undefined"
      ? { status: "anonymous", user: null }
      : { status: "loading", user: null },
  );

  const logout = useCallback(() => {
    apiLogout();
    queryClient.clear();
    setState({ status: "anonymous", user: null });
  }, [queryClient]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout();
      navigate({ to: "/login" });
    });
  }, [logout, navigate]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!getAccessToken()) {
      setState({ status: "anonymous", user: null });
      return;
    }
    let cancelled = false;
    fetchCurrentUser()
      .then((user) => {
        if (!cancelled) setState({ status: "authenticated", user });
      })
      .catch(() => {
        if (!cancelled) {
          apiLogout();
          setState({ status: "anonymous", user: null });
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const user = await apiLogin(username, password);
    setState({ status: "authenticated", user });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, login, logout }),
    [state, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
