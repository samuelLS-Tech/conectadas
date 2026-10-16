import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useXP } from "@/lib/xp-store";

type Oferta = { id: string; autora_id: string; autora_nome: string; tipo: string; disciplina: string; assunto: string; created_at: string };

/** Ofertas e pedidos reais de monitoria: publica, lista compatíveis e registra interesse. */
export function OfertasMonitoria({ ensinar, disciplina }: { ensinar: boolean; disciplina: string }) {
  const { userId, usuario } = useXP();
  const [assunto, setAssunto] = useState("");
  const [lista, setLista] = useState<Oferta[]>([]);
  const [minhas, setMinhas] = useState<Oferta[]>([]);
  const [interesses, setInteresses] = useState<{ oferta_id: string; interessada_id: string; interessada_nome: string }[]>([]);
  const meuTipo = ensinar ? "oferta" : "pedido";
  const tipoCompativel = ensinar ? "pedido" : "oferta";

  const carregar = useCallback(async () => {
    const [{ data: o }, { data: i }] = await Promise.all([
      supabase.from("monitoria_ofertas").select("*").eq("disciplina", disciplina).order("created_at", { ascending: false }).limit(50),
      supabase.from("monitoria_interesses").select("oferta_id, interessada_id, interessada_nome"),
    ]);
    const todas = (o ?? []) as Oferta[];
    setLista(todas.filter((x) => x.tipo === tipoCompativel && x.autora_id !== userId));
    setMinhas(todas.filter((x) => x.autora_id === userId));
    setInteresses(i ?? []);
  }, [disciplina, tipoCompativel, userId]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  async function publicar(e: React.FormEvent) {
    e.preventDefault();
    if (!assunto.trim()) return;
    const { error } = await supabase.from("monitoria_ofertas").insert({
      autora_nome: usuario || "Estudante",
      tipo: meuTipo,
      disciplina,
      assunto: assunto.trim(),
    });
    if (error) return void toast.error("Não foi possível publicar.");
    setAssunto("");
    toast.success(ensinar ? "Oferta publicada!" : "Pedido publicado!");
    void carregar();
  }

  async function interessar(o: Oferta) {
    const { error } = await supabase.from("monitoria_interesses").insert({ oferta_id: o.id, interessada_nome: usuario || "Estudante" });
    if (error && !error.message.includes("duplicate")) return void toast.error("Não foi possível registrar.");
    toast.success(`${o.autora_nome} foi avisada do seu interesse.`);
    void carregar();
  }

  const jaInteressei = (id: string) => interesses.some((i) => i.oferta_id === id && i.interessada_id === userId);

  return (
    <section className="glass space-y-5 p-6">
      <div className="flex flex-wrap gap-2">
        <Link to="/app/ajuda" search={{ modo: "ensinar" }} className={`rounded-full px-4 py-2 text-sm font-semibold ${ensinar ? "bg-brand text-background" : "border border-border"}`}>
          Oferecer ajuda
        </Link>
        <Link to="/app/ajuda" search={{}} className={`rounded-full px-4 py-2 text-sm font-semibold ${!ensinar ? "bg-brand text-background" : "border border-border"}`}>
          Buscar ajuda
        </Link>
      </div>

      <form onSubmit={publicar} className="flex flex-col gap-2 sm:flex-row">
        <input
          value={assunto}
          onChange={(e) => setAssunto(e.target.value)}
          placeholder={ensinar ? `Assunto de ${disciplina} que você ensina` : `Assunto de ${disciplina} em que precisa de ajuda`}
          className="min-w-0 flex-1 rounded-full border border-input bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        <button className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-background">
          {ensinar ? "Publicar oferta" : "Publicar pedido"}
        </button>
      </form>

      <div>
        <h3 className="font-bold">{ensinar ? "Pedidos de ajuda compatíveis" : "Ofertas de ajuda compatíveis"} · {disciplina}</h3>
        {lista.length === 0 && <p className="mt-2 text-sm text-muted-foreground">Nenhum por enquanto.</p>}
        <div className="mt-3 space-y-2">
          {lista.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border/70 p-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{o.assunto}</p>
                <p className="text-xs text-muted-foreground">{o.autora_nome} · {new Date(o.created_at).toLocaleDateString("pt-BR")}</p>
              </div>
              {jaInteressei(o.id) ? (
                <span className="text-xs font-semibold text-mint">✅ Interesse enviado</span>
              ) : (
                <button onClick={() => void interessar(o)} className="rounded-full border border-primary/60 px-3 py-1.5 text-xs font-semibold">
                  Tenho interesse
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {minhas.length > 0 && (
        <div>
          <h3 className="font-bold">Minhas publicações</h3>
          <div className="mt-3 space-y-2">
            {minhas.map((o) => {
              const nomes = interesses.filter((i) => i.oferta_id === o.id).map((i) => i.interessada_nome);
              return (
                <div key={o.id} className="rounded-2xl border border-border/70 p-3 text-sm">
                  <p className="font-semibold">{o.tipo === "oferta" ? "Ofereço" : "Preciso"}: {o.assunto}</p>
                  <p className="text-xs text-muted-foreground">
                    {nomes.length ? `Interessadas: ${nomes.join(", ")}` : "Ainda sem interessadas"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
