import { createFileRoute } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { AppShell, Card } from "@/components/AppShell";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";

export const Route = createFileRoute("/deliveries")({
  head: () => ({ meta: [{ title: "Entregas — SunnyvaleConnect" }] }),
  component: () => (
    <ProtectedRoute>
      <DeliveriesPage />
    </ProtectedRoute>
  ),
});

// The current backend only exposes delivery notifications to admins
// (IsAdminUser everywhere). Until a "my deliveries" endpoint exists for the
// resident, we show a friendly placeholder instead of broken 403 calls.
function DeliveriesPage() {
  return (
    <AppShell title="Entregas" showBack showTabs={false}>
      <div className="p-5 space-y-3">
        <Card>
          <div className="flex items-start gap-3">
            <div className="size-12 rounded-xl bg-primary-soft text-primary flex items-center justify-center shrink-0">
              <Package className="size-6" />
            </div>
            <div>
              <p className="font-semibold">Em breve</p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                A gente está finalizando a integração de entregas com a portaria.
                Quando estiver pronto, você verá aqui as encomendas que chegaram
                pra sua unidade.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
