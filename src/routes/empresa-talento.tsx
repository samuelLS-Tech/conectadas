import { createFileRoute, Link } from "@tanstack/react-router";
import { Marca } from "@/components/conectadas/Marca";
import { ProgressoNeon } from "@/components/conectadas/ProgressoNeon";
import { medalhas, trajetoria } from "@/lib/conectadas-data";

export const Route = createFileRoute("/empresa-talento")({
  head: () => ({
    meta: [
      { title: "Perfil da estudante para empresas — CONECTADAS" },
      {
        name: "description",
        content:
          "Como uma empresa enxerga o perfil de uma estudante: indicadores, projetos, monitorias e medalhas.",
      },
      { property: "og:title", content: "Perfil da estudante — visão da empresa" },
      { property: "og:description", content: "Indicadores de potencial construídos na plataforma." },
    ],
  }),
  component: Talento,
});

const indicadores = [
  { emoji: "🧠", nome: "Conhecimento", valor: 82 },
  { emoji: "👩‍🏫", nome: "Liderança", valor: 70 },
  { emoji: "💻", nome: "Tecnologia", valor: 80 },
  { emoji: "🤝", nome: "Colaboração", valor: 90 },
];

function Talento() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 px-5 py-3.5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Marca to="/" usuario />
          <Link to="/empresa" className="text-sm text-muted-foreground hover:text-foreground">
            ← Voltar às oportunidades
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-5 py-10">
        <section className="glass animate-rise p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-brand font-display text-2xl font-bold text-background">
                A
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-bold">Ana Silva</h1>
                <p className="text-sm text-muted-foreground">Nível 5 — Pesquisadora Sênior</p>
              </div>
            </div>
            <span className="self-start shrink-0 whitespace-nowrap rounded-full border border-mint/40 bg-mint/10 px-5 py-2.5 font-display font-bold text-mint">
              2.450 XP
            </span>
          </div>
        </section>

        <section className="glass p-8">
          <h2 className="text-xl font-bold">Indicadores de desenvolvimento</h2>
          <div className="mt-6 space-y-5">
            {indicadores.map((ind, i) => (
              <div key={ind.nome} className="animate-rise" style={{ animationDelay: `${i * 90}ms` }}>
                <div className="mb-2 flex justify-between text-sm">
                  <span>
                    {ind.emoji} {ind.nome}
                  </span>
                  <span className="font-semibold text-cyan">{ind.valor}%</span>
                </div>
                <ProgressoNeon valor={ind.valor} altura="h-3" />
              </div>
            ))}
          </div>
          <p className="mt-7 rounded-2xl border border-cyan/30 bg-cyan/5 p-4 text-xs text-muted-foreground">
            O XP é um indicador de participação e desenvolvimento dentro do CONECTADAS. Ele não
            substitui avaliações profissionais ou acadêmicas.
          </p>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="glass p-7">
            <h2 className="text-lg font-bold">Atividades e monitorias</h2>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                ["👩‍🏫", "37 monitorias validadas por QR Code"],
                ["📚", "182 exercícios concluídos na Biblioteca STEM"],
                ["⏱️", "96 horas de estudo registradas"],
                ["⭐", "Avaliação média 4,9/5 das colegas"],
              ].map(([e, t]) => (
                <li key={t} className="flex items-start gap-3 text-muted-foreground">
                  <span>{e}</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="glass p-7">
            <h2 className="text-lg font-bold">Projetos</h2>
            <ul className="mt-4 space-y-4">
              {trajetoria.slice(0, 3).map((t) => (
                <li key={t.titulo}>
                  <p className="text-sm font-semibold">
                    {t.emoji} {t.titulo} — {t.ano}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.descricao}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="glass p-7">
          <h2 className="text-lg font-bold">Medalhas</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {medalhas.map((m) => (
              <span
                key={m.id}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm ${
                  m.desbloqueada
                    ? "border-mint/40 bg-mint/5"
                    : "border-border text-muted-foreground opacity-60"
                }`}
              >
                {m.emoji} {m.nome}
              </span>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
