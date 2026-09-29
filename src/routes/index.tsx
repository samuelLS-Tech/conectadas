import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, GraduationCap, Rocket, Quote } from "lucide-react";
import { SiteLayout } from "@/components/conectadas/SiteLayout";
import { NeuralBackground } from "@/components/conectadas/NeuralBackground";
import { comoFunciona } from "@/lib/conectadas-data";
import heroImg from "@/assets/hero-conectadas.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CONECTADAS — Conhecimento, colaboração e oportunidade em STEM" },
      {
        name: "description",
        content:
          "Plataforma que transforma aprendizagem e monitorias entre meninas em XP, medalhas, portfólio digital e oportunidades reais em STEM.",
      },
      { property: "og:title", content: "CONECTADAS — Plataforma STEM para meninas" },
      {
        property: "og:description",
        content: "Conectando meninas. Compartilhando conhecimento. Criando futuros.",
      },
    ],
  }),
  component: Home,
});

const estatisticas = [
  { valor: "+500", label: "estudantes" },
  { valor: "+2.000", label: "monitorias" },
  { valor: "+10.000", label: "atividades" },
  { valor: "100%", label: "focado em potencial" },
];

const problemas = [
  {
    titulo: "Subrepresentação",
    texto:
      "Meninas ainda enfrentam barreiras para ingressar e permanecer em áreas de Ciência, Tecnologia, Engenharia e Matemática.",
    emoji: "📉",
  },
  {
    titulo: "Desigualdade de oportunidades",
    texto:
      "Estudantes de diferentes contextos não possuem necessariamente acesso às mesmas experiências, redes de apoio e oportunidades.",
    emoji: "⚖️",
  },
  {
    titulo: "A barreira da experiência",
    texto:
      "Muitas empresas exigem experiência profissional até mesmo para oportunidades de entrada, criando um ciclo difícil de quebrar.",
    emoji: "🔒",
  },
];

const pilares = [
  {
    Icon: Brain,
    emoji: "🧠",
    titulo: "APRENDER",
    texto:
      "Encontre colegas que podem ajudar em Matemática, Física, Química, Programação e outras áreas STEM.",
    cor: "var(--neon)",
  },
  {
    Icon: GraduationCap,
    emoji: "👩‍🏫",
    titulo: "ENSINAR",
    texto: "Compartilhe seu conhecimento ajudando outras estudantes através de monitorias por pares.",
    cor: "var(--cyan)",
  },
  {
    Icon: Rocket,
    emoji: "🚀",
    titulo: "CONECTAR",
    texto:
      "Transforme sua dedicação em um portfólio digital e encontre oportunidades acadêmicas e profissionais.",
    cor: "var(--mint)",
  },
];

const fluxo = ["Aprender", "Ensinar", "XP", "Portfólio", "Oportunidade"];

