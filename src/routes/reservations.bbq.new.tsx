import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { createBbqReservation, createHallReservation, bbqKeys, hallKeys } from "@/lib/api/queries";

export const Route = createFileRoute("/reservations/bbq/new")({
  component: () => (
    <ProtectedRoute>
      <ReservationForm space="Churrasqueira" backTo="/reservations/bbq" kind="bbq" />
    </ProtectedRoute>
  ),
});

export function ReservationForm({
  space,
  backTo,
  kind,
}: {
  space: string;
  backTo: "/reservations/bbq" | "/reservations/hall";
  kind: "bbq" | "hall";
}) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(10);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (input: { reservation_date: string; guest_count: number }) =>
      kind === "bbq" ? createBbqReservation(input) : createHallReservation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kind === "bbq" ? bbqKeys.all : hallKeys.all });
      navigate({ to: backTo });
    },
    onError: () => setError("Não foi possível confirmar. Verifique a data e tente de novo."),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    mutation.mutate({ reservation_date: date, guest_count: guests });
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
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button disabled={mutation.isPending}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-70">
          {mutation.isPending ? "Confirmando..." : "Confirmar reserva"}
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
