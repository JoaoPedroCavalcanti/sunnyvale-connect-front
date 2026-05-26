import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { AppShell, LoadingState } from "@/components/AppShell";
import { useAuth } from "@/lib/auth/AuthProvider";
import { updateCurrentUser } from "@/lib/api/auth";

export const Route = createFileRoute("/profile/edit")({
  component: EditProfile,
});

function EditProfile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  // The form bootstraps from the current user; if the user object is still
  // loading we hold off rendering to avoid uncontrolled-input warnings.
  if (!user) return <AppShell title="Editar perfil" showBack showTabs={false}><LoadingState /></AppShell>;

  return <EditForm initial={user} onDone={() => navigate({ to: "/profile" })} />;
}

function EditForm({
  initial,
  onDone,
}: {
  initial: { first_name: string; last_name: string; username: string; email: string };
  onDone: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => updateCurrentUser(form),
    onSuccess: onDone,
    onError: () => setError("Não foi possível salvar. Tente novamente."),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    mutation.mutate();
  }

  return (
    <AppShell title="Editar perfil" showBack showTabs={false}>
      <form onSubmit={submit} className="p-5 space-y-4">
        <Field label="Nome"><input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="input" /></Field>
        <Field label="Sobrenome"><input required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="input" /></Field>
        <Field label="Usuário"><input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="input" /></Field>
        <Field label="E-mail"><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" /></Field>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button disabled={mutation.isPending} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-70">
          {mutation.isPending ? "Salvando..." : "Salvar"}
        </button>
      </form>
      <style>{`.input{width:100%;height:2.75rem;padding:0 0.875rem;border-radius:0.75rem;border:1px solid var(--input);background:var(--card);outline:none}.input:focus{box-shadow:0 0 0 2px var(--ring)}`}</style>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-sm font-medium">{label}</span>{children}</label>;
}