function Home() {
  return (
    <SiteLayout>
      {/* HERO */}
      <section className="relative overflow-hidden px-5 pt-16 pb-24">
        <NeuralBackground />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan/40 bg-cyan/5 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-cyan">
              FECEG — CIÊNCIA DELAS
            </span>
            <h1 className="mt-6 text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl">
              Conectando meninas.{" "}
              <span className="text-gradient">Compartilhando conhecimento.</span> Criando futuros.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Uma plataforma que transforma aprendizagem, colaboração e dedicação em experiências,
              conquistas e oportunidades nas áreas de STEM.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/login"
                className="rounded-full bg-brand px-7 py-3.5 text-sm font-semibold text-background shadow-[var(--shadow-neon)] transition-transform hover:scale-[1.03]"
              >
                🚀 Entrar na plataforma
              </Link>
              <Link
                to="/como-funciona"
                className="rounded-full border border-border px-7 py-3.5 text-sm font-semibold transition-colors hover:border-cyan/60 hover:text-cyan"
              >
                🔎 Conhecer o projeto
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {estatisticas.map((e, i) => (
                <div
                  key={e.label}
                  className="glass animate-rise p-4"
                  style={{ animationDelay: `${200 + i * 90}ms` }}
                >
                  <dt className="font-display text-2xl font-bold text-gradient">{e.valor}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground">{e.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="animate-float relative mx-auto w-full max-w-md">
            <div className="absolute -inset-6 rounded-[3rem] bg-soft blur-3xl" />
            <img
              src={heroImg}
              alt="Estudante conectada a elementos de STEM: código, moléculas, fórmulas, circuitos e constelações"
              width={1024}
              height={1024}
              className="relative rounded-[2rem] border border-primary/30 shadow-[var(--shadow-neon)]"
            />
            <div className="glass absolute -bottom-6 -left-4 hidden p-4 sm:block">
              <p className="text-xs text-muted-foreground">Nível 5 · Pesquisadora Sênior</p>
              <p className="font-display text-lg font-bold text-mint">2.450 XP</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Por que o <span className="text-gradient">CONECTADAS</span> existe?
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {problemas.map((p, i) => (
              <article
                key={p.titulo}
                className="glass glow-hover animate-rise p-7"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-3xl">{p.emoji}</span>
                <h3 className="mt-4 text-xl font-bold">{p.titulo}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{p.texto}</p>
              </article>
            ))}
          </div>

          <div className="glass mt-8 flex flex-col gap-4 border-magenta/30 p-7 md:flex-row">
            <Quote className="shrink-0 text-magenta" size={28} />
            <div>
              <h3 className="text-lg font-bold text-magenta">O Efeito Matilda</h3>
              <p className="mt-2 max-w-4xl text-sm text-muted-foreground">
                O Efeito Matilda descreve o apagamento e a subvalorização histórica das contribuições de
                mulheres na ciência — descobertas atribuídas a colegas homens, nomes ausentes de artigos
                e prêmios. Reconhecer esse padrão é o primeiro passo para quebrá-lo: o CONECTADAS
                registra e dá visibilidade a cada conquista das estudantes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUÇÃO */}
      <section className="relative overflow-hidden px-5 py-20">
        <NeuralBackground className="opacity-40" />
        <div className="relative mx-auto max-w-7xl">
          <p className="text-xs font-semibold tracking-[0.3em] text-cyan">NOSSA SOLUÇÃO</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Transformamos conhecimento em <span className="text-gradient">oportunidade</span>.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {pilares.map((p, i) => (
              <article
                key={p.titulo}
                className="glass glow-hover animate-rise p-7"
                style={{ animationDelay: `${i * 110}ms` }}
              >
                <div
                  className="grid h-12 w-12 place-items-center rounded-2xl"
                  style={{ background: `color-mix(in oklab, ${p.cor} 20%, transparent)` }}
                >
                  <p.Icon size={22} style={{ color: p.cor }} />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold tracking-widest">
                  {p.emoji} {p.titulo}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground">{p.texto}</p>
              </article>
            ))}
          </div>

          {/* fluxo animado */}
          <div className="glass mt-10 overflow-x-auto p-7">
            <div className="flex min-w-max items-center gap-3">
              {fluxo.map((f, i) => (
                <div key={f} className="flex items-center gap-3">
                  <div
                    className="animate-rise rounded-full border border-primary/40 bg-soft px-5 py-2.5 text-sm font-semibold"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    {f}
                  </div>
                  {i < fluxo.length - 1 && (
                    <ArrowRight size={18} className="animate-pulse-glow text-cyan" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA (resumo) */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold sm:text-4xl">Como funciona</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comoFunciona.map((p, i) => (
              <div
                key={p.n}
                className="glass glow-hover animate-rise flex gap-4 p-6"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-cyan/40 text-lg">
                  {p.emoji}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold tracking-widest text-mint">PASSO {p.n}</p>
                  <h3 className="text-base font-bold">{p.titulo}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{p.texto}</p>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/como-funciona"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-cyan hover:gap-3"
          >
            Ver o ciclo completo <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* FINAL */}
      <section className="relative overflow-hidden px-5 py-24">
        <NeuralBackground />
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold sm:text-5xl">
            E se a próxima <span className="text-gradient">grande cientista</span> estiver na sua
            escola?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            O CONECTADAS transforma conhecimento em experiência, experiência em portfólio e portfólio em
            oportunidade.
          </p>
          <Link
            to="/login"
            className="mt-9 inline-block rounded-full bg-brand px-8 py-4 text-base font-semibold text-background shadow-[var(--shadow-neon)] transition-transform hover:scale-[1.03]"
          >
            🚀 Conhecer o CONECTADAS
          </Link>
          <p className="mt-14 font-display text-2xl font-extrabold tracking-[0.3em] text-gradient">
            CONECTADAS
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Conectando meninas. Compartilhando conhecimento. Criando futuros.
          </p>
          <p className="mt-4 text-xs font-semibold tracking-[0.3em] text-cyan">
            FECEG — CIÊNCIA DELAS
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
