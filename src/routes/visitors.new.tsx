import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/visitors/new")({
  component: NewVisitor,
});

function NewVisitor() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", date: "", description: "" });
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/visitors" }), 600);
  }

  return (
    <AppShell title="Novo visitante" showBack showTabs={false}>
      <form onSubmit={submit} className="p-5 space-y-4">
        <Field label="Nome do visitante">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input" placeholder="Nome completo" />
        </Field>
        <Field label="E-mail">
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input" placeholder="visitante@email.com" />
        </Field>
        <Field label="Data e hora">
          <input type="datetime-local" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="input" />
        </Field>
        <Field label="Descrição / observação">
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3} className="input !h-auto py-3 resize-none" placeholder="Ex: jantar de família" />
        </Field>
        <button disabled={loading} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-70">
          {loading ? "Cadastrando..." : "Cadastrar visitante"}
        </button>
      </form>
      <style>{`.input{width:100%;height:2.75rem;padding:0 0.875rem;border-radius:0.75rem;border:1px solid var(--input);background:var(--card);outline:none}.input:focus{box-shadow:0 0 0 2px var(--ring)}`}</style>
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
