import { createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { AppShell, Card, StatusBadge, EmptyState } from "@/components/AppShell";
import { deliveries, formatDate } from "@/lib/mocks";

export const Route = createFileRoute("/deliveries")({
  head: () => ({ meta: [{ title: "Entregas — SunnyvaleConnect" }] }),
  component: DeliveriesPage,
});

function DeliveriesPage() {
  return (
    <AppShell title="Entregas" showBack showTabs={false}>
      <div className="p-5 space-y-3">
        {/* Estrutura flexível — ajustar quando o schema do backend for definido. */}
        {deliveries.length === 0 ? (
          <EmptyState title="Nenhuma entrega" />
        ) : (
          deliveries.map((d) => (
            <Card key={d.id} className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center">
                <Package className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{d.carrier}</p>
                <p className="text-xs text-muted-foreground">{d.description}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{formatDate(d.date, true)}</p>
              </div>
              <StatusBadge status={d.status} />
            </Card>
          ))
        )}
      </div>
    </AppShell>
  );
}
