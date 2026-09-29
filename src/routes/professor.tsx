import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Marca } from "@/components/conectadas/Marca";
import { NeuralBackground } from "@/components/conectadas/NeuralBackground";
import { estudantesEscola } from "@/lib/conectadas-data";

export const Route = createFileRoute("/professor")({
  head: () => ({
    meta: [
      { title: "Painel da Escola — CONECTADAS" },
      {
        name: "description",
        content:
          "Indicadores da escola, lista de estudantes ativas e validação de atividades pelo professor.",
      },
      { property: "og:title", content: "Painel da Escola — CONECTADAS" },
      { property: "og:description", content: "Acompanhe monitorias, horas de estudo e projetos." },
    ],
  }),
  component: Professor,
});

const indicadores = [
  { emoji: "👩‍🎓", valor: "128", label: "estudantes ativas" },
  { emoji: "👩‍🏫", valor: "342", label: "monitorias" },
  { emoji: "⏱️", valor: "516", label: "horas de estudo" },
  { emoji: "🚀", valor: "47", label: "projetos" },
];

function Professor() {
  const [validadas, setValidadas] = useState<string[]>([]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 px-5 py-3.5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Marca to="/" />
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-mint/40 px-3 py-1.5 text-xs font-semibold text-mint sm:inline">
              PROFESSOR / ADMIN
            </span>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground">
              Sair
            </Link>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden px-5 py-10">
        <NeuralBackground className="opacity-40" />
        <div className="relative mx-auto max-w-6xl space-y-8">
          <h1 className="animate-rise text-3xl font-bold sm:text-4xl">🏫 Painel da Escola</h1>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {indicadores.map((i, idx) => (
              <div
                key={i.label}
                className="glass glow-hover animate-rise p-6"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <span className="text-2xl">{i.emoji}</span>
                <p className="mt-3 font-display text-3xl font-bold text-gradient">{i.valor}</p>
                <p className="text-xs text-muted-foreground">{i.label}</p>
              </div>
            ))}
          </div>

          <section className="glass p-7">
            <h2 className="text-xl font-bold">Atividades para validar</h2>
            <div className="mt-5 space-y-3">
              {estudantesEscola.map((e) => {
                const ok = validadas.includes(e.nome) || !e.pendente;
                return (
                  <div
                    key={e.nome}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-border/70 p-4 transition-colors hover:border-primary/50"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--gradient-brand)] font-bold text-background">
                        {e.nome[0]}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {e.nome} · <span className="text-muted-foreground">{e.turma}</span>
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{e.atividade}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="hidden text-sm text-mint sm:inline">
                        {e.xp.toLocaleString("pt-BR")} XP
                      </span>
                      {ok ? (
                        <span className="rounded-full border border-mint/50 px-4 py-2 text-xs font-semibold text-mint">
                          ✅ Validada
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setValidadas((v) => [...v, e.nome]);
                            toast.success(`Atividade de ${e.nome} validada`, {
                              description: "XP creditado no perfil da estudante.",
                            });
                          }}
                          className="rounded-full bg-[var(--gradient-brand)] px-4 py-2 text-xs font-semibold text-background transition-transform hover:scale-[1.04]"
                        >
                          Validar atividade
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
