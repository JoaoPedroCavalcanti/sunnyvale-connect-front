import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { AppShell, Card, StatusBadge, LoadingState, ErrorState } from "@/components/AppShell";
import { requestOne, requestsKeys, deleteServiceRequest } from "@/lib/api/queries";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/service-requests/$id")({
  component: RequestDetail,
});

const statusLabel: Record<string, string> = {
  requested: "aberto",
  accepted: "em andamento",
  declined: "cancelado",
};

function RequestDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: r, isPending, isError, refetch } = useQuery(requestOne(Number(id)));

  const deleteMutation = useMutation({
    mutationFn: () => deleteServiceRequest(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestsKeys.all });
      navigate({ to: "/service-requests" });
    },
  });

  if (isPending) return <AppShell title="Chamado" showBack showTabs={false}><LoadingState /></AppShell>;
  if (isError) return <AppShell title="Chamado" showBack showTabs={false}><ErrorState onRetry={() => refetch()} /></AppShell>;

  return (
    <AppShell title="Chamado" showBack showTabs={false}>
      <div className="p-5 space-y-3">
        <Card>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-primary">{r.service_type}</span>
            <StatusBadge status={statusLabel[r.status] ?? r.status} />
          </div>
          <h2 className="font-semibold text-lg">{r.title}</h2>
          <p className="text-xs text-muted-foreground mt-1">Aberto em {formatDate(r.created_at, true)}</p>
          {r.request_description && (
            <>
              <div className="h-px bg-border my-4" />
              <p className="text-sm leading-relaxed">{r.request_description}</p>
            </>
          )}
        </Card>
        <button
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          className="w-full h-11 rounded-xl bg-destructive/10 text-destructive font-medium flex items-center justify-center gap-2 disabled:opacity-70"
        >
          <Trash2 className="size-4" /> {deleteMutation.isPending ? "Cancelando..." : "Cancelar chamado"}
        </button>
      </div>
    </AppShell>
  );
}
