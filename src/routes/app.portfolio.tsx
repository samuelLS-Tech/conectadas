import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { trajetoria } from "@/lib/conectadas-data";
import { TRILHAS, useConquistas } from "@/lib/conquistas";
import { useXP } from "@/lib/xp-store";
import { gerarCurriculoPDF } from "@/lib/curriculo-pdf";

export const Route = createFileRoute("/app/portfolio")({
  head: () => ({
    meta: [
      { title: "Meu Portfólio — CONECTADAS" },
      {
        name: "description",
        content: "Portfólio digital com monitorias, projetos, medalhas e linha do tempo da estudante.",
      },
      { property: "og:title", content: "Meu Portfólio — CONECTADAS" },
      { property: "og:description", content: "Dedicação registrada vira experiência comprovável." },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  const { xp, monitorias, exercicios, horas, nivel, tituloNivel, lideranca, usuario, email, serie, turma } = useXP();
  const { medalhas, completa } = useConquistas();
  const medalhasGanhas = TRILHAS.filter((t) => medalhas.has(t.id) || completa(t.id));

  const stats = [
    { v: monitorias, l: "monitorias" },
    { v: exercicios, l: "exercícios" },
    { v: 14, l: "projetos" },
    { v: `${horas}h`, l: "horas" },
    { v: "4,9/5", l: "avaliação" },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="glass animate-rise p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <span className="grid h-20 w-20 shrink-0 place-items-center rounded-3xl bg-brand font-display text-3xl font-bold text-background shadow-[var(--shadow-neon)]">
            {(usuario || "E")[0]!.toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-[0.3em] text-cyan">💜 MEU PORTFÓLIO</p>
            <h1 className="mt-1 text-3xl font-bold">{usuario || "Estudante"}</h1>
            {serie && turma && <p className="text-sm text-cyan">{serie} · Turma {turma}</p>}
            <p className="text-sm text-muted-foreground">
              {tituloNivel} — Nível {nivel} · {xp.toLocaleString("pt-BR")} XP
            </p>
          </div>
        </div>
        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {stats.map((s) => (
            <div key={s.l} className="rounded-2xl border border-border/60 p-4 text-center">
              <p className="font-display text-xl font-bold text-gradient">{s.v}</p>
              <p className="text-xs text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>
      </header>

      <section className="glass p-8">
        <h2 className="text-xl font-bold">Minha trajetória</h2>
        <ol className="relative mt-6 space-y-6 border-l border-primary/40 pl-8">
          {trajetoria.map((t, i) => (
            <li key={t.titulo} className="animate-rise relative" style={{ animationDelay: `${i * 90}ms` }}>
              <span className="absolute -left-[2.85rem] grid h-9 w-9 place-items-center rounded-full border border-primary/50 bg-background text-base shadow-[var(--shadow-neon)]">
                {t.emoji}
              </span>
              <p className="text-xs font-semibold tracking-widest text-mint">{t.ano}</p>
              <h3 className="text-base font-bold">{t.titulo}</h3>
              <p className="text-sm text-muted-foreground">{t.descricao}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="glass p-8">
        <h2 className="text-xl font-bold">Medalhas conquistadas</h2>
        <div className="mt-5 flex flex-wrap gap-3">
          {medalhasGanhas.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma medalha ainda — complete uma trilha na Central de Conquistas.
            </p>
          )}
          {medalhasGanhas.map((t) => (
            <span
              key={t.id}
              className="inline-flex items-center gap-2 rounded-full border border-mint/40 bg-mint/5 px-4 py-2 text-sm"
            >
              {t.medalha.emoji} {t.medalha.nome}
            </span>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={() =>
{
            gerarCurriculoPDF({
              nome: usuario, email, serie, turma, nivel, xp, monitorias, exercicios, horas, lideranca,
              trajetoria,
              medalhas: medalhasGanhas.map((t) => t.medalha.nome),
            });
            toast.success("Currículo digital baixado!");
          }
          }
          className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-background shadow-[var(--shadow-neon)] transition-transform hover:scale-[1.03]"
        >
          📄 Gerar currículo digital
        </button>
        <p className="text-xs text-muted-foreground">
          O XP é um indicador de participação e desenvolvimento — não substitui avaliações
          profissionais ou acadêmicas.
        </p>
      </div>
    </div>
  );
}
