import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Card, StatusBadge, EmptyState } from "@/components/AppShell";
import { payments, formatDate, formatCurrency } from "@/lib/mocks";

export const Route = createFileRoute("/payments")({
  head: () => ({ meta: [{ title: "Financeiro — SunnyvaleConnect" }] }),
  component: PaymentsPage,
});

function PaymentsPage() {
  const groups = [
    { key: "atrasado", title: "Atrasados", items: payments.filter((p) => p.status === "atrasado") },
    { key: "pendente", title: "Pendentes", items: payments.filter((p) => p.status === "pendente") },
    { key: "pago", title: "Pagos", items: payments.filter((p) => p.status === "pago") },
  ];

  const total = payments.filter((p) => p.status !== "pago").reduce((s, p) => s + p.amount, 0);

  return (
    <AppShell showTabs>
      <div className="bg-gradient-to-b from-primary to-primary/80 text-primary-foreground pt-10 pb-8 px-5 rounded-b-3xl">
        <p className="text-sm opacity-80">Financeiro</p>
        <h1 className="text-2xl font-bold">Total em aberto</h1>
        <p className="text-3xl font-bold mt-2">{formatCurrency(total)}</p>
      </div>

      <div className="px-5 -mt-3 space-y-6 pt-5">
        {groups.map((g) => g.items.length > 0 && (
          <section key={g.key}>
            <h2 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">{g.title}</h2>
            <div className="space-y-2.5">
              {g.items.map((p) => (
                <Link key={p.id} to="/payments/$id" params={{ id: String(p.id) }}>
                  <Card className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1">{p.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {p.status === "pago" ? `Pago em ${formatDate(p.payment_date)}` : `Vence em ${formatDate(p.due_date)}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">{formatCurrency(p.amount)}</p>
                      <StatusBadge status={p.status} />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
        {payments.length === 0 && <EmptyState title="Sem pagamentos" />}
      </div>
    </AppShell>
  );
}
