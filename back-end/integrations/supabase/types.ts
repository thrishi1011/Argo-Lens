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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          created_at: string
          description: string | null
          field_id: string | null
          id: string
          is_resolved: boolean | null
          metrics: Json | null
          recommendations: string[] | null
          resolved_at: string | null
          severity: Database["public"]["Enums"]["severity_level"]
          title: string
          type: Database["public"]["Enums"]["alert_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          field_id?: string | null
          id?: string
          is_resolved?: boolean | null
          metrics?: Json | null
          recommendations?: string[] | null
          resolved_at?: string | null
          severity: Database["public"]["Enums"]["severity_level"]
          title: string
          type: Database["public"]["Enums"]["alert_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          field_id?: string | null
          id?: string
          is_resolved?: boolean | null
          metrics?: Json | null
          recommendations?: string[] | null
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["severity_level"]
          title?: string
          type?: Database["public"]["Enums"]["alert_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
        ]
      }
      fields: {
        Row: {
          area: number
          created_at: string
          crop_type: string
          geometry: Json | null
          id: string
          name: string
          planting_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          area: number
          created_at?: string
          crop_type: string
          geometry?: Json | null
          id?: string
          name: string
          planting_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          area?: number
          created_at?: string
          crop_type?: string
          geometry?: Json | null
          id?: string
          name?: string
          planting_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      predictions: {
        Row: {
          confidence: number | null
          created_at: string
          field_id: string
          id: string
          input_data: Json | null
          model_type: string
          prediction: Json
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          field_id: string
          id?: string
          input_data?: Json | null
          model_type: string
          prediction: Json
        }
        Update: {
          confidence?: number | null
          created_at?: string
          field_id?: string
          id?: string
          input_data?: Json | null
          model_type?: string
          prediction?: Json
        }
        Relationships: [
          {
            foreignKeyName: "predictions_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          farm_location: Json | null
          farm_name: string | null
          full_name: string | null
          id: string
          total_area: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          farm_location?: Json | null
          farm_name?: string | null
          full_name?: string | null
          id?: string
          total_area?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          farm_location?: Json | null
          farm_name?: string | null
          full_name?: string | null
          id?: string
          total_area?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      satellite_data: {
        Row: {
          captured_at: string
          cloud_cover: number | null
          evi: number | null
          field_id: string
          health_score: number | null
          id: string
          image_url: string | null
          ndvi: number | null
          processed_at: string
          savi: number | null
        }
        Insert: {
          captured_at: string
          cloud_cover?: number | null
          evi?: number | null
          field_id: string
          health_score?: number | null
          id?: string
          image_url?: string | null
          ndvi?: number | null
          processed_at?: string
          savi?: number | null
        }
        Update: {
          captured_at?: string
          cloud_cover?: number | null
          evi?: number | null
          field_id?: string
          health_score?: number | null
          id?: string
          image_url?: string | null
          ndvi?: number | null
          processed_at?: string
          savi?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "satellite_data_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
        ]
      }
      sensor_readings: {
        Row: {
          field_id: string
          humidity: number | null
          id: string
          light_intensity: number | null
          nitrogen: number | null
          ph_level: number | null
          phosphorus: number | null
          potassium: number | null
          recorded_at: string
          soil_moisture: number | null
          temperature: number | null
        }
        Insert: {
          field_id: string
          humidity?: number | null
          id?: string
          light_intensity?: number | null
          nitrogen?: number | null
          ph_level?: number | null
          phosphorus?: number | null
          potassium?: number | null
          recorded_at?: string
          soil_moisture?: number | null
          temperature?: number | null
        }
        Update: {
          field_id?: string
          humidity?: number | null
          id?: string
          light_intensity?: number | null
          nitrogen?: number | null
          ph_level?: number | null
          phosphorus?: number | null
          potassium?: number | null
          recorded_at?: string
          soil_moisture?: number | null
          temperature?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sensor_readings_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
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
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      alert_type:
        | "pest_risk"
        | "disease_detected"
        | "water_stress"
        | "nutrient_deficiency"
        | "weather_alert"
      severity_level: "low" | "medium" | "high" | "critical"
      user_role: "farmer" | "agronomist" | "admin"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      alert_type: [
        "pest_risk",
        "disease_detected",
        "water_stress",
        "nutrient_deficiency",
        "weather_alert",
      ],
      severity_level: ["low", "medium", "high", "critical"],
      user_role: ["farmer", "agronomist", "admin"],
    },
  },
} as const
