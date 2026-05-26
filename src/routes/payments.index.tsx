import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell, Card, StatusBadge, EmptyState, LoadingState, ErrorState } from "@/components/AppShell";
import { paymentsList, type CondoPayment } from "@/lib/api/queries";
import { formatDate, formatCurrency } from "@/lib/format";

export const Route = createFileRoute("/payments/")({
  head: () => ({ meta: [{ title: "Financeiro — SunnyvaleConnect" }] }),
  component: PaymentsPage,
});

// Status comes from the back-end in English; we still want PT-BR labels in
// the UI without leaking the mapping into every screen.
const statusLabel: Record<string, string> = {
  pending: "pendente",
  paid: "pago",
  overdue: "atrasado",
};

function PaymentsPage() {
  const { data, isPending, isError, refetch } = useQuery(paymentsList());

  if (isPending) return <AppShell showTabs><LoadingState /></AppShell>;
  if (isError) return <AppShell showTabs><ErrorState onRetry={() => refetch()} /></AppShell>;

  const groups = [
    { key: "overdue", title: "Atrasados", items: data.filter((p) => p.status === "overdue") },
    { key: "pending", title: "Pendentes", items: data.filter((p) => p.status === "pending") },
    { key: "paid", title: "Pagos", items: data.filter((p) => p.status === "paid") },
  ];

  const total = data
    .filter((p) => p.status !== "paid")
    .reduce((s, p) => s + Number((p as CondoPayment & { amount?: number | string }).amount ?? 0), 0);

  return (
    <AppShell showTabs>
      <div className="bg-gradient-to-b from-primary to-primary/80 text-primary-foreground pt-10 pb-8 px-5 rounded-b-3xl">
        <p className="text-sm opacity-80">Financeiro</p>
        <h1 className="text-2xl font-bold">Total em aberto</h1>
        <p className="text-3xl font-bold mt-2">{formatCurrency(total)}</p>
      </div>

      <div className="px-5 -mt-3 space-y-6 pt-5">
        {data.length === 0 && <EmptyState title="Sem pagamentos" />}
        {groups.map((g) => g.items.length > 0 && (
          <section key={g.key}>
            <h2 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{g.title}</h2>
            <div className="space-y-2.5">
              {g.items.map((p) => {
                const pp = p as CondoPayment & { amount?: number | string; due_date?: string | null };
                return (
                  <Link key={p.id} to="/payments/$id" params={{ id: String(p.id) }}>
                    <Card className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{p.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {p.status === "paid"
                            ? `Pago em ${formatDate(p.payment_date)}`
                            : `Vence em ${formatDate(pp.due_date ?? p.payment_date)}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">{formatCurrency(pp.amount ?? 0)}</p>
                        <StatusBadge status={statusLabel[p.status] ?? p.status} />
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
