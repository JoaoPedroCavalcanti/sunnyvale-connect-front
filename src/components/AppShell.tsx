import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, Home, CalendarCheck, Users, Wallet, User, Loader2, AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
  showTabs?: boolean;
  rightSlot?: ReactNode;
}

const tabs = [
  { to: "/home", label: "Início", icon: Home },
  { to: "/reservations", label: "Reservas", icon: CalendarCheck },
  { to: "/visitors", label: "Visitantes", icon: Users },
  { to: "/payments", label: "Financeiro", icon: Wallet },
  { to: "/profile", label: "Perfil", icon: User },
] as const;

export function AppShell({ children, title, showBack, showTabs = true, rightSlot }: AppShellProps) {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {(title || showBack) && (
        <header className="sticky top-0 z-20 bg-card/95 backdrop-blur border-b border-border">
          <div className="flex items-center gap-2 px-4 h-14">
            {showBack && (
              <button
                onClick={() => router.history.back()}
                className="-ml-2 p-2 rounded-full hover:bg-muted text-foreground"
                aria-label="Voltar"
              >
                <ArrowLeft className="size-5" />
              </button>
            )}
            <h1 className="text-base font-semibold flex-1 truncate">{title}</h1>
            {rightSlot}
          </div>
        </header>
      )}
      <main className={`flex-1 ${showTabs ? "pb-24" : "pb-6"}`}>{children}</main>
      {showTabs && (
        <nav className="fixed bottom-0 inset-x-0 z-30 bg-card border-t border-border">
          <ul className="grid grid-cols-5 max-w-md mx-auto">
            {tabs.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <Link
                  to={to}
                  activeProps={{ className: "text-primary" }}
                  inactiveProps={{ className: "text-muted-foreground" }}
                  className="flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium"
                >
                  <Icon className="size-5" />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}

export function PriorityBadge({ p }: { p: "low" | "medium" | "high" }) {
  const map = {
    high: "bg-destructive/10 text-destructive",
    medium: "bg-warning/15 text-warning-foreground",
    low: "bg-primary-soft text-primary",
  } as const;
  const label = { high: "Alta", medium: "Média", low: "Baixa" } as const;
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${map[p]}`}>{label[p]}</span>;
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    /pag|conclu|retir|finaliz|confirm|resolv/i.test(status)
      ? "bg-success/15 text-success"
      : /atras|cancel/i.test(status)
        ? "bg-destructive/10 text-destructive"
        : /andam|presen|aguard/i.test(status)
          ? "bg-warning/15 text-foreground"
          : "bg-primary-soft text-primary";
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${tone}`}>{status.replace(/_/g, " ")}</span>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-card rounded-2xl border border-border p-4 ${className}`}>{children}</div>;
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="text-center py-12 px-6">
      <div className="mx-auto size-14 rounded-full bg-primary-soft flex items-center justify-center mb-3">
        <span className="text-primary text-xl">∅</span>
      </div>
      <p className="font-medium">{title}</p>
      {hint && <p className="text-sm text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

export function LoadingState({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-2">
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-12 px-6">
      <div className="mx-auto size-14 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-3">
        <AlertCircle className="size-6" />
      </div>
      <p className="font-medium">Algo deu errado</p>
      <p className="text-sm text-muted-foreground mt-1">{message ?? "Tenta novamente em alguns segundos."}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center justify-center px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
