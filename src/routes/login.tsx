import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { LoginError } from "@/lib/api/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — SunnyvaleConnect" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { status, login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (status === "authenticated") {
    return <Navigate to="/home" />;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError("Preencha usuário e senha.");
      return;
    }
    setLoading(true);
    try {
      await login(username, password);
      navigate({ to: "/home" });
    } catch (err) {
      setError(err instanceof LoginError ? err.message : "Falha ao entrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-soft to-background px-6">
      <div className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto">
        <div className="flex flex-col items-center mb-10">
          <div className="size-16 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
            <Building2 className="size-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">SunnyvaleConnect</h1>
          <p className="text-sm text-muted-foreground mt-1">Seu condomínio na palma da mão</p>
        </div>

        <form onSubmit={submit} className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="username">Usuário</label>
            <input
              id="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="seu.usuario"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-70 active:scale-[0.99] transition"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : null}
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          v0.1 • conectado em {import.meta.env.VITE_API_URL ?? "http://localhost:8000"}
        </p>
      </div>
    </div>
  );
}
