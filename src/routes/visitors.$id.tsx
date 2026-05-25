import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Mail, Calendar, Hash, Trash2 } from "lucide-react";
import { AppShell, Card, StatusBadge } from "@/components/AppShell";
import { visitors, formatDate } from "@/lib/mocks";

export const Route = createFileRoute("/visitors/$id")({
  component: VisitorDetail,
});

function VisitorDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const v = visitors.find((x) => x.id === Number(id));

  if (!v) return <AppShell title="Visitante" showBack showTabs={false}><div className="p-5"><Card>Não encontrado.</Card></div></AppShell>;

  return (
    <AppShell title="Visitante" showBack showTabs={false}>
      <div className="p-5 space-y-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="size-14 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-semibold text-xl">
              {v.visitor_name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-semibold">{v.visitor_name}</p>
              <StatusBadge status={v.status} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-3">{v.description}</p>
        </Card>

        <Card className="space-y-3">
          <Row icon={<Mail className="size-4" />} label="E-mail" value={v.email} />
          <Row icon={<Calendar className="size-4" />} label="Agendado para" value={formatDate(v.scheduled_date, true)} />
          <Row icon={<Calendar className="size-4" />} label="Check-in" value={v.checkin_date_time ? formatDate(v.checkin_date_time, true) : "—"} />
          <Row icon={<Calendar className="size-4" />} label="Checkout" value={v.checkout_date_time ? formatDate(v.checkout_date_time, true) : "—"} />
        </Card>

        <Card className="space-y-3">
          <Row icon={<Hash className="size-4" />} label="Código de check-in" value={v.checkin_code} mono />
          <Row icon={<Hash className="size-4" />} label="Código de checkout" value={v.checkout_code} mono />
          <div className="grid grid-cols-2 gap-2 pt-1">
            <a href={v.link_checkin} className="h-10 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center">Link check-in</a>
            <a href={v.link_checkout} className="h-10 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium flex items-center justify-center">Link checkout</a>
          </div>
        </Card>

        <button onClick={() => navigate({ to: "/visitors" })}
          className="w-full h-11 rounded-xl bg-destructive/10 text-destructive font-medium flex items-center justify-center gap-2">
          <Trash2 className="size-4" /> Excluir visitante
        </button>
      </div>
    </AppShell>
  );
}

function Row({ icon, label, value, mono }: { icon: React.ReactNode; label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-8 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className={`text-sm truncate ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
    </div>
  );
}
