import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { biblioteca, type Material } from "@/lib/conectadas-data";
import { useXP } from "@/lib/xp-store";
import { calcularXPAtividade, DESCONTO_POR_ERRO } from "@/lib/xp-regras";
import { ProgressoNeon } from "@/components/conectadas/ProgressoNeon";

export const Route = createFileRoute("/app/biblioteca")({
  head: () => ({
    meta: [
      { title: "Biblioteca STEM — CONECTADAS" },
      {
        name: "description",
        content:
          "Atividades de Matemática, Física, Química, Programação e Vestibulares que valem XP na plataforma.",
      },
      { property: "og:title", content: "Biblioteca STEM — CONECTADAS" },
      { property: "og:description", content: "Simulados e desafios que viram experiência." },
    ],
  }),
  component: Biblioteca,
});

const categorias = ["Todas", "Matemática", "Física", "Química", "Programação", "Vestibulares"];

function Biblioteca() {
  const { concluirAtividade, atividadesConcluidas } = useXP();
  const [categoria, setCategoria] = useState("Todas");
  const [ativo, setAtivo] = useState<Material | null>(null);
  const [indice, setIndice] = useState(0);
  const [acertos, setAcertos] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [fim, setFim] = useState(false);
  const [xpGanho, setXpGanho] = useState(0);

  const lista = biblioteca.filter((m) => categoria === "Todas" || m.categoria === categoria);

  function iniciar(m: Material) {
    setAtivo(m);
    setIndice(0);
    setAcertos(0);
    setEscolha(null);
    setFim(false);
  }

  function responder(i: number) {
    if (escolha !== null || !ativo) return;
    setEscolha(i);
    const certo = i === ativo.questoes[indice]!.correta;
    const novosAcertos = acertos + (certo ? 1 : 0);
    setAcertos(novosAcertos);
    setTimeout(() => {
      if (indice + 1 < ativo.questoes.length) {
        setIndice((n) => n + 1);
        setEscolha(null);
      } else {
        const ganho = calcularXPAtividade(ativo.xp, ativo.questoes.length, novosAcertos);
        setXpGanho(ganho);
        concluirAtividade(ativo.id, ganho);
        setFim(true);
      }
    }, 900);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="animate-rise">
        <h1 className="text-3xl font-bold">📚 Biblioteca STEM</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Atividades curtas e simulados. Cada conclusão adiciona XP ao seu perfil — cada erro desconta {DESCONTO_POR_ERRO} XP.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        {categorias.map((c) => (
          <button
            key={c}
            onClick={() => setCategoria(c)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              categoria === c
                ? "border-primary/60 bg-soft text-foreground"
                : "border-border text-muted-foreground hover:border-cyan/50 hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lista.map((m, i) => {
          const concluida = atividadesConcluidas.includes(m.id);
          return (
            <article
              key={m.id}
              className="glass glow-hover animate-rise flex flex-col p-6"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <span className="text-3xl">{m.emoji}</span>
              <h2 className="mt-4 text-lg font-bold">{m.titulo}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {m.questoes.length} questões{m.detalhe ? ` · ${m.detalhe}` : ""}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs">
                <span className="rounded-full border border-border px-2.5 py-1">{m.categoria}</span>
                <span className="rounded-full border border-mint/40 px-2.5 py-1 text-mint">
                  +{m.xp} XP
                </span>
              </div>
              <button
                onClick={() => iniciar(m)}
                className={`mt-5 w-full rounded-full px-5 py-2.5 text-sm font-semibold transition-transform hover:scale-[1.02] ${
                  concluida
                    ? "border border-mint/50 text-mint"
                    : "bg-brand text-background"
                }`}
              >
                {concluida ? "✅ Refazer atividade" : "Iniciar atividade"}
              </button>
            </article>
          );
        })}
      </div>

      {ativo && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/85 px-5 backdrop-blur-sm">
          <div className="glass animate-pop w-full max-w-lg p-8">
            {!fim ? (
              <>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{ativo.titulo}</span>
                  <span>
                    {indice + 1}/{ativo.questoes.length}
                  </span>
                </div>
                <div className="mt-3">
                  <ProgressoNeon
                    valor={((indice + (escolha !== null ? 1 : 0)) / ativo.questoes.length) * 100}
                    altura="h-2"
                  />
                </div>
                <h3 className="mt-6 text-lg font-bold">{ativo.questoes[indice]!.pergunta}</h3>
                <div className="mt-5 space-y-2">
                  {ativo.questoes[indice]!.alternativas.map((alt, i) => {
                    const correta = i === ativo.questoes[indice]!.correta;
                    const marcada = escolha === i;
                    const cor =
                      escolha === null
                        ? "border-border hover:border-cyan/60"
                        : correta
                          ? "border-mint/70 bg-mint/10 text-mint"
                          : marcada
                            ? "border-destructive/70 bg-destructive/10"
                            : "border-border opacity-60";
                    return (
                      <button
                        key={alt}
                        onClick={() => responder(i)}
                        className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition-colors ${cor}`}
                      >
                        {alt}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setAtivo(null)}
                  className="mt-6 w-full text-xs text-muted-foreground hover:text-foreground"
                >
                  Sair da atividade
                </button>
              </>
            ) : (
              <div className="text-center">
                <p className="text-5xl">🎉</p>
                <h3 className="mt-4 text-2xl font-bold text-mint">Atividade concluída!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {acertos} de {ativo.questoes.length} respostas corretas
                </p>
                <p className="mt-5 font-display text-3xl font-bold text-gradient">+{xpGanho} XP</p>
                {xpGanho < ativo.xp && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    {ativo.questoes.length - acertos} erro(s): −{ativo.xp - xpGanho} XP do total de {ativo.xp} XP. Revise e tente de novo!
                  </p>
                )}
                <button
                  onClick={() => setAtivo(null)}
                  className="mt-7 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-background"
                >
                  Voltar para a biblioteca
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
