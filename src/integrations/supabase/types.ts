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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      application_answers: {
        Row: {
          answer_key: string | null
          answer_text: string | null
          application_id: string
          created_at: string | null
          id: string
          is_correct: boolean | null
          question_id: string | null
        }
        Insert: {
          answer_key?: string | null
          answer_text?: string | null
          application_id: string
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
        }
        Update: {
          answer_key?: string | null
          answer_text?: string | null
          application_id?: string
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_answers_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "job_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      careers_settings: {
        Row: {
          id: number
          notification_email: string | null
          notifications_enabled: boolean | null
        }
        Insert: {
          id?: number
          notification_email?: string | null
          notifications_enabled?: boolean | null
        }
        Update: {
          id?: number
          notification_email?: string | null
          notifications_enabled?: boolean | null
        }
        Relationships: []
      }
      game_scores: {
        Row: {
          created_at: string
          id: string
          initials: string
          player_id: string | null
          rank_name: string
          score: number
        }
        Insert: {
          created_at?: string
          id?: string
          initials: string
          player_id?: string | null
          rank_name: string
          score: number
        }
        Update: {
          created_at?: string
          id?: string
          initials?: string
          player_id?: string | null
          rank_name?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "game_scores_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          about: string | null
          admin_notes: string | null
          admin_notified_at: string | null
          applicant_notified_at: string | null
          availability: string | null
          consent_at: string | null
          created_at: string | null
          cv_path: string | null
          email: string
          full_name: string
          gdpr_consent: boolean
          id: string
          location: string | null
          phone: string | null
          quiz_correct: number | null
          quiz_score_pct: number | null
          quiz_total: number | null
          right_to_work_uk: boolean | null
          role_id: string | null
          role_title: string | null
          status: string
        }
        Insert: {
          about?: string | null
          admin_notes?: string | null
          admin_notified_at?: string | null
          applicant_notified_at?: string | null
          availability?: string | null
          consent_at?: string | null
          created_at?: string | null
          cv_path?: string | null
          email: string
          full_name: string
          gdpr_consent: boolean
          id?: string
          location?: string | null
          phone?: string | null
          quiz_correct?: number | null
          quiz_score_pct?: number | null
          quiz_total?: number | null
          right_to_work_uk?: boolean | null
          role_id?: string | null
          role_title?: string | null
          status?: string
        }
        Update: {
          about?: string | null
          admin_notes?: string | null
          admin_notified_at?: string | null
          applicant_notified_at?: string | null
          availability?: string | null
          consent_at?: string | null
          created_at?: string | null
          cv_path?: string | null
          email?: string
          full_name?: string
          gdpr_consent?: boolean
          id?: string
          location?: string | null
          phone?: string | null
          quiz_correct?: number | null
          quiz_score_pct?: number | null
          quiz_total?: number | null
          right_to_work_uk?: boolean | null
          role_id?: string | null
          role_title?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "job_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_roles: {
        Row: {
          created_at: string | null
          date_posted: string | null
          description: string | null
          employment_type: string | null
          hours: string | null
          id: string
          is_open: boolean | null
          location: string | null
          pay: string | null
          perks: string[] | null
          requirements: string[] | null
          responsibilities: string[] | null
          slug: string
          sort_order: number | null
          summary: string | null
          team: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_posted?: string | null
          description?: string | null
          employment_type?: string | null
          hours?: string | null
          id?: string
          is_open?: boolean | null
          location?: string | null
          pay?: string | null
          perks?: string[] | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          slug: string
          sort_order?: number | null
          summary?: string | null
          team?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_posted?: string | null
          description?: string | null
          employment_type?: string | null
          hours?: string | null
          id?: string
          is_open?: boolean | null
          location?: string | null
          pay?: string | null
          perks?: string[] | null
          requirements?: string[] | null
          responsibilities?: string[] | null
          slug?: string
          sort_order?: number | null
          summary?: string | null
          team?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      players: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          marketing_opt_in: boolean
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          marketing_opt_in?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          marketing_opt_in?: boolean
        }
        Relationships: []
      }
      quiz_answer_keys: {
        Row: {
          correct_key: string
          question_id: string
        }
        Insert: {
          correct_key: string
          question_id: string
        }
        Update: {
          correct_key?: string
          question_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answer_keys_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: true
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          applies_to: string[]
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          level: string
          options: Json | null
          prompt: string
          required: boolean | null
          required_for: string[] | null
          sort_order: number | null
        }
        Insert: {
          applies_to?: string[]
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          level: string
          options?: Json | null
          prompt: string
          required?: boolean | null
          required_for?: string[] | null
          sort_order?: number | null
        }
        Update: {
          applies_to?: string[]
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          level?: string
          options?: Json | null
          prompt?: string
          required?: boolean | null
          required_for?: string[] | null
          sort_order?: number | null
        }
        Relationships: []
      }
      reward_codes: {
        Row: {
          code: string
          expires_at: string
          id: string
          issued_at: string
          player_id: string
          rank_name: string
          redeemed_at: string | null
          redeemed_location: string | null
          reward_label: string
          score: number
        }
        Insert: {
          code: string
          expires_at: string
          id?: string
          issued_at?: string
          player_id: string
          rank_name: string
          redeemed_at?: string | null
          redeemed_location?: string | null
          reward_label: string
          score: number
        }
        Update: {
          code?: string
          expires_at?: string
          id?: string
          issued_at?: string
          player_id?: string
          rank_name?: string
          redeemed_at?: string | null
          redeemed_location?: string | null
          reward_label?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "reward_codes_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      submit_application: { Args: { payload: Json }; Returns: string }
    }
    Enums: {
      app_role: "admin"
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
      app_role: ["admin"],
    },
  },
} as const
