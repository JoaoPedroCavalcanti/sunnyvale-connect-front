import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { AppShell, Card, StatusBadge, LoadingState, ErrorState } from "@/components/AppShell";
import { paymentOne, type CondoPayment } from "@/lib/api/queries";
import { formatDate, formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/payments/$id")({
  component: PaymentDetail,
});

const statusLabel: Record<string, string> = {
  pending: "pendente",
  paid: "pago",
  overdue: "atrasado",
};

function PaymentDetail() {
  const { id } = Route.useParams();
  const { data: p, isPending, isError, refetch } = useQuery(paymentOne(id));

  if (isPending) return <AppShell title="Pagamento" showBack showTabs={false}><LoadingState /></AppShell>;
  if (isError) return <AppShell title="Pagamento" showBack showTabs={false}><ErrorState onRetry={() => refetch()} /></AppShell>;

  const pp = p as CondoPayment & { amount?: number | string; due_date?: string | null };

  return (
    <AppShell title="Pagamento" showBack showTabs={false}>
      <div className="p-5 space-y-3">
        <Card>
          <StatusBadge status={statusLabel[p.status] ?? p.status} />
          <h2 className="font-semibold text-lg mt-2">{p.title}</h2>
          <p className="text-3xl font-bold mt-3">{formatCurrency(pp.amount ?? 0)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {p.status === "paid"
              ? `Pago em ${formatDate(p.payment_date)}`
              : `Vencimento ${formatDate(pp.due_date ?? p.payment_date)}`}
          </p>
        </Card>
        {p.description && (
          <Card>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Descrição</p>
            <p className="text-sm">{p.description}</p>
          </Card>
        )}
        {p.status !== "paid" && p.payment_link && (
          <a
            href={p.payment_link}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2"
          >
            Abrir link de pagamento <ExternalLink className="size-4" />
          </a>
        )}
      </div>
    </AppShell>
  );
}
