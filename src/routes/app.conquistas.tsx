import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { arvoreHabilidades, medalhas, type Medalha } from "@/lib/conectadas-data";

export const Route = createFileRoute("/app/conquistas")({
  head: () => ({
    meta: [
      { title: "Central de Conquistas — CONECTADAS" },
      {
        name: "description",
        content: "Árvore de habilidades STEM, medalhas desbloqueadas e critérios de cada conquista.",
      },
      { property: "og:title", content: "Central de Conquistas — CONECTADAS" },
      { property: "og:description", content: "Medalhas Ada Lovelace, Marie Curie, Rosalind Franklin, Katherine Johnson e Jaqueline Goes de Jesus." },
    ],
  }),
  component: Conquistas,
});

function Conquistas() {
  const [medalha, setMedalha] = useState<Medalha | null>(null);
  const mapa = Object.fromEntries(arvoreHabilidades.map((h) => [h.id, h]));

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header className="animate-rise">
        <h1 className="text-3xl font-bold">🏆 Central de Conquistas</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Cada nó desbloqueado representa uma trilha de conhecimento construída dentro da plataforma.
        </p>
      </header>

      <section className="glass relative overflow-hidden p-6">
        <h2 className="text-xl font-bold">Árvore de habilidades</h2>
        <div className="relative mt-6 h-[30rem] w-full">
          <div className="grid-lines absolute inset-0 rounded-2xl opacity-40" />
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {arvoreHabilidades.flatMap((h) =>
              h.liga.map((pai) => {
                const p = mapa[pai]!;
                const ativo = h.desbloqueada && p.desbloqueada;
                return (
                  <line
                    key={`${pai}-${h.id}`}
                    x1={p.x}
                    y1={p.y}
                    x2={h.x}
                    y2={h.y}
                    stroke={ativo ? "var(--mint)" : "var(--muted-foreground)"}
                    strokeOpacity={ativo ? 0.8 : 0.25}
                    strokeWidth={0.35}
                    strokeDasharray={ativo ? "0" : "1.5 1.5"}
                  />
                );
              }),
            )}
          </svg>
          {arvoreHabilidades.map((h, i) => (
            <div
              key={h.id}
              className="animate-pop absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: `${h.x}%`, top: `${h.y}%`, animationDelay: `${i * 70}ms` }}
            >
              <span
                className={`mx-auto grid h-11 w-11 place-items-center rounded-full border text-xs font-bold transition-transform hover:scale-110 ${
                  h.desbloqueada
                    ? "border-mint/70 bg-mint/15 text-mint shadow-[var(--shadow-cyan)]"
                    : "border-border bg-secondary/60 text-muted-foreground"
                }`}
              >
                {h.desbloqueada ? "✓" : "🔒"}
              </span>
              <span
                className={`mt-1.5 block text-[11px] font-semibold whitespace-nowrap ${
                  h.desbloqueada ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {h.nome}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-mint" /> Desbloqueado
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground" /> Bloqueado
          </span>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold">Minhas medalhas</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {medalhas.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setMedalha(m)}
              className={`glass glow-hover animate-rise p-6 text-center ${
                m.desbloqueada ? "border-mint/40" : "opacity-60"
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className={`text-4xl ${m.desbloqueada ? "" : "grayscale"}`}>{m.emoji}</span>
              <span className="mt-3 block text-sm font-bold">{m.nome}</span>
              <span
                className={`mt-1 block text-xs ${m.desbloqueada ? "text-mint" : "text-muted-foreground"}`}
              >
                {m.desbloqueada ? "desbloqueada" : "bloqueada"}
              </span>
            </button>
          ))}
        </div>
      </section>

      {medalha && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 px-5 backdrop-blur-sm"
          onClick={() => setMedalha(null)}
        >
          <div
            className="glass animate-pop w-full max-w-md p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className={`text-5xl ${medalha.desbloqueada ? "" : "grayscale"}`}>
              {medalha.emoji}
            </span>
            <h3 className="mt-4 text-xl font-bold">{medalha.nome}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{medalha.descricao}</p>
            <p className="mt-5 rounded-2xl border border-cyan/30 bg-cyan/5 p-4 text-left text-sm">
              <span className="block text-xs font-semibold tracking-widest text-cyan">
                COMO CONQUISTAR
              </span>
              <span className="mt-1 block text-muted-foreground">{medalha.criterio}</span>
            </p>
            <button
              onClick={() => setMedalha(null)}
              className="mt-6 rounded-full border border-border px-6 py-2.5 text-sm font-semibold hover:border-cyan/60 hover:text-cyan"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
