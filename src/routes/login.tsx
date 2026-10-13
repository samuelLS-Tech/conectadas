import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, GraduationCap, School } from "lucide-react";
import { Marca } from "@/components/conectadas/Marca";
import { NeuralBackground } from "@/components/conectadas/NeuralBackground";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — CONECTADAS" },
      {
        name: "description",
        content:
          "Acesse a demonstração do CONECTADAS como estudante, empresa ou professor e explore os dashboards.",
      },
      { property: "og:title", content: "Entrar na plataforma — CONECTADAS" },
      { property: "og:description", content: "Bem-vinda ao CONECTADAS 💜" },
    ],
  }),
  component: Login,
});

const perfis = [
  {
    id: "estudante",
    titulo: "Estudante",
    desc: "Dashboard com XP, monitorias e conquistas",
    to: "/app/dashboard",
    Icon: GraduationCap,
    cor: "var(--neon)",
  },
  {
    id: "empresa",
    titulo: "Empresa",
    desc: "Busca de talentos e oportunidades",
    to: "/empresa",
    Icon: Building2,
    cor: "var(--cyan)",
  },
  {
    id: "professor",
    titulo: "Professor/Administrador",
    desc: "Painel da escola e validação de atividades",
    to: "/professor",
    Icon: School,
    cor: "var(--mint)",
  },
] as const;

function Login() {
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState<(typeof perfis)[number]["id"]>("estudante");
  const [email, setEmail] = useState("ana.silva@escola.br");
  const [senha, setSenha] = useState("conectadas");

  const destino = perfis.find((p) => p.id === perfil)!.to;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <NeuralBackground />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Marca />
        </div>

        <div className="glass animate-pop p-8">
          <h1 className="text-center text-2xl font-bold">Bem-vinda ao CONECTADAS 💜</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Ambiente de demonstração — nenhum dado real é utilizado.
          </p>

          <form
            className="mt-7 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: destino });
            }}
          >
            <div>
              <label className="text-xs font-semibold tracking-widest text-muted-foreground">
                E-MAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold tracking-widest text-muted-foreground">
                SENHA
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-background shadow-[var(--shadow-neon)] transition-transform hover:scale-[1.02]"
            >
              Entrar
            </button>
          </form>

          <p className="mt-7 text-center text-xs font-semibold tracking-widest text-muted-foreground">
            ENTRAR COMO:
          </p>
          <div className="mt-3 space-y-2">
            {perfis.map((p) => (
              <button
                key={p.id}
                onMouseEnter={() => setPerfil(p.id)}
                onFocus={() => setPerfil(p.id)}
                onClick={() => navigate({ to: p.to })}
                className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                  perfil === p.id
                    ? "border-primary/60 bg-soft shadow-[var(--shadow-neon)]"
                    : "border-border hover:border-cyan/50"
                }`}
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl"
                  style={{ background: `color-mix(in oklab, ${p.cor} 20%, transparent)` }}
                >
                  <p.Icon size={18} style={{ color: p.cor }} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">{p.titulo}</span>
                  <span className="block truncate text-xs text-muted-foreground">{p.desc}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <Link
          to="/"
          className="mt-6 block text-center text-sm text-muted-foreground hover:text-cyan"
        >
          ← Voltar para o site
        </Link>
      </div>
    </div>
  );
}
