import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — SunnyvaleConnect" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("morador");
  const [password, setPassword] = useState("••••••");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!username || !password) {
      setError("Preencha usuário e senha.");
      return;
    }
    setLoading(true);
    // Mock: replace with POST /api/token/ later
    setTimeout(() => {
      setLoading(false);
      navigate({ to: "/home" });
    }, 700);
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
            <label className="text-sm font-medium">Usuário</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="seu.usuario"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Senha</label>
            <input
              type="password"
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
          <button type="button" className="w-full text-sm text-primary font-medium pt-1">
            Esqueci minha senha
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Protótipo • dados simulados
        </p>
      </div>
    </div>
  );
}
