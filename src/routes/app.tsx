import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { LayoutDashboard, LifeBuoy, Trophy, BookOpen, IdCard, LogOut } from "lucide-react";
import { Marca } from "@/components/conectadas/Marca";
import { useXP } from "@/lib/xp-store";
import { ProgressoNeon } from "@/components/conectadas/ProgressoNeon";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const itens = [
  { to: "/app/dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/app/ajuda", label: "Preciso de ajuda", Icon: LifeBuoy },
  { to: "/app/biblioteca", label: "Biblioteca STEM", Icon: BookOpen },
  { to: "/app/conquistas", label: "Conquistas", Icon: Trophy },
  { to: "/app/portfolio", label: "Meu Portfólio", Icon: IdCard },
] as const;

function AppLayout() {
  const { xp, proximoNivel, nivel } = useXP();

  return (
    <div className="min-h-screen lg:flex">
      <aside className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl lg:h-screen lg:w-72 lg:shrink-0 lg:border-r lg:border-b-0">
        <div className="flex flex-col gap-6 px-5 py-4 lg:h-full">
          <Marca to="/" />

          <div className="glass hidden p-4 lg:block">
            <p className="text-xs tracking-widest text-muted-foreground">NÍVEL {nivel}</p>
            <p className="font-display text-base font-bold text-foreground">Pesquisadora Sênior</p>
            <div className="mt-3">
              <ProgressoNeon valor={(xp / proximoNivel) * 100} altura="h-2" />
              <p className="mt-2 text-xs text-muted-foreground">
                {xp.toLocaleString("pt-BR")} / {proximoNivel.toLocaleString("pt-BR")} XP
              </p>
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {itens.map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent/60 hover:text-foreground"
                activeProps={{
                  className:
                    "bg-soft text-foreground border border-primary/40 shadow-[var(--shadow-neon)]",
                }}
              >
                <Icon size={17} className="shrink-0" />
                <span className="whitespace-nowrap">{label}</span>
              </Link>
            ))}
          </nav>

          <Link
            to="/"
            className="mt-auto hidden items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground lg:flex"
          >
            <LogOut size={17} /> Sair da demonstração
          </Link>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
}
