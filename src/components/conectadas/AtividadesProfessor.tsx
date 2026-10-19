import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export type AtividadeProfessorItem = { id: string; estudante_id: string; titulo: string; disciplina: string; acertos: number; total: number; xp: number; status: string; created_at: string };

/** Atividades reais enviadas pelas estudantes da escola do professor, com aprovar/recusar. */
export function AtividadesProfessor({ atividades, nomes, serie, turma, disciplina, aoAtualizar }: {
  atividades: AtividadeProfessorItem[];
  nomes: Map<string, { nome: string; serie: string; turma: string }>;
  serie: string;
  turma: string;
  disciplina: string;
  aoAtualizar: () => Promise<void>;
}) {
  async function decidir(a: AtividadeProfessorItem, aprovar: boolean) {
    const { data, error } = await supabase.rpc("validar_atividade", { _id: a.id, _aprovar: aprovar });
    if (error) return void toast.error("Não foi possível registrar a decisão.");
    toast.success(data === "ja_validada" ? "Esta atividade já tinha sido validada." : aprovar ? "Atividade aprovada" : "Atividade recusada");
    await aoAtualizar();
  }

  const filtradas = atividades.filter((a) => {
    const e = nomes.get(a.estudante_id);
    return (serie === "Todas" || e?.serie === serie) && (turma === "Todas" || e?.turma === turma) && (disciplina === "Todas" || a.disciplina === disciplina);
  });

  return (
    <section className="glass p-5 sm:p-7">
      <h2 className="text-xl font-bold">📝 Atividades enviadas para validação</h2>
      <p className="mt-1 text-sm text-muted-foreground">Estudantes da sua escola. A aprovação não soma XP extra (o XP já é contado ao concluir).</p>
      {filtradas.length === 0 && <p className="mt-4 text-sm text-muted-foreground">Nenhuma atividade enviada com esses filtros.</p>}
      <div className="mt-4 space-y-3">
        {filtradas.map((a) => {
          const e = nomes.get(a.estudante_id);
          return (
            <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/70 p-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold">{e?.nome ?? "Estudante"} · {a.titulo}</p>
                <p className="text-xs text-muted-foreground">
                  {a.disciplina} · {e ? `${e.serie} Turma ${e.turma} · ` : ""}{new Date(a.created_at).toLocaleDateString("pt-BR")} · {a.acertos}/{a.total} acertos · +{a.xp} XP
                </p>
              </div>
              {a.status === "pendente" ? (
                <div className="flex gap-2">
                  <button onClick={() => void decidir(a, true)} className="rounded-full bg-brand px-3 py-2 text-xs font-semibold text-background">Aprovar</button>
                  <button onClick={() => void decidir(a, false)} className="rounded-full border border-destructive/60 px-3 py-2 text-xs font-semibold text-destructive">Recusar</button>
                </div>
              ) : (
                <span className={`rounded-full border px-3 py-2 text-xs font-semibold ${a.status === "aprovada" ? "border-mint/50 text-mint" : "border-destructive/50 text-destructive"}`}>
                  {a.status === "aprovada" ? "✅ Aprovada" : "❌ Recusada"}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
