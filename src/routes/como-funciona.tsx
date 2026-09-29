import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/conectadas/SiteLayout";
import { NeuralBackground } from "@/components/conectadas/NeuralBackground";
import { comoFunciona } from "@/lib/conectadas-data";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "Como funciona — CONECTADAS" },
      {
        name: "description",
        content:
          "O ciclo CONECTADAS: aprender, ensinar, validar por QR Code, conquistar XP, construir portfólio e encontrar oportunidades.",
      },
      { property: "og:title", content: "Como funciona — CONECTADAS" },
      {
        property: "og:description",
        content: "Da monitoria entre colegas ao portfólio digital e às oportunidades reais.",
      },
    ],
  }),
  component: ComoFunciona,
});

function ComoFunciona() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden px-5 py-20">
        <NeuralBackground className="opacity-60" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-semibold tracking-[0.3em] text-cyan">O CICLO CONECTADAS</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold sm:text-5xl">
            Seis passos que transformam <span className="text-gradient">estudo em oportunidade</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Cada etapa alimenta a próxima. Quanto mais a estudante aprende e ensina, mais forte fica a
            trajetória registrada no seu portfólio digital.
          </p>

          <div className="relative mt-16">
            <div className="absolute top-0 bottom-0 left-6 w-px bg-linear-to-b from-magenta via-neon to-mint md:top-[3.25rem] md:right-0 md:bottom-auto md:left-0 md:h-px md:w-full md:bg-linear-to-r" />
            <ol className="grid gap-8 md:grid-cols-3 lg:grid-cols-6">
              {comoFunciona.map((p, i) => (
                <li
                  key={p.n}
                  className="animate-rise relative pl-16 md:pl-0"
                  style={{ animationDelay: `${i * 90}ms` }}
                >
                  <div className="absolute left-0 grid h-12 w-12 place-items-center rounded-full border border-primary/50 bg-background text-lg shadow-[var(--shadow-neon)] md:relative md:mb-6">
                    {p.emoji}
                  </div>
                  <p className="text-xs font-semibold tracking-widest text-mint">PASSO {p.n}</p>
                  <h3 className="mt-1 text-lg font-bold">{p.titulo}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{p.texto}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="glass mt-20 flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold">Quer ver o ciclo funcionando?</h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Entre na demonstração e percorra o fluxo completo: pedir ajuda, monitoria, validação por
                QR Code, XP, conquistas e portfólio.
              </p>
            </div>
            <Link
              to="/login"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-background shadow-[var(--shadow-neon)] transition-transform hover:scale-[1.03]"
            >
              🚀 Iniciar demonstração
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
