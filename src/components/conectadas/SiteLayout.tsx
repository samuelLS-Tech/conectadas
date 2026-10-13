import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Marca } from "./Marca";

const links = [
  { label: "Início", to: "/" },
  { label: "Como funciona", to: "/como-funciona" },
  { label: "Conquistas", to: "/app/conquistas" },
  { label: "Oportunidades", to: "/empresa" },
  { label: "Sobre o projeto", to: "/sobre" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3.5 lg:flex lg:justify-between">
          <Marca />
          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
                activeProps={{ className: "text-foreground bg-accent/60" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="hidden rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-background shadow-[var(--shadow-neon)] transition-transform hover:scale-[1.03] sm:inline-flex"
            >
              Entrar na plataforma
            </Link>
            <button
              onClick={() => setAberto((v) => !v)}
              aria-label="Abrir menu"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border text-foreground lg:hidden"
            >
              {aberto ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
        {aberto && (
          <nav className="animate-rise border-t border-border/60 px-5 pb-4 lg:hidden">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setAberto(false)}
                className="block rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-accent/50 hover:text-foreground"
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/login"
              onClick={() => setAberto(false)}
              className="mt-2 block rounded-full bg-brand px-5 py-3 text-center text-sm font-semibold text-background"
            >
              Entrar na plataforma
            </Link>
          </nav>
        )}
      </header>

      <main>{children}</main>

      <footer className="mt-24 border-t border-border/60 bg-background/60">
        <div className="mx-auto max-w-7xl px-5 py-12">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="max-w-sm">
              <Marca />
              <p className="mt-3 text-sm text-muted-foreground">
                Conectando meninas. Compartilhando conhecimento. Criando futuros.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-sm">
              <div className="space-y-2">
                <p className="font-semibold text-foreground">Plataforma</p>
                {[
                  { l: "Dashboard", t: "/app/dashboard" },
                  { l: "Biblioteca STEM", t: "/app/biblioteca" },
                  { l: "Conquistas", t: "/app/conquistas" },
                  { l: "Portfólio", t: "/app/portfolio" },
                ].map((i) => (
                  <Link key={i.t} to={i.t} className="block text-muted-foreground hover:text-cyan">
                    {i.l}
                  </Link>
                ))}
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground">Projeto</p>
                {[
                  { l: "Como funciona", t: "/como-funciona" },
                  { l: "Sobre o projeto", t: "/sobre" },
                  { l: "Empresas", t: "/empresa" },
                  { l: "Painel da escola", t: "/professor" },
                ].map((i) => (
                  <Link key={i.t} to={i.t} className="block text-muted-foreground hover:text-cyan">
                    {i.l}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <p className="mt-10 border-t border-border/50 pt-6 text-xs text-muted-foreground">
            Protótipo demonstrativo com dados fictícios.
          </p>
        </div>
      </footer>
    </div>
  );
}
