import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { AppShell, Card, StatusBadge, EmptyState } from "@/components/AppShell";
import { visitors, formatDate } from "@/lib/mocks";

export const Route = createFileRoute("/visitors")({
  head: () => ({ meta: [{ title: "Visitantes — SunnyvaleConnect" }] }),
  component: VisitorsPage,
});

function VisitorsPage() {
  return (
    <AppShell showTabs>
      <div className="px-5 pt-8 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Visitantes</h1>
          <p className="text-sm text-muted-foreground mt-1">Autorize entradas com facilidade.</p>
        </div>
        <Link to="/visitors/new" className="size-11 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md shadow-primary/30" aria-label="Novo visitante">
          <Plus className="size-5" />
        </Link>
      </div>
      <div className="px-5 space-y-3">
        {visitors.length === 0 ? (
          <EmptyState title="Nenhum visitante" hint="Cadastre seu primeiro visitante." />
        ) : (
          visitors.map((v) => (
            <Link key={v.id} to="/visitors/$id" params={{ id: String(v.id) }}>
              <Card className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold">
                  {v.visitor_name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{v.visitor_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{v.email}</p>
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
