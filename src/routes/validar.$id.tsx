import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Marca } from "@/components/conectadas/Marca";
import { RequerConta } from "@/components/conectadas/RequerConta";
import { supabase } from "@/integrations/supabase/client";
import { useXP } from "@/lib/xp-store";

export const Route = createFileRoute("/validar/$id")({
  head: () => ({
    meta: [
      { title: "Confirmar monitoria — CONECTADAS" },
      { name: "description", content: "Confirme a monitoria que você participou para receber seu XP no CONECTADAS." },
      { property: "og:title", content: "Confirmar monitoria — CONECTADAS" },
      { property: "og:description", content: "Validação dupla de monitorias por QR Code." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <RequerConta>
      <Confirmar />
    </RequerConta>
  ),
});

const mensagens: Record<string, { titulo: string; itens: string[] }> = {
  aluna: { titulo: "Presença confirmada!", itens: ["+10 XP por participar da monitoria", "+1 hora de estudo"] },
  monitora: {
    titulo: "Monitoria confirmada!",
    itens: ["+50 XP adicionados", "+1 ponto de liderança", "+1 experiência no portfólio"],
  },
};

function Confirmar() {
  const { id } = Route.useParams();
  const { usuario, recarregar } = useXP();
  const [resultado, setResultado] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function confirmar() {
    setEnviando(true);
    const { data, error } = await supabase.rpc("confirmar_monitoria", { _sessao: id });
    setEnviando(false);
    setResultado(error ? "erro" : (data as string));
    void recarregar();
  }

  const msg = resultado ? mensagens[resultado] : undefined;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 py-10">
      <Marca to="/" usuario />
      <div className="glass animate-pop mt-8 w-full max-w-sm p-7 text-center">
        {!resultado && (
          <>
            <p className="text-4xl">📲</p>
            <h1 className="mt-3 text-2xl font-bold">Confirmar monitoria</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {usuario.split(" ")[0]}, confirme que você participou desta monitoria para receber o seu XP.
            </p>
            <button
              onClick={() => void confirmar()}
              disabled={enviando}
              className="mt-6 w-full rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-background shadow-[var(--shadow-neon)] disabled:opacity-60"
            >
              {enviando ? "Confirmando…" : "Confirmar monitoria"}
            </button>
          </>
        )}
        {msg && (
          <>
            <p className="text-5xl">🎉</p>
            <h1 className="mt-3 text-2xl font-bold text-mint">{msg.titulo}</h1>
            <ul className="mt-5 space-y-2">
              {msg.itens.map((t) => (
                <li key={t} className="rounded-2xl border border-primary/40 bg-soft px-4 py-2.5 text-sm font-semibold">{t}</li>
              ))}
            </ul>
          </>
        )}
        {resultado === "ja_confirmado" && <p className="text-sm">Você já confirmou esta monitoria. ✅</p>}
        {resultado === "sessao_ocupada" && (
          <p className="text-sm text-muted-foreground">Esta monitoria já foi confirmada pelas duas participantes.</p>
        )}
        {resultado === "erro" && <p className="text-sm text-destructive">Este QR Code não é válido.</p>}
        {resultado && (
          <Link to="/" className="mt-6 inline-block text-sm text-muted-foreground hover:text-cyan">
            Ir para o início
          </Link>
        )}
      </div>
    </div>
  );
}
