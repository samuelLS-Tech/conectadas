import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { isAuthSessionMissingError, type User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Building2, Eye, EyeOff, GraduationCap, School } from "lucide-react";
import { Marca } from "@/components/conectadas/Marca";
import { NeuralBackground } from "@/components/conectadas/NeuralBackground";
import { supabase } from "@/integrations/supabase/client";
import { ehTipoConta, resolverFluxoLogin } from "@/lib/login-flow";
import { useXP, type TipoConta } from "@/lib/xp-store";
import { DISCIPLINAS, ESCOLAS, SERIES, TURMAS } from "@/lib/turmas";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string | undefined } => ({
    redirect: typeof s["redirect"] === "string" && s["redirect"].startsWith("/") ? (s["redirect"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Entrar — CONECTADAS" },
      { name: "description", content: "Entre ou crie sua conta no CONECTADAS como estudante, empresa ou professor." },
      { property: "og:title", content: "Entrar na plataforma — CONECTADAS" },
      { property: "og:description", content: "Olá! Boas-vindas ao CONECTADAS 💜" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

const perfis = [
  { id: "estudante", titulo: "Estudante", Icon: GraduationCap, cor: "var(--neon)" },
  { id: "empresa", titulo: "Empresa", Icon: Building2, cor: "var(--cyan)" },
  { id: "professor", titulo: "Professor", Icon: School, cor: "var(--mint)" },
] as const;

export const destinoPorTipo: Record<TipoConta, string> = {
  estudante: "/app/dashboard",
  empresa: "/empresa",
  professor: "/professor",
};

const campo =
  "mt-1.5 w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary";
const rotulo = "text-xs font-semibold tracking-widest text-muted-foreground";
const tipoGoogleKey = "conectadas-google-tipo";

function Login() {
  const navigate = useNavigate();
  const { recarregar } = useXP();
  const { redirect } = Route.useSearch();
  const [modo, setModo] = useState<"entrar" | "criar">("entrar");
  const [tipo, setTipo] = useState<TipoConta>("estudante");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [serie, setSerie] = useState<string>(SERIES[0]);
  const [turma, setTurma] = useState<string>(TURMAS[0]);
  const [escola, setEscola] = useState<string>(ESCOLAS[0].id);
  const [disciplina, setDisciplina] = useState<string>(DISCIPLINAS[0]);
  const [enviando, setEnviando] = useState(false);
  const [verSenha, setVerSenha] = useState(false);
  const [codigoProf, setCodigoProf] = useState("");
  const [oauthPendente, setOauthPendente] = useState(false);
  const [sessaoAtual, setSessaoAtual] = useState<User | null>(null);

  const abrirOnboarding = useCallback((user: User) => {
    const tipoSalvo = sessionStorage.getItem(tipoGoogleKey);
    if (ehTipoConta(tipoSalvo)) setTipo(tipoSalvo);
    setNome(
      String(
        user.user_metadata?.["full_name"] ??
          user.user_metadata?.["name"] ??
          user.user_metadata?.["nome"] ??
          "",
      ),
    );
    setEmail(user.email ?? "");
    setModo("criar");
    setOauthPendente(true);
  }, []);

  const resolverSessao = useCallback(
    async (user: User) => {
      const { data: papeis, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      const fluxo = resolverFluxoLogin(papeis, error);
      if (fluxo.estado === "onboarding") {
        abrirOnboarding(user);
        return;
      }
      if (fluxo.estado === "bloqueado") {
        throw new Error(
          fluxo.motivo === "consulta"
            ? "Não foi possível verificar seu tipo de conta. Tente novamente."
            : "Seu tipo de conta precisa ser corrigido. Fale com o suporte.",
        );
      }
      sessionStorage.removeItem(tipoGoogleKey);
      await navigate({ to: redirect ?? destinoPorTipo[fluxo.tipo] });
    },
    [abrirOnboarding, navigate, redirect],
  );

  useEffect(() => {
    void (async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error && !isAuthSessionMissingError(error)) throw error;
        if (data.user) setSessaoAtual(data.user);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Não foi possível verificar sua conta.");
      }
    })();
  }, []);

  async function continuarConectado() {
    if (!sessaoAtual) return;
    try {
      await resolverSessao(sessaoAtual);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Não foi possível entrar.");
    }
  }

  async function trocarDeConta() {
    await supabase.auth.signOut();
    sessionStorage.removeItem(tipoGoogleKey);
    setSessaoAtual(null);
    setOauthPendente(false);
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      if (oauthPendente) {
        if (!nome.trim()) throw new Error("Informe seu nome.");
        const { error } = await supabase.rpc("concluir_onboarding", {
          _tipo: tipo,
          _nome: nome.trim(),
          _serie: tipo === "estudante" ? serie : undefined,
          _turma: tipo === "estudante" ? turma : undefined,
          _escola_id: tipo !== "empresa" ? escola : undefined,
          _disciplina: tipo === "professor" ? disciplina : undefined,
          _codigo_professor: tipo === "professor" ? codigoProf.trim() : undefined,
        });
        if (error) throw error;
        sessionStorage.removeItem(tipoGoogleKey);
        await recarregar();
        const { data, error: userError } = await supabase.auth.getUser();
        if (userError || !data.user) throw new Error("Não foi possível recuperar sua sessão.");
        await resolverSessao(data.user);
        toast.success(`Olá, ${nome.trim().split(" ")[0]}!`);
      } else if (modo === "criar") {
        if (!nome.trim()) throw new Error("Informe seu nome.");
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              nome: nome.trim(),
              tipo,
              serie: tipo === "estudante" ? serie : "",
              turma: tipo === "estudante" ? turma : "",
              escola_id: tipo !== "empresa" ? escola : "",
              disciplina: tipo === "professor" ? disciplina : "",
              ...(tipo === "professor" ? { codigo_professor: codigoProf.trim() } : {}),
            },
          },
        });
        if (error) throw error;
        if (!data.session || !data.user) {
          toast.success("Conta criada! Agora é só entrar.");
          setModo("entrar");
          return;
        }
        await resolverSessao(data.user);
        toast.success(`Olá, ${nome.trim().split(" ")[0]}!`);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
        await resolverSessao(data.user);
        const n = String(data.user.user_metadata?.["nome"] ?? "").trim().split(" ")[0];
        toast.success(n ? `Olá, ${n}!` : "Olá!");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Algo deu errado.";
      toast.error(
        tipo === "professor" && modo === "criar" && msg.toLowerCase().includes("database error") ? "Código de acesso de professor inválido." :
        msg.includes("Invalid login") ? "E-mail ou senha incorretos." :
        msg.includes("already registered") ? "Este e-mail já tem conta. Use Entrar." :
        msg.toLowerCase().includes("password") ? "A senha precisa ter pelo menos 6 caracteres e não pode ser muito comum." : msg,
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      <NeuralBackground />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Marca />
        </div>

        <div className="glass animate-pop p-8">
          <h1 className="text-center text-2xl font-bold">{oauthPendente ? "Complete seu perfil" : "Olá! Boas-vindas ao CONECTADAS 💜"}</h1>

          {!oauthPendente && <div className="mt-6 grid grid-cols-2 gap-1 rounded-full border border-border p-1">
            {(["entrar", "criar"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModo(m)}
                className={`rounded-full py-2 text-sm font-semibold transition-colors ${
                  modo === m ? "bg-brand text-background" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "entrar" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>}

          {!oauthPendente && sessaoAtual && (
            <div className="mt-6 rounded-2xl border border-border bg-background/40 p-4 text-sm">
              <p className="text-muted-foreground">
                Você já está conectado(a) como{" "}
                <span className="font-semibold text-foreground">{sessaoAtual.email}</span>.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => void continuarConectado()}
                  className="rounded-full bg-brand px-4 py-2.5 text-xs font-semibold text-background"
                >
                  Continuar
                </button>
                <button
                  type="button"
                  onClick={() => void trocarDeConta()}
                  className="rounded-full border border-border px-4 py-2.5 text-xs font-semibold hover:border-cyan/60 hover:text-cyan"
                >
                  Trocar de conta
                </button>
              </div>
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={enviar}>
            {modo === "criar" && (
              <>
                <div>
                  <p className={rotulo}>TIPO DE CONTA</p>
                  <div className="mt-1.5 grid grid-cols-3 gap-2">
                    {perfis.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setTipo(p.id)}
                        className={`flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 text-xs font-semibold transition-all ${
                          tipo === p.id ? "border-primary/60 bg-soft shadow-[var(--shadow-neon)]" : "border-border hover:border-cyan/50"
                        }`}
                      >
                        <p.Icon size={18} style={{ color: p.cor }} />
                        {p.titulo}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={rotulo}>NOME</label>
                  <input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" className={campo} />
                </div>
                {tipo !== "empresa" && (
                  <div>
                    <label className={rotulo}>ESCOLA</label>
                    <select value={escola} onChange={(e) => setEscola(e.target.value)} className={campo}>
                      {ESCOLAS.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
                    </select>
                  </div>
                )}
                {tipo === "professor" && (
                  <div>
                    <label className={rotulo}>DISCIPLINA</label>
                    <select value={disciplina} onChange={(e) => setDisciplina(e.target.value)} className={campo}>
                      {DISCIPLINAS.map((d) => <option key={d}>{d}</option>)}
                    </select>
                  </div>
                )}
                {tipo === "professor" && (
                  <div>
                    <label className={rotulo}>CÓDIGO DE ACESSO DE PROFESSOR</label>
                    <input required value={codigoProf} onChange={(e) => setCodigoProf(e.target.value)} placeholder="Fornecido pela escola" className={campo} />
                  </div>
                )}
                {tipo === "estudante" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={rotulo}>SÉRIE</label>
                      <select value={serie} onChange={(e) => setSerie(e.target.value)} className={campo}>
                        {SERIES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={rotulo}>TURMA</label>
                      <select value={turma} onChange={(e) => setTurma(e.target.value)} className={campo}>
                        {TURMAS.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}
            {!oauthPendente && <div>
              <label className={rotulo}>E-MAIL</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={campo} />
            </div>}
            {!oauthPendente && <div>
              <label className={rotulo}>SENHA</label>
              <div className="relative">
                <input required minLength={6} type={verSenha ? "text" : "password"} value={senha} onChange={(e) => setSenha(e.target.value)} className={`${campo} pr-12`} />
                <button
                  type="button"
                  onClick={() => setVerSenha((v) => !v)}
                  aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 mt-[3px] -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                >
                  {verSenha ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>}
            <button
              type="submit"
              disabled={enviando}
              className="w-full rounded-full bg-brand px-6 py-3.5 text-sm font-semibold text-background shadow-[var(--shadow-neon)] transition-transform hover:scale-[1.02] disabled:opacity-60"
            >
              {enviando ? "Aguarde…" : oauthPendente ? "Concluir cadastro" : modo === "entrar" ? "Entrar" : "Criar conta"}
            </button>
          </form>
        </div>

        <Link to="/" className="mt-6 block text-center text-sm text-muted-foreground hover:text-cyan">
          ← Voltar para o site
        </Link>
      </div>
    </div>
  );
}
