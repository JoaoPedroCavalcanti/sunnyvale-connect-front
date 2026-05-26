import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, CalendarCheck, Users, Wallet, Package, Wrench, ChevronRight } from "lucide-react";
import { AppShell, Card, PriorityBadge, LoadingState } from "@/components/AppShell";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  bbqList,
  hallList,
  newsList,
  paymentsList,
  visitorsList,
  type CondoPayment,
} from "@/lib/api/queries";
import { formatDate, formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Início — SunnyvaleConnect" }] }),
  component: () => (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  ),
});

const quickAccess = [
  { to: "/news", label: "Comunicados", icon: Megaphone, color: "text-primary bg-primary-soft" },
  { to: "/reservations", label: "Reservas", icon: CalendarCheck, color: "text-success bg-success/10" },
  { to: "/visitors", label: "Visitantes", icon: Users, color: "text-foreground bg-accent" },
  { to: "/payments", label: "Financeiro", icon: Wallet, color: "text-warning-foreground bg-warning/20" },
  { to: "/deliveries", label: "Entregas", icon: Package, color: "text-primary bg-primary-soft" },
  { to: "/service-requests", label: "Solicitações", icon: Wrench, color: "text-destructive bg-destructive/10" },
] as const;

function HomePage() {
  const { user } = useAuth();
  const news = useQuery(newsList());
  const bbq = useQuery(bbqList());
  const hall = useQuery(hallList());
  const payments = useQuery(paymentsList());
  const visitors = useQuery(visitorsList());

  const pendingPayments = (payments.data ?? []).filter((p) => p.status !== "paid");
  const upcomingReservations = [
    ...(bbq.data ?? []).map((r) => ({ ...r, type: "Churrasqueira" as const })),
    ...(hall.data ?? []).map((r) => ({ ...r, type: "Salão de festas" as const })),
  ]
    .filter((r) => r.reservation_date >= new Date().toISOString().slice(0, 10))
    .sort((a, b) => a.reservation_date.localeCompare(b.reservation_date));

  return (
    <AppShell showTabs>
      <div className="bg-gradient-to-b from-primary to-primary/80 text-primary-foreground pt-10 pb-8 px-5 rounded-b-3xl">
        <p className="text-sm opacity-80">Olá,</p>
        <h1 className="text-2xl font-bold">{user?.first_name} {user?.last_name}</h1>
      </div>

      <div className="px-5 -mt-5">
        <Card className="grid grid-cols-3 gap-3">
          {quickAccess.map(({ to, label, icon: Icon, color }) => (
            <Link key={to} to={to} className="flex flex-col items-center gap-1.5 py-1">
              <div className={`size-11 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="size-5" />
              </div>
              <span className="text-[11px] font-medium text-center">{label}</span>
            </Link>
          ))}
        </Card>
      </div>

      <Section title="Últimos comunicados" to="/news">
        {news.isPending ? <LoadingState /> : (news.data ?? []).slice(0, 2).map((n) => (
          <Link key={n.id} to="/news/$id" params={{ id: String(n.id) }}>
            <Card className="flex gap-3 items-start">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <PriorityBadge p={(n.priority_level ?? "low") as "low" | "medium" | "high"} />
                  <span className="text-[11px] text-muted-foreground">{formatDate(n.created_at)}</span>
                </div>
                <p className="font-medium text-sm line-clamp-2">{n.description}</p>
                <p className="text-xs text-muted-foreground mt-1">por {n.author}</p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground mt-1" />
            </Card>
          </Link>
        ))}
      </Section>

      <Section title="Próximas reservas" to="/reservations">
        {bbq.isPending || hall.isPending ? <LoadingState /> : upcomingReservations.length === 0 ? (
          <Card><p className="text-sm text-muted-foreground">Nenhuma reserva agendada.</p></Card>
        ) : upcomingReservations.slice(0, 2).map((r, i) => (
          <Card key={i} className="flex items-center gap-3">
            <div className="size-11 rounded-xl bg-success/10 text-success flex items-center justify-center">
              <CalendarCheck className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">{r.type}</p>
              <p className="text-xs text-muted-foreground">{formatDate(r.reservation_date)} • {r.guest_count ?? 0} convidados</p>
            </div>
          </Card>
        ))}
      </Section>

      <Section title="Pagamentos pendentes" to="/payments">
        {payments.isPending ? <LoadingState /> : pendingPayments.length === 0 ? (
          <Card><p className="text-sm text-muted-foreground">Tudo em dia!</p></Card>
        ) : pendingPayments.slice(0, 2).map((p) => {
          const pp = p as CondoPayment & { amount?: number | string; due_date?: string | null };
          return (
            <Link key={p.id} to="/payments/$id" params={{ id: String(p.id) }}>
              <Card className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-1">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Vence em {formatDate(pp.due_date ?? p.payment_date)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatCurrency(pp.amount ?? 0)}</p>
                </div>
              </Card>
            </Link>
          );
        })}
      </Section>

      <Section title="Visitantes agendados" to="/visitors">
        {visitors.isPending ? <LoadingState /> : (visitors.data ?? []).slice(0, 2).map((v) => (
          <Link key={v.id} to="/visitors/$id" params={{ id: String(v.id) }}>
            <Card className="flex items-center gap-3">
              <div className="size-11 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold">
                {v.visitor_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{v.visitor_name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(v.scheduled_date, true)}</p>
              </div>
            </Card>
          </Link>
        ))}
      </Section>
    </AppShell>
  );
}

function Section({ title, to, children }: { title: string; to: string; children: React.ReactNode }) {
  return (
    <section className="px-5 mt-6">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="font-semibold">{title}</h2>
        <Link to={to} className="text-xs font-medium text-primary">Ver tudo</Link>
      </div>
      <div className="space-y-2.5">{children}</div>
    </section>
  );
}
