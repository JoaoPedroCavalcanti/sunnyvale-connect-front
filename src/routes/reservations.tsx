import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, PartyPopper, ChevronRight } from "lucide-react";
import { AppShell, Card } from "@/components/AppShell";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";

export const Route = createFileRoute("/reservations")({
  head: () => ({ meta: [{ title: "Reservas — SunnyvaleConnect" }] }),
  component: () => (
    <ProtectedRoute>
      <ReservationsPage />
    </ProtectedRoute>
  ),
});

const spaces = [
  {
    key: "bbq",
    name: "Churrasqueira",
    desc: "Espaço gourmet com churrasqueira a carvão, pia e mesa para 12 pessoas.",
    icon: Flame,
    color: "text-warning-foreground bg-warning/20",
    list: "/reservations/bbq",
    create: "/reservations/bbq/new",
  },
  {
    key: "hall",
    name: "Salão de festas",
    desc: "Salão climatizado com capacidade para 60 pessoas e cozinha de apoio.",
    icon: PartyPopper,
    color: "text-primary bg-primary-soft",
    list: "/reservations/hall",
    create: "/reservations/hall/new",
  },
] as const;

function ReservationsPage() {
  return (
    <AppShell showTabs>
      <div className="px-5 pt-8 pb-4">
        <h1 className="text-2xl font-bold">Reservas</h1>
        <p className="text-sm text-muted-foreground mt-1">Reserve os espaços do condomínio.</p>
      </div>
      <div className="px-5 space-y-3">
        {spaces.map((s) => (
          <Card key={s.key}>
            <div className="flex items-start gap-3">
              <div className={`size-12 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="size-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{s.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Link to={s.list} className="flex-1 h-10 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium flex items-center justify-center gap-1">
                Ver reservas <ChevronRight className="size-4" />
              </Link>
              <Link to={s.create} className="flex-1 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center">
                Nova reserva
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
