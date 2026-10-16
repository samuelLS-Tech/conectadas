export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      atividades: {
        Row: {
          acertos: number
          atividade_ref: string
          created_at: string
          disciplina: string
          estudante_id: string
          id: string
          status: string
          titulo: string
          total: number
          validada_em: string | null
          validada_por: string | null
          xp: number
        }
        Insert: {
          acertos: number
          atividade_ref: string
          created_at?: string
          disciplina: string
          estudante_id?: string
          id?: string
          status?: string
          titulo: string
          total: number
          validada_em?: string | null
          validada_por?: string | null
          xp?: number
        }
        Update: {
          acertos?: number
          atividade_ref?: string
          created_at?: string
          disciplina?: string
          estudante_id?: string
          id?: string
          status?: string
          titulo?: string
          total?: number
          validada_em?: string | null
          validada_por?: string | null
          xp?: number
        }
        Relationships: []
      }
      empresa_interesses: {
        Row: {
          created_at: string
          empresa_id: string
          empresa_nome: string
          estudante_id: string
          id: string
          oportunidade: string | null
        }
        Insert: {
          created_at?: string
          empresa_id?: string
          empresa_nome: string
          estudante_id: string
          id?: string
          oportunidade?: string | null
        }
        Update: {
          created_at?: string
          empresa_id?: string
          empresa_nome?: string
          estudante_id?: string
          id?: string
          oportunidade?: string | null
        }
        Relationships: []
      }
      monitoria_interesses: {
        Row: {
          created_at: string
          id: string
          interessada_id: string
          interessada_nome: string
          oferta_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interessada_id?: string
          interessada_nome: string
          oferta_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interessada_id?: string
          interessada_nome?: string
          oferta_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "monitoria_interesses_oferta_id_fkey"
            columns: ["oferta_id"]
            isOneToOne: false
            referencedRelation: "monitoria_ofertas"
            referencedColumns: ["id"]
          },
        ]
      }
      monitoria_ofertas: {
        Row: {
          assunto: string
          autora_id: string
          autora_nome: string
          created_at: string
          disciplina: string
          id: string
          tipo: string
        }
        Insert: {
          assunto: string
          autora_id?: string
          autora_nome: string
          created_at?: string
          disciplina: string
          id?: string
          tipo: string
        }
        Update: {
          assunto?: string
          autora_id?: string
          autora_nome?: string
          created_at?: string
          disciplina?: string
          id?: string
          tipo?: string
        }
        Relationships: []
      }
      monitoria_sessoes: {
        Row: {
          created_at: string
          criadora_confirmou: boolean
          criadora_id: string
          id: string
          materia: string
          monitora_confirmou: boolean
          monitora_id: string | null
          monitora_nome: string
        }
        Insert: {
          created_at?: string
          criadora_confirmou?: boolean
          criadora_id?: string
          id?: string
          materia: string
          monitora_confirmou?: boolean
          monitora_id?: string | null
          monitora_nome: string
        }
        Update: {
          created_at?: string
          criadora_confirmou?: boolean
          criadora_id?: string
          id?: string
          materia?: string
          monitora_confirmou?: boolean
          monitora_id?: string | null
          monitora_nome?: string
        }
        Relationships: []
      }
      notificacoes: {
        Row: {
          created_at: string
          id: string
          lida: boolean
          texto: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lida?: boolean
          texto: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lida?: boolean
          texto?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          atividades_concluidas: string[]
          created_at: string
          disciplina: string | null
          escola_id: string | null
          exercicios: number
          horas: number
          id: string
          lideranca: number
          monitorias: number
          nome: string
          serie: string | null
          turma: string | null
          xp: number
        }
        Insert: {
          atividades_concluidas?: string[]
          created_at?: string
          disciplina?: string | null
          escola_id?: string | null
          exercicios?: number
          horas?: number
          id: string
          lideranca?: number
          monitorias?: number
          nome?: string
          serie?: string | null
          turma?: string | null
          xp?: number
        }
        Update: {
          atividades_concluidas?: string[]
          created_at?: string
          disciplina?: string | null
          escola_id?: string | null
          exercicios?: number
          horas?: number
          id?: string
          lideranca?: number
          monitorias?: number
          nome?: string
          serie?: string | null
          turma?: string | null
          xp?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      confirmar_monitoria: { Args: { _sessao: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      listar_talentos: {
        Args: never
        Returns: {
          escola_id: string
          id: string
          monitorias: number
          nome: string
          serie: string
          turma: string
          xp: number
        }[]
      }
      minha_escola: { Args: never; Returns: string }
      validar_atividade: {
        Args: { _aprovar: boolean; _id: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "estudante" | "empresa" | "professor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["estudante", "empresa", "professor"],
    },
  },
} as const
