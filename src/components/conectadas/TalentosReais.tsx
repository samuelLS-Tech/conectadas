import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useXP } from "@/lib/xp-store";
import { nomeEscola } from "@/lib/turmas";

type T = { id: string; nome: string; serie: string | null; turma: string | null; escola_id: string | null; xp: number; monitorias: number };

/** Estudantes com conta real (sem e-mail); a empresa pode manifestar interesse. */
export function TalentosReais({ oportunidade }: { oportunidade?: string }) {
  const { usuario } = useXP();
  const [lista, setLista] = useState<T[]>([]);
  const [enviados, setEnviados] = useState<string[]>([]);

  useEffect(() => {
    void supabase.rpc("listar_talentos").then(({ data }) => setLista(data ?? []));
    void supabase.from("empresa_interesses").select("estudante_id").then(({ data }) => setEnviados((data ?? []).map((d) => d.estudante_id)));
  }, []);

  async function interessar(t: T) {
    const { error } = await supabase.from("empresa_interesses").insert({
      empresa_nome: usuario || "Empresa",
      estudante_id: t.id,
      oportunidade: oportunidade ?? null,
    });
    if (error && !error.message.includes("duplicate")) return void toast.error("Não foi possível registrar o interesse.");
    setEnviados((e) => [...e, t.id]);
    toast.success(`${t.nome} será avisada na plataforma.`);
  }

  return (
    <section className="glass min-w-0 p-5 sm:p-7">
      <h2 className="text-xl font-bold">👩‍💻 Estudantes cadastradas na plataforma</h2>
      <p className="mt-1 text-sm text-muted-foreground">Contas reais. O e-mail das estudantes não é exibido; elas recebem o aviso dentro da plataforma.</p>
      {lista.length === 0 && <p className="mt-4 text-sm text-muted-foreground">Nenhuma estudante cadastrada ainda.</p>}
      <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 md:grid-cols-2">
        {lista.map((t) => (
          <div key={t.id} className="min-w-0 rounded-2xl border border-border/70 p-4">
            <p className="truncate text-sm font-semibold">{t.nome || "Estudante"}</p>
            <p className="truncate text-xs text-muted-foreground">
              {nomeEscola(t.escola_id)} · {t.serie ?? "—"} {t.turma ? `Turma ${t.turma}` : ""} · {t.xp.toLocaleString("pt-BR")} XP · {t.monitorias} monitorias
            </p>
            {enviados.includes(t.id) ? (
              <span className="mt-3 inline-block text-xs font-semibold text-mint">✅ Interesse enviado</span>
            ) : (
              <button onClick={() => void interessar(t)} className="mt-3 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-background">
                Manifestar interesse
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
