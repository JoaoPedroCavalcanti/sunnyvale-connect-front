import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/AppShell";
import { createServiceRequest, requestsKeys } from "@/lib/api/queries";

export const Route = createFileRoute("/service-requests/new")({
  component: NewRequest,
});

const categories = ["Manutenção", "Portaria", "Limpeza", "Outros"];
const priorities = [
  { value: "low", label: "Baixa" },
  { value: "medium", label: "Média" },
  { value: "high", label: "Alta" },
] as const;

function NewRequest() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: "",
    service_type: categories[0],
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    scheduled_date: "",
  });
  const [error, setError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () =>
      createServiceRequest({
        title: form.title,
        request_description: form.description,
        service_type: form.service_type,
        priority: form.priority,
        request_scheduled_date: form.scheduled_date
          ? new Date(form.scheduled_date).toISOString()
          : new Date().toISOString(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: requestsKeys.all });
      navigate({ to: "/service-requests" });
    },
    onError: () => setError("Não foi possível enviar. Confira os dados e tente de novo."),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    mutation.mutate();
  }

  return (
    <AppShell title="Nova solicitação" showBack showTabs={false}>
      <form onSubmit={submit} className="p-5 space-y-4">
        <Field label="Título">
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" placeholder="Resumo do problema" />
        </Field>
        <Field label="Categoria">
          <select value={form.service_type} onChange={(e) => setForm({ ...form, service_type: e.target.value })} className="input">
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Prioridade">
          <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as "low" | "medium" | "high" })} className="input">
            {priorities.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </Field>
        <Field label="Quando acontece (opcional)">
          <input type="datetime-local" value={form.scheduled_date} onChange={(e) => setForm({ ...form, scheduled_date: e.target.value })} className="input" />
        </Field>
        <Field label="Descrição">
          <textarea required rows={5} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input !h-auto py-3 resize-none" placeholder="Descreva com detalhes..." />
        </Field>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button disabled={mutation.isPending} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-70">
          {mutation.isPending ? "Enviando..." : "Enviar solicitação"}
        </button>
      </form>
      <style>{`.input{width:100%;height:2.75rem;padding:0 0.875rem;border-radius:0.75rem;border:1px solid var(--input);background:var(--card);outline:none}.input:focus{box-shadow:0 0 0 2px var(--ring)}`}</style>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block space-y-1.5"><span className="text-sm font-medium">{label}</span>{children}</label>;
}
