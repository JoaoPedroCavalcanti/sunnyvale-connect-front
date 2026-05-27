import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { AppShell, Card, StatusBadge, EmptyState, LoadingState, ErrorState } from "@/components/AppShell";
import { visitorsList } from "@/lib/api/queries";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/visitors/")({
  head: () => ({ meta: [{ title: "Visitantes — SunnyvaleConnect" }] }),
  component: VisitorsPage,
});

function VisitorsPage() {
  const { data, isPending, isError, refetch } = useQuery(visitorsList());

  return (
    <AppShell title="Visitantes" showBack backTo="/home" showTabs
      rightSlot={
        <Link to="/visitors/new" className="p-2 rounded-full bg-primary text-primary-foreground" aria-label="Novo visitante">
          <Plus className="size-4" />
        </Link>
      }
    >
      <div className="px-5 pt-4 pb-2">
        <p className="text-sm text-muted-foreground">Autorize entradas com facilidade.</p>
      </div>
      <div className="px-5 pt-2 space-y-3">
        {isPending ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : data.length === 0 ? (
          <EmptyState title="Nenhum visitante" hint="Cadastre seu primeiro visitante." />
        ) : (
          data.map((v) => (
            <Link key={v.id} to="/visitors/$id" params={{ id: String(v.id) }}>
              <Card className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold">
                  {v.visitor_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{v.visitor_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{v.email ?? "—"}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{formatDate(v.scheduled_date, true)}</p>
                </div>
                <StatusBadge status={v.status} />
              </Card>
            </Link>
          ))
        )}
      </div>
    </AppShell>
  );
}
