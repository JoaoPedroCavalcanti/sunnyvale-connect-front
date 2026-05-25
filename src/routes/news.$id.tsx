import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card, PriorityBadge } from "@/components/AppShell";
import { news, formatDate } from "@/lib/mocks";

export const Route = createFileRoute("/news/$id")({
  component: NewsDetail,
});

function NewsDetail() {
  const { id } = Route.useParams();
  const item = news.find((n) => n.id === Number(id));

  return (
    <AppShell title="Comunicado" showBack showTabs={false}>
      <div className="p-5">
        {!item ? (
          <Card><p className="text-sm text-muted-foreground">Comunicado não encontrado.</p></Card>
        ) : (
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <PriorityBadge p={item.priority_level} />
              <span className="text-xs text-muted-foreground">{formatDate(item.created_at, true)}</span>
            </div>
            <h2 className="font-semibold text-lg leading-snug">{item.description}</h2>
            <p className="text-xs text-muted-foreground mt-1">por {item.author}</p>
            <div className="h-px bg-border my-4" />
            <p className="text-sm leading-relaxed text-foreground/90">{item.body}</p>
            <p className="text-[11px] text-muted-foreground mt-6">Atualizado em {formatDate(item.updated_at, true)}</p>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
