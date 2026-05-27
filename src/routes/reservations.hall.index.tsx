import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus, CalendarCheck } from "lucide-react";
import { AppShell, Card, EmptyState, LoadingState, ErrorState } from "@/components/AppShell";
import { hallList } from "@/lib/api/queries";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/reservations/hall/")({
  component: HallList,
});

function HallList() {
  const { data, isPending, isError, refetch } = useQuery(hallList());

  return (
    <AppShell title="Salão de festas" showBack backTo="/reservations" showTabs={false}
      rightSlot={
        <Link to="/reservations/hall/new" className="p-2 rounded-full bg-primary text-primary-foreground" aria-label="Nova reserva">
          <Plus className="size-4" />
        </Link>
      }
    >
      <div className="p-5 space-y-3">
        {isPending ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : data.length === 0 ? (
          <EmptyState title="Nenhuma reserva" hint="Toque em + para reservar o salão." />
        ) : (
          data.map((r) => (
            <Card key={r.id} className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                <CalendarCheck className="size-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{formatDate(r.reservation_date)}</p>
                <p className="text-xs text-muted-foreground">{r.guest_count ?? 0} convidados</p>
              </div>
            </Card>
          ))
        )}
      </div>
    </AppShell>
  );
}
