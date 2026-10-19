import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type N = { id: string; texto: string; contato_email: string | null; empresa_interesse_id: string | null; lida: boolean; created_at: string };

/** Notificações internas (validação de atividades, interesse de empresas e monitorias). */
export function Notificacoes() {
  const [itens, setItens] = useState<N[]>([]);

  useEffect(() => {
    void supabase
      .from("notificacoes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setItens(data ?? []));
  }, []);

  if (itens.length === 0) return null;
  const naoLidas = itens.filter((n) => !n.lida);

  async function marcarLidas() {
    await supabase.from("notificacoes").update({ lida: true }).in("id", naoLidas.map((n) => n.id));
    setItens((l) => l.map((n) => ({ ...n, lida: true })));
  }

  return (
    <section className="glass p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-bold">🔔 Notificações {naoLidas.length > 0 && <span className="text-cyan">({naoLidas.length} novas)</span>}</h2>
        {naoLidas.length > 0 && (
          <button onClick={() => void marcarLidas()} className="text-xs text-muted-foreground hover:text-foreground">
            Marcar como lidas
          </button>
        )}
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {itens.map((n) => (
          <li key={n.id} className={n.lida ? "text-muted-foreground" : ""}>
            <span>• {n.texto} </span>
            {n.contato_email && (
              <a href={`mailto:${n.contato_email}`} className="font-semibold text-cyan underline-offset-2 hover:underline">
                {n.contato_email}
              </a>
            )}{" "}
            {n.empresa_interesse_id && !n.contato_email && (
              <span className="text-muted-foreground">Contato profissional não disponibilizado. </span>
            )}
            <span className="text-xs text-muted-foreground">({new Date(n.created_at).toLocaleDateString("pt-BR")})</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
