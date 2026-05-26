import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Pencil, Mail, AtSign, User as UserIcon } from "lucide-react";
import { AppShell, Card, LoadingState } from "@/components/AppShell";
import { useAuth } from "@/lib/auth/AuthProvider";

export const Route = createFileRoute("/profile/")({
  head: () => ({ meta: [{ title: "Perfil — SunnyvaleConnect" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  if (!user) return <AppShell showTabs><LoadingState /></AppShell>;

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  return (
    <AppShell showTabs>
      <div className="bg-gradient-to-b from-primary to-primary/80 text-primary-foreground pt-12 pb-10 px-5 rounded-b-3xl flex flex-col items-center">
        <div className="size-20 rounded-full bg-primary-foreground/20 backdrop-blur flex items-center justify-center text-3xl font-bold">
          {user.first_name.charAt(0)}{user.last_name.charAt(0)}
        </div>
        <h1 className="text-xl font-bold mt-3">{user.first_name} {user.last_name}</h1>
        <p className="text-sm opacity-80">@{user.username}</p>
      </div>

      <div className="px-5 -mt-4 space-y-3">
        <Card className="space-y-3">
          <Row icon={<Mail className="size-4" />} label="E-mail" value={user.email} />
          <Row icon={<AtSign className="size-4" />} label="Usuário" value={user.username} />
          <Row icon={<UserIcon className="size-4" />} label="ID" value={String(user.id)} />
        </Card>

        <Link to="/profile/edit"
          className="w-full h-12 rounded-xl bg-secondary text-secondary-foreground font-medium flex items-center justify-center gap-2">
          <Pencil className="size-4" /> Editar perfil
        </Link>

        <button onClick={handleLogout}
          className="w-full h-12 rounded-xl bg-destructive/10 text-destructive font-medium flex items-center justify-center gap-2">
          <LogOut className="size-4" /> Sair
        </button>
      </div>
    </AppShell>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-9 rounded-lg bg-muted text-muted-foreground flex items-center justify-center">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground">{label}</p>
        <p className="text-sm truncate">{value}</p>
      </div>
    </div>
  );
}
