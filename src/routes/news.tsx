import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { AppShell, Card, PriorityBadge, EmptyState, LoadingState, ErrorState } from "@/components/AppShell";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { newsList } from "@/lib/api/queries";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/news")({
  head: () => ({ meta: [{ title: "Comunicados — SunnyvaleConnect" }] }),
  component: () => (
    <ProtectedRoute>
      <NewsPage />
    </ProtectedRoute>
  ),
});

function NewsPage() {
  const { data, isPending, isError, refetch } = useQuery(newsList());

  return (
    <AppShell title="Comunicados" showBack showTabs={false}>
      <div className="p-5 space-y-3">
        {isPending ? (
          <LoadingState label="Carregando comunicados..." />
        ) : isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : data.length === 0 ? (
          <EmptyState title="Nenhum comunicado" hint="Você verá avisos do condomínio aqui." />
        ) : (
          data.map((n) => (
            <Link key={n.id} to="/news/$id" params={{ id: String(n.id) }}>
              <Card className="flex gap-3 items-start">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <PriorityBadge p={(n.priority_level ?? "low") as "low" | "medium" | "high"} />
                    <span className="text-[11px] text-muted-foreground">{formatDate(n.created_at)}</span>
                  </div>
                  <p className="font-medium text-sm line-clamp-2">{n.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">por {n.author}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground mt-1" />
              </Card>
            </Link>
          ))
        )}
      </div>
    </AppShell>
  );
}
