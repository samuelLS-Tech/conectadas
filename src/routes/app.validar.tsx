import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { ShieldCheck, Check, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/app/validar")({
  validateSearch: (s: Record<string, unknown>): { sessao?: string | undefined } => ({
    sessao: typeof s["sessao"] === "string" ? (s["sessao"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Validação por QR Code — CONECTADAS" },
      { name: "description", content: "Escaneie o QR Code com os dois celulares para validar a monitoria e receber XP." },
      { property: "og:title", content: "Validação por QR Code — CONECTADAS" },
      { property: "og:description", content: "Validação dupla contra fraudes nas monitorias." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Validar,
});

type Status = { materia: string; monitora_nome: string; criadora_confirmou: boolean; monitora_confirmou: boolean };

function Validar() {
  const { sessao } = Route.useSearch();
  const [qr, setQr] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    if (!sessao) return;
    const url = `${window.location.origin}/validar/${sessao}`;
    setLink(url);
    void QRCode.toDataURL(url, { margin: 1, width: 512, color: { dark: "#070B1A", light: "#F8FAFC" } }).then(setQr);

    const ler = async () => {
      const { data } = await supabase
        .from("monitoria_sessoes")
        .select("materia, monitora_nome, criadora_confirmou, monitora_confirmou")
        .eq("id", sessao)
        .maybeSingle();
      if (data) setStatus(data);
    };
    void ler();
    const canal = supabase
      .channel(`sessao-${sessao}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "monitoria_sessoes", filter: `id=eq.${sessao}` }, () => void ler())
      .subscribe();
    const t = setInterval(() => void ler(), 5000);
    return () => {
      clearInterval(t);
      void supabase.removeChannel(canal);
    };
  }, [sessao]);

  if (!sessao) {
    return (
      <div className="glass mx-auto max-w-lg p-8 text-center">
        <h1 className="text-2xl font-bold">Nenhuma monitoria para validar</h1>
        <p className="mt-2 text-sm text-muted-foreground">Comece uma monitoria e finalize a sessão para gerar o QR Code.</p>
        <Link to="/app/ajuda" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-background">
          Pedir ajuda
        </Link>
      </div>
    );
  }

  const ambas = status?.criadora_confirmou && status?.monitora_confirmou;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="glass animate-pop p-6 text-center sm:p-8">
        <h1 className="text-2xl font-bold sm:text-3xl">{ambas ? "🎉 Monitoria validada!" : "✅ Monitoria concluída!"}</h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
          As duas estudantes precisam escanear este QR Code com o celular e confirmar. Quem não confirmar não recebe a sua parte do XP.
        </p>
        {status && (
          <p className="mt-2 text-xs text-muted-foreground">{status.materia} · com {status.monitora_nome}</p>
        )}

        <div className="mx-auto mt-7 w-56 rounded-2xl bg-foreground p-3 shadow-[var(--shadow-cyan)] sm:w-64">
          {qr ? <img src={qr} alt="QR Code para validar a monitoria" className="w-full rounded-lg" /> : <div className="aspect-square" />}
        </div>
        <a href={link} target="_blank" rel="noreferrer" className="mt-3 block break-all text-xs text-cyan underline-offset-4 hover:underline">
          {link}
        </a>

        <div className="mx-auto mt-7 grid max-w-md gap-3 text-left sm:grid-cols-2">
          {[
            { nome: "Quem recebeu ajuda", ok: status?.criadora_confirmou, xp: "+10 XP" },
            { nome: "Monitora", ok: status?.monitora_confirmou, xp: "+50 XP · +1 liderança" },
          ].map((p) => (
            <div key={p.nome} className={`rounded-2xl border p-4 ${p.ok ? "border-mint/50 bg-mint/5" : "border-border"}`}>
              <p className="flex items-center gap-2 text-sm font-semibold">
                {p.ok ? <Check size={16} className="text-mint" /> : <Clock size={16} className="text-muted-foreground" />}
                {p.nome}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{p.ok ? `Confirmou · ${p.xp}` : "Aguardando escanear…"}</p>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-7 flex max-w-lg items-start gap-3 rounded-2xl border border-cyan/30 bg-cyan/5 p-4 text-left text-xs text-muted-foreground">
          <ShieldCheck size={18} className="shrink-0 text-cyan" />
          <span>Cada confirmação é feita na conta de cada estudante, no próprio celular. Assim fica comprovado que a monitoria aconteceu.</span>
        </p>

        <Link to="/app/dashboard" className="mt-6 inline-block rounded-full border border-border px-6 py-3 text-sm font-semibold hover:border-cyan/60 hover:text-cyan">
          Voltar ao painel
        </Link>
      </div>
    </div>
  );
}
