import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Sessao = {
  monitora: string;
  materia: string;
};

type EstadoXP = {
  xp: number;
  monitorias: number;
  exercicios: number;
  horas: number;
  lideranca: number;
  atividadesConcluidas: string[];
  medalhasExtras: string[];
  sessao: Sessao | null;
};

const inicial: EstadoXP = {
  xp: 2450,
  monitorias: 37,
  exercicios: 182,
  horas: 96,
  lideranca: 12,
  atividadesConcluidas: [],
  medalhasExtras: [],
  sessao: null,
};

const CHAVE = "conectadas-estado-v1";

type Ctx = EstadoXP & {
  nivel: number;
  proximoNivel: number;
  iniciarSessao: (s: Sessao) => void;
  validarMonitoria: () => void;
  concluirAtividade: (id: string, xp: number) => void;
  reiniciar: () => void;
};

const XPContext = createContext<Ctx | null>(null);

export function XPProvider({ children }: { children: ReactNode }) {
  const [estado, setEstado] = useState<EstadoXP>(inicial);

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE);
      if (salvo) setEstado({ ...inicial, ...JSON.parse(salvo) });
    } catch {
      /* demonstração: ignora falhas de leitura */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(estado));
    } catch {
      /* demonstração */
    }
  }, [estado]);

  const valor = useMemo<Ctx>(() => {
    const nivel = Math.max(5, Math.floor(estado.xp / 600) + 1);
    const proximoNivel = 3000 + (nivel - 5) * 600;
    return {
      ...estado,
      nivel,
      proximoNivel,
      iniciarSessao: (sessao) => setEstado((e) => ({ ...e, sessao })),
      validarMonitoria: () =>
        setEstado((e) => ({
          ...e,
          xp: e.xp + 50,
          monitorias: e.monitorias + 1,
          lideranca: e.lideranca + 1,
          horas: e.horas + 1,
        })),
      concluirAtividade: (id, xp) =>
        setEstado((e) =>
          e.atividadesConcluidas.includes(id)
            ? e
            : {
                ...e,
                xp: e.xp + xp,
                exercicios: e.exercicios + 10,
                atividadesConcluidas: [...e.atividadesConcluidas, id],
              },
        ),
      reiniciar: () => setEstado(inicial),
    };
  }, [estado]);

  return <XPContext.Provider value={valor}>{children}</XPContext.Provider>;
}

export function useXP() {
  const ctx = useContext(XPContext);
  if (!ctx) throw new Error("useXP precisa estar dentro de XPProvider");
  return ctx;
}
