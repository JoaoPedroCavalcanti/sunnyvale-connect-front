import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { AppShell, Card, StatusBadge, EmptyState } from "@/components/AppShell";
import { serviceRequests, formatDate } from "@/lib/mocks";

export const Route = createFileRoute("/service-requests")({
  head: () => ({ meta: [{ title: "Solicitações — SunnyvaleConnect" }] }),
  component: RequestsPage,
});

function RequestsPage() {
  return (
    <AppShell title="Solicitações" showBack showTabs={false}
      rightSlot={
        <Link to="/service-requests/new" className="p-2 rounded-full bg-primary text-primary-foreground" aria-label="Nova">
          <Plus className="size-4" />
        </Link>
      }
    >
      <div className="p-5 space-y-3">
        {/* Estrutura flexível — schema completo a definir. */}
        {serviceRequests.length === 0 ? (
          <EmptyState title="Nenhum chamado" hint="Toque em + para abrir um novo." />
        ) : (
          serviceRequests.map((r) => (
            <Link key={r.id} to="/service-requests/$id" params={{ id: String(r.id) }}>
              <Card>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-medium text-primary">{r.category}</span>
                  <StatusBadge status={r.status} />
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
