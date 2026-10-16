import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Marca } from "@/components/conectadas/Marca";
import { NeuralBackground } from "@/components/conectadas/NeuralBackground";
import { RequerConta } from "@/components/conectadas/RequerConta";
import { estudantesEscola } from "@/lib/conectadas-data";
import { ProgressoNeon } from "@/components/conectadas/ProgressoNeon";
import { supabase } from "@/integrations/supabase/client";
import { useXP } from "@/lib/xp-store";
import { DISCIPLINAS, SERIES, TURMAS, nomeEscola } from "@/lib/turmas";
import { AtividadesProfessor } from "@/components/conectadas/AtividadesProfessor";

export const Route = createFileRoute("/professor")({
  head: () => ({
    meta: [
      { title: "Painel da Escola — CONECTADAS" },
      { name: "description", content: "Indicadores da escola por série e turma, panorama das estudantes e validação de atividades." },
      { property: "og:title", content: "Painel da Escola — CONECTADAS" },
      { property: "og:description", content: "Acompanhe cada turma: dificuldades, facilidades e assuntos para revisar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <RequerConta tipo="professor">
      <Professor />
    </RequerConta>
  ),
});

const materiasBase = [
  { materia: "Matemática", emoji: "🔢", base: 74, forte: "funções do 1º grau", fraco: "raízes e gráfico da função quadrática" },
  { materia: "Física", emoji: "⚛️", base: 60, forte: "cinemática básica", fraco: "leis de Newton e força resultante" },
  { materia: "Química", emoji: "🧪", base: 64, forte: "massa molar", fraco: "estequiometria e balanceamento" },
  { materia: "Programação", emoji: "💻", base: 80, forte: "lógica e laços de repetição", fraco: "funções e listas em Python" },
  { materia: "Vestibulares", emoji: "🎓", base: 62, forte: "interpretação de enunciados", fraco: "probabilidade e pH (FUVEST/Unicamp)" },
];

/** Variação fictícia e estável para cada turma. */
function variacao(chave: string, i: number) {
  let h = 0;
  for (const c of chave + i) h = (h * 31 + c.charCodeAt(0)) % 997;
  return (h % 25) - 12;
}

type Aluna = { id: string; nome: string; serie: string; turma: string; xp: number; atividade: string; pendente: boolean; real?: boolean };

function Professor() {
  const { sair, userId } = useXP();
  const [serie, setSerie] = useState<string>("Todas");
  const [turma, setTurma] = useState<string>("Todas");
  const [disciplina, setDisciplina] = useState<string>("Todas");
  const [validadas, setValidadas] = useState<string[]>([]);
  const [reais, setReais] = useState<Aluna[]>([]);
  const [minha, setMinha] = useState<{ escola_id: string | null; disciplina: string | null } | null>(null);

  useEffect(() => {
    if (!userId) return;
    void supabase.from("profiles").select("escola_id, disciplina").eq("id", userId).maybeSingle().then(({ data }) => {
      setMinha(data);
      if (data?.disciplina) setDisciplina(data.disciplina);
    });
    void supabase
      .from("profiles")
      .select("id, nome, serie, turma, xp, monitorias")
      .neq("id", userId)
      .order("xp", { ascending: false })
      .then(({ data }) =>
        setReais(
          (data ?? [])
            .filter((p) => p.serie && p.turma)
            .map((p) => ({
              id: p.id,
              nome: p.nome || "Estudante",
              serie: p.serie!,
              turma: p.turma!,
              xp: p.xp,
              atividade: `${p.monitorias} monitorias registradas`,
              pendente: false,
              real: true,
            })),
        ),
      );
  }, [userId]);
  const nomesReais = useMemo(() => new Map(reais.map((r) => [r.id, { nome: r.nome, serie: r.serie, turma: r.turma }])), [reais]);

  const todas: Aluna[] = useMemo(
    () => [...reais, ...estudantesEscola.map((e) => ({ ...e, id: e.nome }))],
    [reais],
  );
  const filtradas = todas.filter(
    (a) => (serie === "Todas" || a.serie === serie) && (turma === "Todas" || a.turma === turma),
  );
  const chave = `${serie}-${turma}`;
  const desempenho = materiasBase
    .map((m, i) => ({ ...m, acerto: Math.min(95, Math.max(35, m.base + (chave === "Todas-Todas" ? 0 : variacao(chave, i)))) }))
    .sort((a, b) => b.acerto - a.acerto);
  const facilidades = desempenho.slice(0, 3).map((d) => `${d.materia}: ${d.forte}`);
  const dificuldades = [...desempenho].reverse().slice(0, 3).map((d) => `${d.materia}: ${d.fraco}`);
  const revisar = [...desempenho].reverse().slice(0, 2).map((d) => d.fraco).concat(desempenho[2] ? [desempenho[2].fraco] : []);
  const rotuloTurma = serie === "Todas" && turma === "Todas" ? "Toda a escola" : `${serie === "Todas" ? "Todas as séries" : serie} · ${turma === "Todas" ? "todas as turmas" : `Turma ${turma}`}`;

  const indicadores = [
    { emoji: "👩‍🎓", valor: filtradas.length, label: "estudantes" },
    { emoji: "⭐", valor: filtradas.reduce((s, a) => s + a.xp, 0).toLocaleString("pt-BR"), label: "XP somado" },
    { emoji: "⏳", valor: filtradas.filter((a) => a.pendente && !validadas.includes(a.id)).length, label: "atividades pendentes" },
    { emoji: "📈", valor: `${Math.round(desempenho.reduce((s, d) => s + d.acerto, 0) / desempenho.length)}%`, label: "acerto médio" },
  ];

  // agrupa por série e turma
  const grupos = new Map<string, Aluna[]>();
  for (const a of filtradas) {
    const k = `${a.serie} · Turma ${a.turma}`;
    grupos.set(k, [...(grupos.get(k) ?? []), a]);
  }
  const gruposOrdenados = [...grupos.entries()].sort(([a], [b]) => a.localeCompare(b));

  const seletor = "rounded-full border border-input bg-background/60 px-4 py-2 text-sm outline-none focus:border-primary";

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 px-5 py-3.5 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Marca to="/" usuario />
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-mint/40 px-3 py-1.5 text-xs font-semibold text-mint sm:inline">PROFESSOR</span>
            <Link to="/login" onClick={() => void sair()} className="text-sm text-muted-foreground hover:text-foreground">
              Sair
            </Link>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden px-5 py-10">
        <NeuralBackground className="opacity-40" />
        <div className="relative mx-auto max-w-6xl space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="animate-rise text-3xl font-bold sm:text-4xl">🏫 Painel da Escola</h1>
              <p className="mt-1 text-sm text-muted-foreground">{nomeEscola(minha?.escola_id)} · {rotuloTurma}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <select aria-label="Série" value={serie} onChange={(e) => setSerie(e.target.value)} className={seletor}>
                <option value="Todas">Todas as séries</option>
                {SERIES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <select aria-label="Turma" value={turma} onChange={(e) => setTurma(e.target.value)} className={seletor}>
                <option value="Todas">Todas as turmas</option>
                {TURMAS.map((t) => <option key={t} value={t}>Turma {t}</option>)}
              </select>
              <select aria-label="Disciplina" value={disciplina} onChange={(e) => setDisciplina(e.target.value)} className={seletor}>
                <option value="Todas">Todas as disciplinas</option>
                {DISCIPLINAS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {indicadores.map((i) => (
              <div key={i.label} className="glass glow-hover p-5">
                <span className="text-2xl">{i.emoji}</span>
                <p className="mt-2 font-display text-2xl font-bold text-gradient">{i.valor}</p>
                <p className="text-xs text-muted-foreground">{i.label}</p>
              </div>
            ))}
          </div>

          <section className="glass p-7">
            <h2 className="text-xl font-bold">📊 Panorama — {rotuloTurma}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Taxa média de acertos por matéria na Biblioteca STEM e nas monitorias.</p>
            <div className="mt-5 space-y-4">
              {desempenho.map((d) => (
                <div key={d.materia}>
                  <div className="mb-1.5 flex justify-between gap-3 text-sm">
                    <span>{d.emoji} {d.materia}</span>
                    <span className={d.acerto >= 75 ? "text-mint" : d.acerto < 60 ? "text-magenta" : "text-cyan"}>{d.acerto}% de acertos</span>
                  </div>
                  <ProgressoNeon valor={d.acerto} altura="h-2.5" />
                </div>
              ))}
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { t: "💪 Maiores facilidades", c: "text-mint", l: facilidades },
              { t: "⚠️ Maiores dificuldades", c: "text-magenta", l: dificuldades },
              { t: "🔁 Assuntos para revisar", c: "text-cyan", l: revisar },
            ].map((b) => (
              <div key={b.t} className="glass p-6">
                <h3 className={`font-bold ${b.c}`}>{b.t}</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {b.l.map((f) => <li key={f}>• {f}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <AtividadesProfessor nomes={nomesReais} serie={serie} turma={turma} disciplina={disciplina} />

          <section className="glass p-5 sm:p-7">
            <h2 className="text-xl font-bold">👩‍🎓 Estudantes por série e turma</h2>
            {gruposOrdenados.length === 0 && (
              <p className="mt-4 text-sm text-muted-foreground">Nenhuma estudante nesta turma ainda.</p>
            )}
            <div className="mt-5 space-y-7">
              {gruposOrdenados.map(([grupo, alunas]) => (
                <div key={grupo}>
                  <h3 className="text-xs font-semibold tracking-widest text-cyan">{grupo.toUpperCase()} · {alunas.length}</h3>
                  <div className="mt-3 space-y-3">
                    {alunas.map((e) => {
                      const ok = validadas.includes(e.id) || !e.pendente;
                      return (
                        <div key={e.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border/70 p-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand font-bold text-background">
                              {e.nome[0]?.toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">
                                {e.nome}
                                {e.real && <span className="ml-2 rounded-full border border-mint/40 px-2 py-0.5 text-[10px] text-mint">conta real</span>}
                              </p>
                              <p className="truncate text-xs text-muted-foreground">{e.xp.toLocaleString("pt-BR")} XP · {e.atividade}</p>
                            </div>
                          </div>
                          {e.real ? null : ok ? (
                            <span className="rounded-full border border-mint/50 px-3 py-2 text-xs font-semibold text-mint">✅ Validada</span>
                          ) : (
                            <button
                              onClick={() => {
                                setValidadas((v) => [...v, e.id]);
                                toast.success(`Atividade de ${e.nome} validada`);
                              }}
                              className="rounded-full bg-brand px-3 py-2 text-xs font-semibold text-background"
                            >
                              Validar
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
