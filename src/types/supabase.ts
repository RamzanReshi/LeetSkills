export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  leetskill: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          role: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          role?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string | null;
          full_name?: string | null;
          role?: string | null;
          avatar_url?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      completed_attempts: {
        Row: {
          id: string;
          user_id: string;
          scenario_id: string;
          path_id: string;
          difficulty: string;
          thinking_trace: string;
          final_response: string;
          score: number;
          skill_scores: Json;
          ai_feedback: Json;
          fingerprint_before: Json;
          fingerprint_after: Json;
          fallback_used: boolean;
          error_state: Json | null;
          started_at: string;
          submitted_at: string;
          evaluated_at: string;
          completed_at: string;
          created_at: string;
        };
        Insert: {
          id: string;
          user_id: string;
          scenario_id: string;
          path_id: string;
          difficulty: string;
          thinking_trace?: string;
          final_response?: string;
          score: number;
          skill_scores: Json;
          ai_feedback: Json;
          fingerprint_before: Json;
          fingerprint_after: Json;
          fallback_used?: boolean;
          error_state?: Json | null;
          started_at: string;
          submitted_at: string;
          evaluated_at: string;
          completed_at: string;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["leetskill"]["Tables"]["profiles"]["Row"];
