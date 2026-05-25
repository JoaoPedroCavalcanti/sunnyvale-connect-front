import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { AppShell, Card, StatusBadge } from "@/components/AppShell";
import { payments, formatDate, formatCurrency } from "@/lib/mocks";

export const Route = createFileRoute("/payments/$id")({
  component: PaymentDetail,
});

function PaymentDetail() {
  const { id } = Route.useParams();
  const p = payments.find((x) => x.id === Number(id));
  if (!p) return <AppShell title="Pagamento" showBack showTabs={false}><div className="p-5"><Card>Não encontrado.</Card></div></AppShell>;

  return (
    <AppShell title="Pagamento" showBack showTabs={false}>
      <div className="p-5 space-y-3">
        <Card>
          <StatusBadge status={p.status} />
          <h2 className="font-semibold text-lg mt-2">{p.title}</h2>
          <p className="text-3xl font-bold mt-3">{formatCurrency(p.amount)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {p.status === "pago" ? `Pago em ${formatDate(p.payment_date)}` : `Vencimento ${formatDate(p.due_date)}`}
          </p>
        </Card>
        <Card>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Descrição</p>
          <p className="text-sm">{p.description}</p>
        </Card>
        {p.status !== "pago" && (
          <a href={p.payment_link}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2">
            Abrir link de pagamento <ExternalLink className="size-4" />
          </a>
        )}
      </div>
    </AppShell>
  );
}
