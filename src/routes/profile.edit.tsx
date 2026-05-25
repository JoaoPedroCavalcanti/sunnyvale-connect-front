import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { currentUser } from "@/lib/mocks";

export const Route = createFileRoute("/profile/edit")({
  component: EditProfile,
});

function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...currentUser });
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/profile" }), 600);
  }

  return (
    <AppShell title="Editar perfil" showBack showTabs={false}>
      <form onSubmit={submit} className="p-5 space-y-4">
        <Field label="Nome"><input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} className="input" /></Field>
        <Field label="Sobrenome"><input required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} className="input" /></Field>
        <Field label="Usuário"><input required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="input" /></Field>
        <Field label="E-mail"><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" /></Field>
        <button disabled={loading} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-70">
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>
      <style>{`.input{width:100%;height:2.75rem;padding:0 0.875rem;border-radius:0.75rem;border:1px solid var(--input);background:var(--card);outline:none}.input:focus{box-shadow:0 0 0 2px var(--ring)}`}</style>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-sm font-medium">{label}</span>{children}</label>;
}
