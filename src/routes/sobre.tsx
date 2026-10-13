import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/conectadas/SiteLayout";
import { NeuralBackground } from "@/components/conectadas/NeuralBackground";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre o projeto — CONECTADAS" },
      {
        name: "description",
        content:
          "CONECTADAS é um projeto escolar: uma plataforma de monitorias entre meninas em STEM.",
      },
      { property: "og:title", content: "Sobre o projeto — CONECTADAS" },
      {
        property: "og:description",
        content: "Conhecimento, colaboração e oportunidade para meninas nas áreas STEM.",
      },
    ],
  }),
  component: Sobre,
});

const valores = [
  {
    emoji: "🧠",
    titulo: "Conhecimento",
    texto:
      "Uma biblioteca de atividades e monitorias por pares que respeita o ritmo de cada estudante.",
  },
  {
    emoji: "🤝",
    titulo: "Colaboração",
    texto: "Ensinar é aprender duas vezes. A rede cresce quando cada estudante ajuda outra.",
  },
  {
    emoji: "🚀",
    titulo: "Oportunidade",
    texto: "Dedicação registrada vira portfólio, e portfólio abre portas reais.",
  },
];

function Sobre() {
  return (
    <SiteLayout>
      <section className="relative overflow-hidden px-5 py-20">
        <NeuralBackground className="opacity-50" />
        <div className="relative mx-auto max-w-5xl">
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Sobre o <span className="text-gradient">CONECTADAS</span>
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
            O CONECTADAS é uma plataforma digital voltada para meninas do Ensino Médio e Técnico que
            desejam aprender, ensinar e desenvolver experiências nas áreas de Ciência, Tecnologia,
            Engenharia e Matemática. O projeto nasceu como resposta a três problemas: a subrepresentação
            feminina em STEM, a desigualdade de acesso a oportunidades e a barreira da experiência
            profissional exigida já na entrada.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {valores.map((v, i) => (
              <div
                key={v.titulo}
                className="glass glow-hover animate-rise p-6"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-3xl">{v.emoji}</span>
                <h2 className="mt-4 text-lg font-bold">{v.titulo}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{v.texto}</p>
              </div>
            ))}
          </div>

          <div className="glass mt-12 border-cyan/30 p-8">
            <h2 className="text-2xl font-bold">Metodologia</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              O projeto partiu de pesquisa sobre a subrepresentação feminina em STEM, análise de
              necessidades das estudantes e definição da proposta de uma plataforma que combina
              aprendizagem colaborativa, gamificação e portfólio digital. A validação dupla por QR Code
              ou token temporário garante que as monitorias registradas realmente aconteceram.
            </p>
            <p className="mt-4 rounded-2xl border border-mint/30 bg-mint/5 p-4 text-sm text-muted-foreground">
              <strong className="text-mint">Transparência:</strong> o XP é um indicador de participação e
              desenvolvimento dentro da plataforma. Ele não substitui avaliações profissionais ou
              acadêmicas.
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-background shadow-[var(--shadow-neon)]"
            >
              🚀 Entrar na plataforma
            </Link>
            <Link
              to="/como-funciona"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold hover:border-cyan/60 hover:text-cyan"
            >
              🔎 Ver como funciona
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
