import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TRILHAS, useConquistas, type Trilha } from "@/lib/conquistas";

export const Route = createFileRoute("/app/conquistas")({
  head: () => ({
    meta: [
      { title: "Central de Conquistas — CONECTADAS" },
      {
        name: "description",
        content: "Trilhas de habilidades por disciplina e medalhas das cientistas desbloqueadas.",
      },
      { property: "og:title", content: "Central de Conquistas — CONECTADAS" },
      {
        property: "og:description",
        content: "Medalhas Ada Lovelace, Marie Curie, Rosalind Franklin, Katherine Johnson e Jaqueline Goes de Jesus.",
      },
    ],
  }),
  component: Conquistas,
});

function criterioNo(tipo: string, valor: string): string {
  if (tipo === "atividade") return `Concluir a atividade "${valor}" na Biblioteca STEM`;
  if (tipo === "monitoria") return `Dar uma monitoria de ${valor} validada por QR Code`;
  return `Receber ajuda em ${valor} com monitoria validada por QR Code`;
}

function Conquistas() {
  const { carregando, nos, desbloqueados, medalhas, completa } = useConquistas();
  const [trilha, setTrilha] = useState<Trilha | null>(null);

  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <header className="animate-rise">
        <h1 className="text-3xl font-bold">🏆 Central de Conquistas</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Complete 100% dos nós de cada trilha — na Biblioteca STEM e nas monitorias — para
          desbloquear a medalha da cientista correspondente.
        </p>
      </header>

      {carregando ? (
        <p className="text-sm text-muted-foreground">Carregando suas trilhas…</p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {TRILHAS.map((t, i) => {
            const daTrilha = nos.filter((n) => n.trilha === t.id);
            const feitos = daTrilha.filter((n) => desbloqueados.has(n.id)).length;
            const ganhou = medalhas.has(t.id) || completa(t.id);
            return (
              <button
                key={t.id}
                onClick={() => setTrilha(t)}
                className={`glass glow-hover animate-rise p-6 text-left ${
                  ganhou ? "border-mint/40" : ""
                }`}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-bold">
                    {t.emoji} {t.nome}
                  </span>
                  <span className={`text-3xl ${ganhou ? "" : "grayscale opacity-60"}`}>
                    {t.medalha.emoji}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{t.medalha.nome}</p>
                <p className={`mt-3 text-sm font-semibold ${ganhou ? "text-mint" : "text-muted-foreground"}`}>
                  {ganhou ? "Trilha concluída ✅" : `${feitos}/${daTrilha.length} nós desbloqueados`}
                </p>
                <div className="mt-4 space-y-2">
                  {daTrilha.map((n) => {
                    const feito = desbloqueados.has(n.id);
                    return (
                      <div key={n.id} className="flex items-center gap-2.5 text-sm">
                        <span
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] font-bold ${
                            feito
                              ? "border-mint/70 bg-mint/15 text-mint"
                              : "border-border bg-secondary/60 text-muted-foreground"
                          }`}
                        >
                          {feito ? "✓" : "🔒"}
                        </span>
                        <span className={feito ? "text-foreground" : "text-muted-foreground"}>
                          {n.nome}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </button>
            );
          })}
        </section>
      )}

      {trilha && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 px-5 backdrop-blur-sm"
          onClick={() => setTrilha(null)}
        >
          <div
            className="glass animate-pop w-full max-w-md p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className={`text-5xl ${
                medalhas.has(trilha.id) || completa(trilha.id) ? "" : "grayscale"
              }`}
            >
              {trilha.medalha.emoji}
            </span>
            <h3 className="mt-4 text-xl font-bold">{trilha.medalha.nome}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{trilha.medalha.descricao}</p>
            <div className="mt-5 space-y-3 rounded-2xl border border-cyan/30 bg-cyan/5 p-4 text-left">
              <span className="block text-xs font-semibold tracking-widest text-cyan">
                COMO CONQUISTAR — TRILHA DE {trilha.nome.toUpperCase()}
              </span>
              {nos
                .filter((n) => n.trilha === trilha.id)
                .map((n) => (
                  <span key={n.id} className="block text-sm text-muted-foreground">
                    {desbloqueados.has(n.id) ? "✅" : "🔒"} {n.nome}: {criterioNo(n.criterio_tipo, n.criterio_valor)}
                  </span>
                ))}
            </div>
            <button
              onClick={() => setTrilha(null)}
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
