import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useXP } from "@/lib/xp-store";

export type NoHabilidade = {
  id: string;
  trilha: string;
  nome: string;
  criterio_tipo: "atividade" | "monitoria" | "ajuda";
  criterio_valor: string;
  ordem: number;
};

export type Trilha = {
  id: string;
  nome: string;
  emoji: string;
  medalha: { nome: string; emoji: string; descricao: string };
};

export const TRILHAS: Trilha[] = [
  {
    id: "tecnologia",
    nome: "Tecnologia",
    emoji: "💻",
    medalha: {
      nome: "Medalha Ada Lovelace",
      emoji: "🏅",
      descricao: "Homenagem à primeira programadora da história.",
    },
  },
  {
    id: "matematica",
    nome: "Matemática",
    emoji: "🔢",
    medalha: {
      nome: "Medalha Katherine Johnson",
      emoji: "🚀",
      descricao: "Homenagem à matemática da NASA que calculou trajetórias espaciais.",
    },
  },
  {
    id: "quimica",
    nome: "Química",
    emoji: "🧪",
    medalha: {
      nome: "Medalha Rosalind Franklin",
      emoji: "🧬",
      descricao: "Homenagem à cientista cujas imagens revelaram a estrutura do DNA.",
    },
  },
  {
    id: "fisica",
    nome: "Física",
    emoji: "⚛️",
    medalha: {
      nome: "Medalha Marie Curie",
      emoji: "☢️",
      descricao: "Homenagem à pioneira da radioatividade, duas vezes Nobel.",
    },
  },
  {
    id: "engenharia",
    nome: "Engenharia",
    emoji: "📐",
    medalha: {
      nome: "Medalha Jaqueline Goes de Jesus",
      emoji: "🔬",
      descricao: "Homenagem à cientista brasileira que sequenciou o genoma do coronavírus em 48 horas.",
    },
  },
];

export type Conquistas = {
  carregando: boolean;
  nos: NoHabilidade[];
  desbloqueados: Set<string>;
  medalhas: Set<string>;
  completa: (trilha: string) => boolean;
};

/** Lê do banco os nós da árvore de habilidades e o progresso real da estudante. */
export function useConquistas(): Conquistas {
  const { userId, xp, monitorias, exercicios } = useXP();
  const [nos, setNos] = useState<NoHabilidade[]>([]);
  const [desbloqueados, setDesbloqueados] = useState<Set<string>>(new Set());
  const [medalhas, setMedalhas] = useState<Set<string>>(new Set());
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!userId) {
      setNos([]);
      setDesbloqueados(new Set());
      setMedalhas(new Set());
      setCarregando(false);
      return;
    }
    let ativo = true;
    void (async () => {
      const [{ data: catalogo }, { data: feitos }, { data: meds }] = await Promise.all([
        supabase.from("habilidades").select("*").order("ordem"),
        supabase.from("estudante_habilidades").select("habilidade_id").eq("estudante_id", userId),
        supabase.from("estudante_medalhas").select("medalha_id").eq("estudante_id", userId),
      ]);
      if (!ativo) return;
      setNos((catalogo ?? []) as NoHabilidade[]);
      setDesbloqueados(new Set((feitos ?? []).map((f) => f.habilidade_id)));
      setMedalhas(new Set((meds ?? []).map((m) => m.medalha_id)));
      setCarregando(false);
    })();
    return () => {
      ativo = false;
    };
  }, [userId, xp, monitorias, exercicios]);

  const completa = (trilha: string) => {
    const daTrilha = nos.filter((n) => n.trilha === trilha);
    return daTrilha.length > 0 && daTrilha.every((n) => desbloqueados.has(n.id));
  };

  return { carregando, nos, desbloqueados, medalhas, completa };
}
