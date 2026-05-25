import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/service-requests/new")({
  component: NewRequest,
});

const categories = ["Manutenção", "Portaria", "Limpeza", "Outros"];

function NewRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", category: categories[0], description: "" });
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/service-requests" }), 600);
  }

  return (
    <AppShell title="Nova solicitação" showBack showTabs={false}>
      <form onSubmit={submit} className="p-5 space-y-4">
        <Field label="Título"><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" placeholder="Resumo do problema" /></Field>
        <Field label="Categoria">
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Descrição"><textarea required rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input !h-auto py-3 resize-none" placeholder="Descreva com detalhes..." /></Field>
        <button disabled={loading} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-70">
          {loading ? "Enviando..." : "Enviar solicitação"}
        </button>
      </form>
      <style>{`.input{width:100%;height:2.75rem;padding:0 0.875rem;border-radius:0.75rem;border:1px solid var(--input);background:var(--card);outline:none}.input:focus{box-shadow:0 0 0 2px var(--ring)}`}</style>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-sm font-medium">{label}</span>{children}</label>;
}
