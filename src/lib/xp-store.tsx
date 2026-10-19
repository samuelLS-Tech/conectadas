import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { XP_POR_NIVEL, nivelPorXP, proximoNivelXP, tituloNivel } from "@/lib/niveis";

export { XP_POR_NIVEL };

export type Sessao = {
  monitora: string;
  materia: string;
};

export type TipoConta = "estudante" | "empresa" | "professor";

type Perfil = {
  xp: number;
  monitorias: number;
  exercicios: number;
  horas: number;
  lideranca: number;
  atividadesConcluidas: string[];
  usuario: string;
  serie: string | null;
  turma: string | null;
  tipo: TipoConta | null;
  userId: string | null;
  email: string | null;
};

const vazio: Perfil = {
  xp: 0,
  monitorias: 0,
  exercicios: 0,
  horas: 0,
  lideranca: 0,
  atividadesConcluidas: [],
  usuario: "",
  serie: null,
  turma: null,
  tipo: null,
  userId: null,
  email: null,
};

type Ctx = Perfil & {
  carregando: boolean;
  medalhasExtras: string[];
  sessao: Sessao | null;
  nivel: number;
  tituloNivel: string;
  proximoNivel: number | null;
  iniciarSessao: (s: Sessao) => void;
  concluirAtividade: (
    id: string,
    xp: number,
    envio?: { titulo: string; disciplina: string; acertos: number; total: number },
  ) => Promise<void>;
  recarregar: () => Promise<void>;
  sair: () => Promise<void>;
};

const XPContext = createContext<Ctx | null>(null);

async function carregarPerfil(userId: string, email: string | null): Promise<Perfil> {
  const [{ data: p }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId),
  ]);
  return {
    xp: p?.xp ?? 0,
    monitorias: p?.monitorias ?? 0,
    exercicios: p?.exercicios ?? 0,
    horas: p?.horas ?? 0,
    lideranca: p?.lideranca ?? 0,
    atividadesConcluidas: p?.atividades_concluidas ?? [],
    usuario: p?.nome ?? "",
    serie: p?.serie ?? null,
    turma: p?.turma ?? null,
    tipo: (roles?.[0]?.role as TipoConta | undefined) ?? null,
    userId,
    email,
  };
}

export function XPProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfil] = useState<Perfil>(vazio);
  const [carregando, setCarregando] = useState(true);
  const [sessao, setSessao] = useState<Sessao | null>(null);

  const sincronizar = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) setPerfil(await carregarPerfil(data.user.id, data.user.email ?? null));
    else setPerfil(vazio);
    setCarregando(false);
  }, []);

  useEffect(() => {
    void sincronizar();
    const { data: sub } = supabase.auth.onAuthStateChange((evento) => {
      if (evento === "SIGNED_IN" || evento === "SIGNED_OUT" || evento === "USER_UPDATED") {
        // adia para fora do callback de auth
        setTimeout(() => void sincronizar(), 0);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [sincronizar]);

  const valor = useMemo<Ctx>(() => {
    const nivel = nivelPorXP(perfil.xp);
    const proximoNivel = proximoNivelXP(nivel);
    return {
      ...perfil,
      carregando,
      medalhasExtras: [],
      sessao,
      nivel,
      tituloNivel: tituloNivel(nivel),
      proximoNivel,
      iniciarSessao: setSessao,
      recarregar: sincronizar,
      concluirAtividade: async (id, xp, envio) => {
        if (!perfil.userId || perfil.atividadesConcluidas.includes(id)) return;
        // XP é calculado e salvo no servidor (uma única vez por atividade); aprovar não soma de novo
        setPerfil((p) => ({ ...p, xp: p.xp + xp, exercicios: p.exercicios + 5, atividadesConcluidas: [...p.atividadesConcluidas, id] }));
        await supabase.rpc("concluir_atividade", {
          _ref: id,
          _titulo: envio?.titulo ?? "",
          _disciplina: envio?.disciplina ?? "",
          _acertos: envio?.acertos ?? 0,
        });
        void sincronizar();
      },
      sair: async () => {
        await supabase.auth.signOut();
        setPerfil(vazio);
      },
    };
  }, [perfil, carregando, sessao, sincronizar]);

  return <XPContext.Provider value={valor}>{children}</XPContext.Provider>;
}

export function useXP() {
  const ctx = useContext(XPContext);
  if (!ctx) throw new Error("useXP precisa estar dentro de XPProvider");
  return ctx;
}
