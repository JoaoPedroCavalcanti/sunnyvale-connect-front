import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/reservations/bbq/new")({
  component: NewBbq,
});

function NewBbq() {
  return <ReservationForm space="Churrasqueira" backTo="/reservations/bbq" />;
}

export function ReservationForm({ space, backTo }: { space: string; backTo: string }) {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(10);
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: backTo }), 600);
  }

  return (
    <AppShell title={`Reservar ${space.toLowerCase()}`} showBack showTabs={false}>
      <form onSubmit={submit} className="p-5 space-y-4">
        <Field label="Data da reserva">
          <input type="date" required value={date} onChange={(e) => setDate(e.target.value)}
            className="w-full h-11 px-3.5 rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring" />
        </Field>
        <Field label="Quantidade de convidados">
          <input type="number" min={1} required value={guests} onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full h-11 px-3.5 rounded-xl border border-input bg-card focus:outline-none focus:ring-2 focus:ring-ring" />
        </Field>
        <button disabled={loading}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-70">
          {loading ? "Confirmando..." : "Confirmar reserva"}
        </button>
      </form>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
