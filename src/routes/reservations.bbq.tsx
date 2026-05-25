import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, CalendarCheck } from "lucide-react";
import { AppShell, Card, StatusBadge, EmptyState } from "@/components/AppShell";
import { bbqReservations, formatDate } from "@/lib/mocks";

export const Route = createFileRoute("/reservations/bbq")({
  component: BbqList,
});

function BbqList() {
  return (
    <AppShell title="Churrasqueira" showBack showTabs={false}
      rightSlot={
        <Link to="/reservations/bbq/new" className="p-2 rounded-full bg-primary text-primary-foreground" aria-label="Nova reserva">
          <Plus className="size-4" />
        </Link>
      }
    >
      <div className="p-5 space-y-3">
        {bbqReservations.length === 0 ? (
          <EmptyState title="Nenhuma reserva" hint="Toque em + para reservar a churrasqueira." />
        ) : (
          bbqReservations.map((r) => (
            <Card key={r.id} className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-warning/20 text-warning-foreground flex items-center justify-center">
                <CalendarCheck className="size-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{formatDate(r.reservation_date)}</p>
                <p className="text-xs text-muted-foreground">{r.guest_count} convidados</p>
              </div>
              <StatusBadge status={r.status} />
            </Card>
          ))
        )}
      </div>
    </AppShell>
  );
}
