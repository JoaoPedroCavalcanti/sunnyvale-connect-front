import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell, Card, PriorityBadge, LoadingState, ErrorState } from "@/components/AppShell";
import { newsOne } from "@/lib/api/queries";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/news/$id")({
  component: NewsDetail,
});

function NewsDetail() {
  const { id } = Route.useParams();
  const { data: item, isPending, isError, refetch } = useQuery(newsOne(Number(id)));

  return (
    <AppShell title="Comunicado" showBack backTo="/news" showTabs={false}>
      <div className="p-5">
        {isPending ? (
          <LoadingState />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : (
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <PriorityBadge p={(item.priority_level ?? "low") as "low" | "medium" | "high"} />
              <span className="text-xs text-muted-foreground">{formatDate(item.created_at, true)}</span>
            </div>
            <h2 className="font-semibold text-lg leading-snug">{item.description}</h2>
            <p className="text-xs text-muted-foreground mt-1">por {item.author}</p>
            <p className="text-[11px] text-muted-foreground mt-6">
              Atualizado em {formatDate(item.updated_at, true)}
            </p>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
