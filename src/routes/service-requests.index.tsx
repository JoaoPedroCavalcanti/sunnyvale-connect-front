import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { AppShell, Card, StatusBadge, EmptyState, LoadingState, ErrorState } from "@/components/AppShell";
import { requestsList } from "@/lib/api/queries";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/service-requests/")({
  head: () => ({ meta: [{ title: "Solicitações — SunnyvaleConnect" }] }),
  component: RequestsPage,
});

const statusLabel: Record<string, string> = {
  requested: "aberto",
  accepted: "em andamento",
  declined: "cancelado",
};

function RequestsPage() {
  const { data, isPending, isError, refetch } = useQuery(requestsList());

  return (
    <AppShell title="Solicitações" showBack showTabs={false}
      rightSlot={
        <Link to="/service-requests/new" className="p-2 rounded-full bg-primary text-primary-foreground" aria-label="Nova">
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
          <EmptyState title="Nenhum chamado" hint="Toque em + para abrir um novo." />
        ) : (
          data.map((r) => (
            <Link key={r.id} to="/service-requests/$id" params={{ id: String(r.id) }}>
              <Card>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-primary">{r.service_type}</span>
                  <StatusBadge status={statusLabel[r.status] ?? r.status} />
                </div>
                <p className="font-medium text-sm">{r.title}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{formatDate(r.created_at)}</p>
              </Card>
            </Link>
          ))
        )}
      </div>
    </AppShell>
  );
}
