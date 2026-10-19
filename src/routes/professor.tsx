import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Marca } from "@/components/conectadas/Marca";
import { NeuralBackground } from "@/components/conectadas/NeuralBackground";
import { RequerConta } from "@/components/conectadas/RequerConta";
import { ProgressoNeon } from "@/components/conectadas/ProgressoNeon";
import { supabase } from "@/integrations/supabase/client";
import { useXP } from "@/lib/xp-store";
import { DISCIPLINAS, SERIES, TURMAS, nomeEscola } from "@/lib/turmas";
import { AtividadesProfessor, type AtividadeProfessorItem } from "@/components/conectadas/AtividadesProfessor";
import { agregarDesempenho } from "@/lib/professor-dashboard";
import { toast } from "sonner";

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

type Aluna = { id: string; nome: string; serie: string; turma: string; xp: number; monitorias: number };

const emojiDisciplina: Record<string, string> = {
  Matemática: "🔢",
  Física: "⚛️",
  Química: "🧪",
  Biologia: "🧬",
  Programação: "💻",
  Engenharia: "📐",
  Vestibulares: "🎓",
};

function Professor() {
  const { sair, userId } = useXP();
  const [serie, setSerie] = useState<string>("Todas");
  const [turma, setTurma] = useState<string>("Todas");
  const [disciplina, setDisciplina] = useState<string>("Todas");
  const [reais, setReais] = useState<Aluna[]>([]);
  const [atividades, setAtividades] = useState<AtividadeProfessorItem[]>([]);
  const [minha, setMinha] = useState<{ escola_id: string | null; disciplina: string | null } | null>(null);

  const carregarAtividades = useCallback(async () => {
    const tamanhoPagina = 1000;
    const todas: AtividadeProfessorItem[] = [];
    let inicio = 0;

    while (true) {
      const { data, error } = await supabase
        .from("atividades")
        .select("*")
        .order("created_at", { ascending: false })
        .range(inicio, inicio + tamanhoPagina - 1);
      if (error) {
        toast.error("Não foi possível carregar as atividades.");
        return;
      }
      todas.push(...(data ?? []));
      if (!data || data.length < tamanhoPagina) break;
      inicio += tamanhoPagina;
    }

    setAtividades(todas);
  }, []);

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
              monitorias: p.monitorias,
            })),
        ),
      );
    void carregarAtividades();
  }, [carregarAtividades, userId]);
  const nomesReais = useMemo(() => new Map(reais.map((r) => [r.id, { nome: r.nome, serie: r.serie, turma: r.turma }])), [reais]);
  const estudantesAcademicos = useMemo(() => new Map(reais.map((r) => [r.id, { serie: r.serie, turma: r.turma }])), [reais]);
  const resumo = useMemo(
    () => agregarDesempenho(atividades, estudantesAcademicos, { serie, turma, disciplina }),
    [atividades, disciplina, estudantesAcademicos, serie, turma],
  );
  const filtradas = reais.filter(
    (a) => (serie === "Todas" || a.serie === serie) && (turma === "Todas" || a.turma === turma),
  );
  const rotuloTurma = serie === "Todas" && turma === "Todas" ? "Toda a escola" : `${serie === "Todas" ? "Todas as séries" : serie} · ${turma === "Todas" ? "todas as turmas" : `Turma ${turma}`}`;

  const indicadores = [
    { emoji: "👩‍🎓", valor: filtradas.length, label: "estudantes" },
    { emoji: "⭐", valor: resumo.atividades.reduce((s, a) => s + a.xp, 0).toLocaleString("pt-BR"), label: "XP nas atividades" },
    { emoji: "⏳", valor: resumo.atividades.filter((a) => a.status === "pendente").length, label: "atividades pendentes" },
    { emoji: "📈", valor: resumo.mediaGeral === null ? "—" : `${resumo.mediaGeral}%`, label: "acerto médio" },
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
            <p className="mt-1 text-sm text-muted-foreground">Taxa média de acertos nas atividades registradas da Biblioteca STEM.</p>
            <div className="mt-5 space-y-4">
              {resumo.desempenho.map((d) => (
                <div key={d.disciplina}>
                  <div className="mb-1.5 flex justify-between gap-3 text-sm">
                    <span>{emojiDisciplina[d.disciplina] ?? "📘"} {d.disciplina}</span>
                    <span className={d.percentual >= 75 ? "text-mint" : d.percentual < 60 ? "text-magenta" : "text-cyan"}>{d.percentual}% de acertos · {d.atividades} atividade(s)</span>
                  </div>
                  <ProgressoNeon valor={d.percentual} altura="h-2.5" />
                </div>
              ))}
              {resumo.desempenho.length === 0 && (
                <p className="text-sm text-muted-foreground">Não há atividades com dados suficientes para os filtros selecionados.</p>
              )}
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { t: "💪 Maiores facilidades", c: "text-mint", l: resumo.facilidades },
              { t: "⚠️ Maiores dificuldades", c: "text-magenta", l: resumo.dificuldades },
              { t: "🔁 Assuntos para revisar", c: "text-cyan", l: resumo.dificuldades },
            ].map((b) => (
              <div key={b.t} className="glass p-6">
                <h3 className={`font-bold ${b.c}`}>{b.t}</h3>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {b.l.map((f) => <li key={f.rotulo}>• {f.rotulo} · {f.percentual}%</li>)}
                  {b.l.length === 0 && <li>Sem dados para os filtros selecionados.</li>}
                </ul>
              </div>
            ))}
          </div>

          <AtividadesProfessor atividades={atividades} nomes={nomesReais} serie={serie} turma={turma} disciplina={disciplina} aoAtualizar={carregarAtividades} />

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
                    {alunas.map((e) => (
                        <div key={e.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border/70 p-4">
                          <div className="flex min-w-0 items-center gap-3">
                            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand font-bold text-background">
                              {e.nome[0]?.toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <p className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                                <span className="truncate">{e.nome}</span>
                                <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full border border-mint/40 px-2 py-0.5 text-[10px] leading-none text-mint">conta real</span>
                              </p>
                              <p className="truncate text-xs text-muted-foreground">{e.xp.toLocaleString("pt-BR")} XP · {e.monitorias} monitorias registradas</p>
                            </div>
                          </div>
                        </div>
                    ))}
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
