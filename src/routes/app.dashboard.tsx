import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LifeBuoy, GraduationCap } from "lucide-react";
import { useXP } from "@/lib/xp-store";
import { ProgressoNeon } from "@/components/conectadas/ProgressoNeon";
import { Notificacoes } from "@/components/conectadas/Notificacoes";
import { evolucaoMensal, xpPorCategoria } from "@/lib/conectadas-data";
import { NIVEL_MAXIMO, TITULOS_NIVEL, XP_POR_NIVEL } from "@/lib/niveis";
import { supabase } from "@/integrations/supabase/client";

type RankingItem = { posicao: number; id: string; nome: string; xp: number };

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard da estudante — CONECTADAS" },
      {
        name: "description",
        content: "Acompanhe XP, monitorias, evolução por matéria e o ranking da escola.",
      },
      { property: "og:title", content: "Dashboard da estudante — CONECTADAS" },
      { property: "og:description", content: "XP, monitorias, evolução e ranking em um só lugar." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { xp, proximoNivel, monitorias, exercicios, horas, nivel, tituloNivel, usuario, userId } = useXP();
  const [trilhaAberta, setTrilhaAberta] = useState(false);
  const [ranking, setRanking] = useState<RankingItem[]>([]);
  const [rankingCarregando, setRankingCarregando] = useState(true);
  const maxCat = Math.max(...xpPorCategoria.map((c) => c.xp));
  const dados = [...evolucaoMensal.slice(0, -1), { mes: "Hoje", xp }];

  useEffect(() => {
    let ativo = true;
    const carregarRanking = async () => {
      const { data } = await supabase.rpc("ranking_minha_escola");
      if (!ativo) return;
      setRanking(data ?? []);
      setRankingCarregando(false);
    };
    const aoFocar = () => void carregarRanking();
    const aoMudarVisibilidade = () => {
      if (document.visibilityState === "visible") void carregarRanking();
    };

    void carregarRanking();
    const intervalo = window.setInterval(() => {
      if (document.visibilityState === "visible") void carregarRanking();
    }, 30_000);
    window.addEventListener("focus", aoFocar);
    document.addEventListener("visibilitychange", aoMudarVisibilidade);

    return () => {
      ativo = false;
      window.clearInterval(intervalo);
      window.removeEventListener("focus", aoFocar);
      document.removeEventListener("visibilitychange", aoMudarVisibilidade);
    };
  }, [xp]);

  const cards = [
    { emoji: "⭐", valor: xp.toLocaleString("pt-BR"), label: "XP total" },
    { emoji: "👩‍🏫", valor: monitorias, label: "monitorias" },
    { emoji: "📚", valor: exercicios, label: "exercícios" },
    { emoji: "⏱️", valor: `${horas}h`, label: "horas de estudo" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <Notificacoes />
      <header className="animate-rise glass p-7">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold sm:text-3xl">Olá, {(usuario || "Ana").split(" ")[0]}! 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Nível {nivel} · {tituloNivel}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setTrilhaAberta(true)}
          className="mt-6 block w-full text-left"
          aria-label="Ver trilha de níveis"
        >
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-muted-foreground">
              {proximoNivel === null ? "Nível máximo alcançado" : "Progresso para o próximo nível"}
            </span>
            <span className="font-semibold">
              {proximoNivel === null
                ? `${xp.toLocaleString("pt-BR")} XP`
                : `${xp.toLocaleString("pt-BR")} / ${proximoNivel.toLocaleString("pt-BR")} XP`}
            </span>
          </div>
          <ProgressoNeon valor={proximoNivel === null ? 100 : (xp / proximoNivel) * 100} altura="h-4" />
          <span className="mt-2 block text-xs text-cyan">Ver trilha de níveis →</span>
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <div
            key={c.label}
            className="glass glow-hover animate-rise p-5"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="text-2xl">{c.emoji}</span>
            <p className="mt-3 font-display text-2xl font-bold text-gradient">{c.valor}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          to="/app/ajuda"
          className="glass glow-hover flex items-center gap-4 border-magenta/40 p-6"
        >
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-magenta/15">
            <LifeBuoy className="text-magenta" />
          </span>
          <span>
            <span className="block text-lg font-bold">🆘 Preciso de ajuda</span>
            <span className="block text-sm text-muted-foreground">
              Encontre uma monitora disponível agora
            </span>
          </span>
        </Link>
        <Link
          to="/app/ajuda"
          search={{ modo: "ensinar" }}
          className="glass glow-hover flex items-center gap-4 border-cyan/40 p-6"
        >
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-cyan/15">
            <GraduationCap className="text-cyan" />
          </span>
          <span>
            <span className="block text-lg font-bold">👩‍🏫 Quero ensinar</span>
            <span className="block text-sm text-muted-foreground">
              Ofereça monitoria e ganhe XP de liderança
            </span>
          </span>
        </Link>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass p-7">
          <h2 className="text-xl font-bold">Minha evolução</h2>
          <div className="mt-5 space-y-4">
            {xpPorCategoria.map((c) => (
              <div key={c.nome}>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span>{c.nome}</span>
                  <span className="font-semibold" style={{ color: c.cor }}>
                    {c.xp} XP
                  </span>
                </div>
                <ProgressoNeon
                  valor={(c.xp / maxCat) * 100}
                  cor={`linear-gradient(90deg, ${c.cor}, var(--cyan))`}
                  altura="h-2.5"
                />
              </div>
            ))}
          </div>

          <div className="mt-8 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dados} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  <linearGradient id="grad-xp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--neon)" stopOpacity={0.7} />
                    <stop offset="100%" stopColor="var(--cyan)" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="mes" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    color: "var(--foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="xp"
                  stroke="var(--neon)"
                  strokeWidth={2.5}
                  fill="url(#grad-xp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-7">
          <h2 className="text-xl font-bold">Ranking da escola</h2>
          <ul className="mt-5 space-y-3">
            {ranking.map((r) => (
              <li
                key={r.id}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3 transition-colors ${
                  r.id === userId
                    ? "border-primary/50 bg-soft"
                    : "border-border/60 hover:border-cyan/40"
                }`}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <span className="text-lg">{r.posicao === 1 ? "🥇" : r.posicao === 2 ? "🥈" : r.posicao === 3 ? "🥉" : `${r.posicao}º`}</span>
                  <span className="truncate text-sm font-semibold">{r.nome}</span>
                </span>
                <span className="shrink-0 text-sm text-mint">{r.xp.toLocaleString("pt-BR")} XP</span>
              </li>
            ))}
          </ul>
          {rankingCarregando && <p className="mt-5 text-sm text-muted-foreground">Carregando classificação…</p>}
          {!rankingCarregando && ranking.length === 0 && <p className="mt-5 text-sm text-muted-foreground">O ranking aparecerá quando sua escola tiver estudantes cadastradas.</p>}
          <Link
            to="/app/conquistas"
            className="mt-6 block rounded-full border border-border px-5 py-3 text-center text-sm font-semibold hover:border-cyan/60 hover:text-cyan"
          >
            🏆 Ver central de conquistas
          </Link>
        </div>
      </section>

      {trilhaAberta && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-background/80 px-5 backdrop-blur-sm"
          onClick={() => setTrilhaAberta(false)}
        >
          <div
            className="glass animate-pop max-h-[85vh] w-full max-w-md overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold">Trilha de níveis</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Cada nível exige {XP_POR_NIVEL} XP a mais que o anterior.
            </p>
            <ol className="mt-5 space-y-2.5">
              {Array.from({ length: NIVEL_MAXIMO }, (_, i) => i + 1).map((n) => {
                const concluido = n < nivel;
                const atual = n === nivel;
                return (
                  <li
                    key={n}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
                      atual
                        ? "border-mint/70 bg-mint/10 shadow-[var(--shadow-cyan)]"
                        : concluido
                          ? "border-border/60 bg-secondary/40"
                          : "border-border/40 opacity-55"
                    }`}
                  >
                    <span className="text-lg">{concluido ? "✅" : atual ? "✨" : "🔒"}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold">
                        Nível {n} — {TITULOS_NIVEL[n]}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {((n - 1) * XP_POR_NIVEL).toLocaleString("pt-BR")} XP
                        {atual ? " · nível atual" : ""}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
            <button
              onClick={() => setTrilhaAberta(false)}
              className="mt-6 w-full rounded-full border border-border px-6 py-2.5 text-sm font-semibold hover:border-cyan/60 hover:text-cyan"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
