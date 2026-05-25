import { createFileRoute, Link } from "@tanstack/react-router";
import { Megaphone, CalendarCheck, Users, Wallet, Package, Wrench, ChevronRight } from "lucide-react";
import { AppShell, Card, PriorityBadge, StatusBadge } from "@/components/AppShell";
import { currentUser, news, bbqReservations, hallReservations, payments, visitors, formatDate, formatCurrency } from "@/lib/mocks";

export const Route = createFileRoute("/home")({
  head: () => ({ meta: [{ title: "Início — SunnyvaleConnect" }] }),
  component: HomePage,
});

const quickAccess = [
  { to: "/news", label: "Comunicados", desc: "Avisos importantes", icon: Megaphone, color: "text-primary bg-primary-soft" },
  { to: "/reservations", label: "Reservas", desc: "Churrasq. e salão", icon: CalendarCheck, color: "text-success bg-success/10" },
  { to: "/visitors", label: "Visitantes", desc: "Autorize entradas", icon: Users, color: "text-foreground bg-accent" },
  { to: "/payments", label: "Financeiro", desc: "Pagamentos e taxas", icon: Wallet, color: "text-warning-foreground bg-warning/20" },
  { to: "/deliveries", label: "Entregas", desc: "Encomendas recebidas", icon: Package, color: "text-primary bg-primary-soft" },
  { to: "/service-requests", label: "Solicitações", desc: "Abra chamados", icon: Wrench, color: "text-destructive bg-destructive/10" },
] as const;

function HomePage() {
  const pendingPayments = payments.filter((p) => p.status !== "pago");
  const upcomingReservations = [
    ...bbqReservations.map((r) => ({ ...r, type: "Churrasqueira" })),
    ...hallReservations.map((r) => ({ ...r, type: "Salão de festas" })),
  ].sort((a, b) => a.reservation_date.localeCompare(b.reservation_date));

  return (
    <AppShell showTabs>
      <div className="bg-gradient-to-b from-primary to-primary/80 text-primary-foreground pt-10 pb-8 px-5 rounded-b-3xl">
        <p className="text-sm opacity-80">Olá,</p>
        <h1 className="text-2xl font-bold">{currentUser.first_name} {currentUser.last_name}</h1>
        <p className="text-sm opacity-80 mt-0.5">{currentUser.unit}</p>
      </div>

      <div className="px-5 -mt-5">
        <Card className="grid grid-cols-3 gap-3">
          {quickAccess.slice(0, 6).map(({ to, label, icon: Icon, color }) => (
            <Link key={to} to={to} className="flex flex-col items-center gap-1.5 py-1">
              <div className={`size-11 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="size-5" />
              </div>
              <span className="text-[11px] font-medium text-center">{label}</span>
            </Link>
          ))}
        </Card>
      </div>

      <section className="px-5 mt-6">
        <SectionHeader title="Últimos comunicados" to="/news" />
        <div className="space-y-2.5">
          {news.slice(0, 2).map((n) => (
            <Link key={n.id} to="/news/$id" params={{ id: String(n.id) }}>
              <Card className="flex gap-3 items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <PriorityBadge p={n.priority_level} />
                    <span className="text-[11px] text-muted-foreground">{formatDate(n.created_at)}</span>
                  </div>
                  <p className="font-medium text-sm line-clamp-2">{n.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">por {n.author}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground mt-1" />
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="px-5 mt-6">
        <SectionHeader title="Próximas reservas" to="/reservations" />
        {upcomingReservations.length === 0 ? (
          <Card><p className="text-sm text-muted-foreground">Nenhuma reserva agendada.</p></Card>
        ) : (
          <div className="space-y-2.5">
            {upcomingReservations.slice(0, 2).map((r, i) => (
              <Card key={i} className="flex items-center gap-3">
                <div className="size-11 rounded-xl bg-success/10 text-success flex items-center justify-center">
                  <CalendarCheck className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{r.type}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(r.reservation_date)} • {r.guest_count} convidados</p>
                </div>
                <StatusBadge status={r.status} />
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="px-5 mt-6">
        <SectionHeader title="Pagamentos pendentes" to="/payments" />
        {pendingPayments.length === 0 ? (
          <Card><p className="text-sm text-muted-foreground">Tudo em dia!</p></Card>
        ) : (
          <div className="space-y-2.5">
            {pendingPayments.slice(0, 2).map((p) => (
              <Link key={p.id} to="/payments/$id" params={{ id: String(p.id) }}>
                <Card className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Vence em {formatDate(p.due_date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{formatCurrency(p.amount)}</p>
                    <StatusBadge status={p.status} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="px-5 mt-6">
        <SectionHeader title="Visitantes agendados" to="/visitors" />
        <div className="space-y-2.5">
          {visitors.slice(0, 2).map((v) => (
            <Link key={v.id} to="/visitors/$id" params={{ id: String(v.id) }}>
              <Card className="flex items-center gap-3">
                <div className="size-11 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold">
                  {v.visitor_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{v.visitor_name}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(v.scheduled_date, true)}</p>
                </div>
                <StatusBadge status={v.status} />
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}

function SectionHeader({ title, to }: { title: string; to: string }) {
  return (
    <div className="flex items-center justify-between mb-2.5">
      <h2 className="font-semibold">{title}</h2>
      <Link to={to} className="text-xs font-medium text-primary">Ver tudo</Link>
    </div>
  );
}
