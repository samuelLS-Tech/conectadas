import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Video, VideoOff, PhoneOff, Send } from "lucide-react";
import { useXP } from "@/lib/xp-store";

export const Route = createFileRoute("/app/monitoria")({
  head: () => ({
    meta: [
      { title: "Sala de monitoria — CONECTADAS" },
      {
        name: "description",
        content: "Sala de estudo online com chat, áudio e vídeo entre estudante e monitora.",
      },
      { property: "og:title", content: "Sala de monitoria — CONECTADAS" },
      { property: "og:description", content: "Estudo colaborativo em tempo real." },
    ],
  }),
  component: Monitoria,
});

type Msg = { autora: string; texto: string; eu?: boolean };

function Monitoria() {
  const navigate = useNavigate();
  const { sessao } = useXP();
  const monitora = sessao?.monitora ?? "Lívia";
  const materia = sessao?.materia ?? "Física";

  const [segundos, setSegundos] = useState(0);
  const [mic, setMic] = useState(true);
  const [cam, setCam] = useState(false);
  const [texto, setTexto] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { autora: monitora, texto: `Oi, Ana! Vamos revisar ${materia}? Me conta onde travou 😊` },
    { autora: "Ana", texto: "Oi! Não entendi a segunda lei de Newton nos exercícios.", eu: true },
    { autora: monitora, texto: "Perfeito. Vou desenhar um bloco no plano inclinado e a gente resolve junta." },
  ]);
  const fim = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const tempo = `${String(Math.floor(segundos / 60)).padStart(2, "0")}:${String(segundos % 60).padStart(2, "0")}`;

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!texto.trim()) return;
    const meu = texto.trim();
    setMsgs((m) => [...m, { autora: "Ana", texto: meu, eu: true }]);
    setTexto("");
    setTimeout(
      () =>
        setMsgs((m) => [
          ...m,
          { autora: monitora, texto: "Boa pergunta! Olha só como resolvemos passo a passo…" },
        ]),
      900,
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="glass animate-rise grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 p-6 sm:flex sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand font-display text-lg font-bold text-background">
            {monitora[0]}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold">Monitoria com {monitora}</h1>
            <p className="text-xs text-muted-foreground">{materia} · sessão em andamento</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-mint/40 bg-mint/10 px-4 py-2 font-display text-sm font-bold text-mint">
          ⏱️ {tempo}
        </span>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="glass relative flex min-h-[22rem] flex-col items-center justify-center overflow-hidden p-6">
          <div className="grid-lines absolute inset-0 opacity-30" />
          <div className="relative text-center">
            <span className="animate-pulse-glow mx-auto grid h-28 w-28 place-items-center rounded-full bg-brand font-display text-4xl font-bold text-background">
              {monitora[0]}
            </span>
            <p className="mt-5 text-lg font-bold">{monitora}</p>
            <p className="text-sm text-muted-foreground">
              {cam ? "Vídeo ligado" : "Áudio da sessão · vídeo desligado"}
            </p>
          </div>
          <div className="relative mt-8 flex gap-3">
            <button
              onClick={() => setMic((v) => !v)}
              className={`grid h-12 w-12 place-items-center rounded-full border transition-colors ${
                mic ? "border-mint/50 bg-mint/10 text-mint" : "border-border text-muted-foreground"
              }`}
              aria-label="Microfone"
            >
              {mic ? <Mic size={18} /> : <MicOff size={18} />}
            </button>
            <button
              onClick={() => setCam((v) => !v)}
              className={`grid h-12 w-12 place-items-center rounded-full border transition-colors ${
                cam ? "border-cyan/50 bg-cyan/10 text-cyan" : "border-border text-muted-foreground"
              }`}
              aria-label="Câmera"
            >
              {cam ? <Video size={18} /> : <VideoOff size={18} />}
            </button>
            <button
              onClick={() => navigate({ to: "/app/validar" })}
              className="inline-flex items-center gap-2 rounded-full bg-destructive px-6 py-3 text-sm font-semibold text-destructive-foreground transition-transform hover:scale-[1.03]"
            >
              <PhoneOff size={16} /> Finalizar monitoria
            </button>
          </div>
        </div>

        <div className="glass flex max-h-[28rem] flex-col p-6">
          <h2 className="text-base font-bold">Chat da sessão</h2>
          <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`animate-rise max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.eu
                    ? "ml-auto border border-primary/40 bg-soft"
                    : "border border-border/60 bg-secondary/50"
                }`}
              >
                <p className="text-[10px] font-semibold tracking-widest text-muted-foreground">
                  {m.autora.toUpperCase()}
                </p>
                <p className="mt-0.5">{m.texto}</p>
              </div>
            ))}
            <div ref={fim} />
          </div>
          <form onSubmit={enviar} className="mt-4 flex gap-2">
            <input
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escreva uma mensagem…"
              className="min-w-0 flex-1 rounded-full border border-input bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand text-background"
              aria-label="Enviar"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
