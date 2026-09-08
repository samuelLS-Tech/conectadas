import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Star, Trophy } from "lucide-react";
import { materias, monitorasPorMateria } from "@/lib/conectadas-data";
import { useXP } from "@/lib/xp-store";

type Busca = { modo?: "ensinar" | "aprender" };

export const Route = createFileRoute("/app/ajuda")({
  validateSearch: (s: Record<string, unknown>): Busca => ({
    modo: s.modo === "ensinar" ? "ensinar" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Preciso de ajuda — CONECTADAS" },
      {
        name: "description",
        content: "Escolha a matéria e encontre monitoras disponíveis para uma sessão de estudo.",
      },
      { property: "og:title", content: "Preciso de ajuda — CONECTADAS" },
      { property: "og:description", content: "Monitorias por pares em Matemática, Física e mais." },
    ],
  }),
  component: Ajuda,
});

function Ajuda() {
  const { modo } = Route.useSearch();
  const ensinar = modo === "ensinar";
  const navigate = useNavigate();
  const { iniciarSessao } = useXP();
  const [materia, setMateria] = useState<string | null>("fisica");

  const monitoras = materia ? monitorasPorMateria[materia] : [];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="animate-rise">
        <p className="text-xs font-semibold tracking-[0.3em] text-cyan">
          {ensinar ? "QUERO ENSINAR" : "PRECISO DE AJUDA"}
        </p>
        <h1 className="mt-2 text-3xl font-bold">
          {ensinar
            ? "Qual matéria você quer ensinar?"
            : "Qual matéria você precisa estudar?"}
        </h1>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {materias.map((m, i) => (
          <button
            key={m.id}
            onClick={() => setMateria(m.id)}
            className={`glass glow-hover animate-rise p-6 text-center ${
              materia === m.id ? "border-primary/70 shadow-[var(--shadow-neon)]" : ""
            }`}
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <span className="text-3xl">{m.emoji}</span>
            <span className="mt-3 block text-sm font-semibold">{m.nome}</span>
          </button>
        ))}
      </div>

      {materia && (
        <section className="animate-rise space-y-4">
          <h2 className="text-xl font-bold">
            {ensinar ? "Estudantes buscando ajuda" : "Monitoras disponíveis"}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {monitoras.map((m, i) => (
              <article
                key={m.nome}
                className="glass glow-hover animate-rise flex flex-col p-6"
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[var(--gradient-brand)] font-display text-lg font-bold text-background">
                    {m.nome[0]}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-base font-bold">{m.nome}</p>
                    <p className="text-xs text-muted-foreground">{m.materia}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{m.bio}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1">
                    <Star size={12} className="text-mint" /> {m.nota.toFixed(1).replace(".", ",")}/5
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1">
                    <Trophy size={12} className="text-cyan" /> {m.xp.toLocaleString("pt-BR")} XP
                  </span>
                </div>
                <p
                  className={`mt-3 text-xs font-semibold ${
                    m.status === "Disponível agora" ? "text-mint" : "text-muted-foreground"
                  }`}
                >
                  {m.status === "Disponível agora" ? "🟢" : "🟡"} {m.status}
                </p>
                <button
                  onClick={() => {
                    iniciarSessao({ monitora: m.nome, materia: m.materia });
                    navigate({ to: "/app/monitoria" });
                  }}
                  className="mt-5 w-full rounded-full bg-[var(--gradient-brand)] px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-[1.03]"
                >
                  {ensinar ? "Oferecer monitoria" : "Convidar para monitoria"}
                </button>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
