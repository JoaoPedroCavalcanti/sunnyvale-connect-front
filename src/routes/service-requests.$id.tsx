import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { AppShell, Card, StatusBadge } from "@/components/AppShell";
import { serviceRequests, formatDate } from "@/lib/mocks";

export const Route = createFileRoute("/service-requests/$id")({
  component: RequestDetail,
});

function RequestDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const r = serviceRequests.find((x) => x.id === Number(id));
  if (!r) return <AppShell title="Chamado" showBack showTabs={false}><div className="p-5"><Card>Não encontrado.</Card></div></AppShell>;

  return (
    <AppShell title="Chamado" showBack showTabs={false}>
      <div className="p-5 space-y-3">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-primary">{r.category}</span>
            <StatusBadge status={r.status} />
          </div>
          <h2 className="font-semibold text-lg">{r.title}</h2>
          <p className="text-xs text-muted-foreground mt-1">Aberto em {formatDate(r.created_at, true)}</p>
          <div className="h-px bg-border my-4" />
          <p className="text-sm leading-relaxed">{r.description}</p>
        </Card>
        <button onClick={() => navigate({ to: "/service-requests" })}
          className="w-full h-11 rounded-xl bg-destructive/10 text-destructive font-medium flex items-center justify-center gap-2">
          <Trash2 className="size-4" /> Cancelar chamado
        </button>
      </div>
    </AppShell>
  );
}
