import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Marca } from "@/components/conectadas/Marca";
import { NeuralBackground } from "@/components/conectadas/NeuralBackground";
import { RequerConta } from "@/components/conectadas/RequerConta";
import { useXP } from "@/lib/xp-store";
import { oportunidades, talentos } from "@/lib/conectadas-data";

export const Route = createFileRoute("/empresa")({
  head: () => ({
    meta: [
      { title: "Área de empresas — CONECTADAS" },
      {
        name: "description",
        content:
          "Encontre novos talentos: filtre estudantes por área STEM e XP e veja perfis construídos na plataforma.",
      },
      { property: "og:title", content: "Encontre novos talentos — CONECTADAS" },
      {
        property: "og:description",
        content: "Descubra estudantes pelo potencial e pelas experiências construídas.",
      },
    ],
  }),
  component: Empresa,
});

const areas = ["Todas", "Tecnologia", "Engenharia", "Ciência", "Matemática"];
const xps = [500, 1000, 1500, 2000];

function Empresa() {
  return (
    <RequerConta tipo="empresa">
      <EmpresaConteudo />
    </RequerConta>
  );
}

function EmpresaConteudo() {
  const navigate = useNavigate();
  const { sair } = useXP();
  const [area, setArea] = useState("Todas");
  const [xpMin, setXpMin] = useState(500);
  const [vaga, setVaga] = useState<string | null>(null);
  const [analisando, setAnalisando] = useState(false);

  useEffect(() => {
    if (!vaga) return;
    setAnalisando(true);
    const t = setTimeout(() => setAnalisando(false), 1600);
    return () => clearTimeout(t);
  }, [vaga]);

  const vagas = oportunidades.filter(
    (o) => (area === "Todas" || o.area === area) && o.xpMinimo >= xpMin,
  );
  const selecionada = oportunidades.find((o) => o.id === vaga);
  const compativeis = selecionada
    ? talentos
        .filter((t) => t.xp >= selecionada.xpMinimo)
        .sort(
          (a, b) =>
            Number(b.areas.includes(selecionada.area)) - Number(a.areas.includes(selecionada.area)) ||
            b.xp - a.xp,
        )
    : [];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 px-5 py-3.5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Marca to="/" usuario />
          <div className="flex items-center gap-2">
            <span className="hidden rounded-full border border-cyan/40 px-3 py-1.5 text-xs font-semibold text-cyan sm:inline">
              ÁREA DE EMPRESAS
            </span>
            <Link to="/login" onClick={() => void sair()} className="text-sm text-muted-foreground hover:text-foreground">
              Sair
            </Link>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden px-5 py-10">
        <NeuralBackground className="opacity-40" />
        <div className="relative mx-auto max-w-6xl space-y-8">
          <div className="animate-rise">
            <h1 className="text-3xl font-bold sm:text-4xl">🚀 Encontre novos talentos</h1>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Descubra estudantes pelo potencial, dedicação e experiências construídas dentro do
              CONECTADAS.
            </p>
          </div>

          <div className="glass grid gap-6 p-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-semibold tracking-widest text-muted-foreground">ÁREA</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {areas.map((a) => (
                  <button
                    key={a}
                    onClick={() => setArea(a)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      area === a
                        ? "border-primary/60 bg-soft"
                        : "border-border text-muted-foreground hover:border-cyan/50"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest text-muted-foreground">XP MÍNIMO</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {xps.map((x) => (
                  <button
                    key={x}
                    onClick={() => setXpMin(x)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      xpMin === x
                        ? "border-cyan/60 bg-cyan/10 text-cyan"
                        : "border-border text-muted-foreground hover:border-cyan/50"
                    }`}
                  >
                    {x.toLocaleString("pt-BR")}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-3">
            {vagas.map((o, i) => (
              <article
                key={o.id}
                className="glass glow-hover animate-rise flex flex-col p-6"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="text-3xl">{o.emoji}</span>
                <h2 className="mt-4 text-lg font-bold">{o.titulo}</h2>
                <p className="mt-1 text-xs text-muted-foreground">{o.empresa}</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  XP mínimo:{" "}
                  <strong className="text-mint">{o.xpMinimo.toLocaleString("pt-BR")}</strong>
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Habilidades: {o.habilidades.join(" + ")}
                </p>
                <button
                  onClick={() => setVaga(o.id)}
                  className="mt-5 w-full rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-background transition-transform hover:scale-[1.02]"
                >
                  Ver talentos compatíveis
                </button>
              </article>
            ))}
            {vagas.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhuma oportunidade com esses filtros. Ajuste a área ou o XP mínimo.
              </p>
            )}
          </section>

          {selecionada && (
            <section className="glass animate-rise min-w-0 p-5 sm:p-7">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                <h2 className="min-w-0 truncate text-xl font-bold">
                  Talentos compatíveis · {selecionada.titulo}
                </h2>
                <button
                  onClick={() => setVaga(null)}
                  className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
                >
                  Limpar
                </button>
              </div>
              {analisando ? (
                <div className="mt-6 flex flex-col items-center gap-3 py-8 text-center">
                  <span className="h-10 w-10 animate-spin rounded-full border-2 border-cyan/30 border-t-cyan" />
                  <p className="text-sm text-muted-foreground">
                    Analisando perfis com XP mínimo de {selecionada.xpMinimo.toLocaleString("pt-BR")}…
                  </p>
                </div>
              ) : (
                <>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {compativeis.length} estudante(s) com pelo menos{" "}
                    <strong className="text-mint">{selecionada.xpMinimo.toLocaleString("pt-BR")} XP</strong>.
                    Quem tem afinidade com {selecionada.area} aparece primeiro.
                  </p>
                  <div className="mt-5 grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
                    {compativeis.map((t, i) => {
                      const afinidade = t.areas.includes(selecionada.area);
                      return (
                        <button
                          key={t.nome}
                          onClick={() => navigate({ to: "/empresa-talento" })}
                          className="animate-rise block w-full min-w-0 overflow-hidden rounded-2xl border border-border/70 p-4 text-left transition-colors hover:border-primary/60"
                          style={{ animationDelay: `${i * 90}ms` }}
                        >
                          <span className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <span className="flex min-w-0 items-center gap-3">
                              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand font-bold text-background">
                                {t.nome[0]}
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold">{t.nome}</span>
                                <span className="block truncate text-xs text-muted-foreground">
                                  Nível {t.nivel} · {t.titulo} · {t.escola}
                                </span>
                              </span>
                            </span>
                            <span className="self-start shrink-0 whitespace-nowrap rounded-full sm:self-auto border border-mint/40 bg-mint/10 px-3 py-1 text-sm font-semibold text-mint">
                              {t.xp.toLocaleString("pt-BR")} XP
                            </span>
                          </span>
                          <span className="mt-3 flex flex-wrap gap-1.5">
                            {afinidade && (
                              <span className="rounded-full border border-cyan/50 bg-cyan/10 px-2.5 py-1 text-[11px] font-semibold text-cyan">
                                Afinidade com {selecionada.area}
                              </span>
                            )}
                            {t.destaques.map((d) => (
                              <span
                                key={d}
                                className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground"
                              >
                                {d}
                              </span>
                            ))}
                          </span>
                        </button>
                      );
                    })}
                    {compativeis.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Nenhuma estudante atinge o XP mínimo desta oportunidade ainda.
                      </p>
                    )}
                  </div>
                </>
              )}
            </section>
          )}

          <p className="rounded-2xl border border-cyan/30 bg-cyan/5 p-4 text-xs text-muted-foreground">
            O XP é um indicador de participação e desenvolvimento dentro da plataforma. Ele não
            substitui avaliações profissionais ou acadêmicas.
          </p>
        </div>
      </main>
    </div>
  );
}
