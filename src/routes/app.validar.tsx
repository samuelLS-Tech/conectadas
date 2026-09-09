import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useXP } from "@/lib/xp-store";

export const Route = createFileRoute("/app/validar")({
  head: () => ({
    meta: [
      { title: "Validação por QR Code — CONECTADAS" },
      {
        name: "description",
        content:
          "Confirme a monitoria por QR Code ou token temporário para receber XP e registrar a experiência.",
      },
      { property: "og:title", content: "Validação por QR Code — CONECTADAS" },
      { property: "og:description", content: "Validação dupla contra fraudes nas monitorias." },
    ],
  }),
  component: Validar,
});

function QRFicticio() {
  const celulas = useMemo(() => {
    const n = 21;
    const seed = 7;
    const arr: boolean[] = [];
    for (let i = 0; i < n * n; i++) {
      const l = Math.floor(i / n);
      const c = i % n;
      const canto =
        (l < 7 && c < 7) || (l < 7 && c > n - 8) || (l > n - 8 && c < 7);
      if (canto) {
        const dl = Math.min(l, n - 1 - l);
        const dc = Math.min(c, n - 1 - c);
        const bl = l < 7 ? l : n - 1 - l;
        const bc = c < 7 ? c : n - 1 - c;
        const anel = Math.max(Math.min(bl, 6), 0);
        void dl;
        void dc;
        arr.push(bl === 0 || bc === 0 || bl === 6 || bc === 6 || (bl >= 2 && bl <= 4 && bc >= 2 && bc <= 4) || anel === -1);
      } else {
        arr.push((i * seed + l * 3 + c * 5) % 3 !== 0);
      }
    }
    return arr;
  }, []);

  return (
    <div className="mx-auto grid w-56 grid-cols-21 gap-0 rounded-2xl bg-foreground p-3 shadow-[var(--shadow-cyan)] sm:w-64">
      <div className="grid w-full grid-cols-[repeat(21,minmax(0,1fr))]">
        {celulas.map((on, i) => (
          <span
            key={i}
            className="aspect-square"
            style={{ background: on ? "var(--background)" : "transparent" }}
          />
        ))}
      </div>
    </div>
  );
}

function Validar() {
  const { validarMonitoria, sessao } = useXP();
  const [validado, setValidado] = useState(false);

  return (
    <div className="mx-auto max-w-3xl">
      {!validado ? (
        <div className="glass animate-pop p-8 text-center">
          <h1 className="text-3xl font-bold">✅ Monitoria concluída!</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Confirme a sessão para que os pontos sejam adicionados ao seu perfil.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {sessao ? `${sessao.materia} · com ${sessao.monitora}` : "Física · com Lívia"}
          </p>

          <div className="mt-8">
            <QRFicticio />
          </div>

          <p className="mt-6 text-xs tracking-widest text-muted-foreground">CÓDIGO DE VALIDAÇÃO</p>
          <p className="font-display text-2xl font-bold text-gradient">8F42-XP91</p>

          <button
            onClick={() => {
              validarMonitoria();
              setValidado(true);
            }}
            className="mt-8 rounded-full bg-[var(--gradient-brand)] px-8 py-3.5 text-sm font-semibold text-background shadow-[var(--shadow-neon)] transition-transform hover:scale-[1.03]"
          >
            Validar monitoria
          </button>

          <p className="mx-auto mt-8 flex max-w-lg items-start gap-3 rounded-2xl border border-cyan/30 bg-cyan/5 p-4 text-left text-xs text-muted-foreground">
            <ShieldCheck size={18} className="shrink-0 text-cyan" />
            <span>
              A validação dupla ajuda a reduzir fraudes e garante que a monitoria realmente aconteceu:
              as duas estudantes confirmam a sessão pelo QR Code ou por um token temporário.
            </span>
          </p>
        </div>
      ) : (
        <div className="glass animate-pop border-mint/40 p-10 text-center">
          <p className="text-5xl">🎉</p>
          <h1 className="mt-4 text-3xl font-bold text-mint">Monitoria validada!</h1>
          <ul className="mx-auto mt-8 max-w-sm space-y-3">
            {[
              { t: "+50 XP", d: "adicionados ao seu total" },
              { t: "+1 ponto de liderança", d: "por ensinar outra estudante" },
              { t: "+1 experiência", d: "registrada no seu portfólio" },
            ].map((r, i) => (
              <li
                key={r.t}
                className="animate-pop flex items-center justify-between rounded-2xl border border-primary/40 bg-[var(--gradient-soft)] px-5 py-3 text-left"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <span className="font-display font-bold text-gradient">{r.t}</span>
                <span className="text-xs text-muted-foreground">{r.d}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            A estudante que recebeu ajuda ganhou <strong className="text-cyan">+10 XP</strong>.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/app/conquistas"
              className="rounded-full bg-[var(--gradient-brand)] px-6 py-3 text-sm font-semibold text-background"
            >
              🏆 Ver conquistas
            </Link>
            <Link
              to="/app/dashboard"
              className="rounded-full border border-border px-6 py-3 text-sm font-semibold hover:border-cyan/60 hover:text-cyan"
            >
              Voltar ao dashboard
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
