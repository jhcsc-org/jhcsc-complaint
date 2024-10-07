export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      barangays: {
        Row: {
          id: string
          municipality_id: number | null
          name: string
        }
        Insert: {
          id?: string
          municipality_id?: number | null
          name: string
        }
        Update: {
          id?: string
          municipality_id?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "barangays_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["municipality_id"]
          },
        ]
      }
      complaint_documents: {
        Row: {
          complaint_id: string | null
          created_at: string | null
          document_id: string
          file_name: string
          file_path: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          complaint_id?: string | null
          created_at?: string | null
          document_id?: string
          file_name: string
          file_path: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          complaint_id?: string | null
          created_at?: string | null
          document_id?: string
          file_name?: string
          file_path?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "complaint_documents_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaint_view"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_documents_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaint_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      complaint_history: {
        Row: {
          action_by: string | null
          action_date: string | null
          action_taken: string
          complaint_id: string | null
          created_at: string | null
          history_id: string
        }
        Insert: {
          action_by?: string | null
          action_date?: string | null
          action_taken: string
          complaint_id?: string | null
          created_at?: string | null
          history_id?: string
        }
        Update: {
          action_by?: string | null
          action_date?: string | null
          action_taken?: string
          complaint_id?: string | null
          created_at?: string | null
          history_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "complaint_history_action_by_fkey"
            columns: ["action_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaint_history_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaint_view"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_history_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
        ]
      }
      complaint_participants: {
        Row: {
          added_by: string | null
          complaint_id: string | null
          created_at: string | null
          participant_id: string
          person_id: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          added_by?: string | null
          complaint_id?: string | null
          created_at?: string | null
          participant_id?: string
          person_id?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          added_by?: string | null
          complaint_id?: string | null
          created_at?: string | null
          participant_id?: string
          person_id?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "complaint_participants_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaint_participants_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaint_view"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_participants_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "complaints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaint_participants_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["person_id"]
          },
        ]
      }
      complaint_types: {
        Row: {
          complaint_type_id: string
          description: string
        }
        Insert: {
          complaint_type_id?: string
          description: string
        }
        Update: {
          complaint_type_id?: string
          description?: string
        }
        Relationships: []
      }
      complaints: {
        Row: {
          barangay_id: string | null
          case_number: string | null
          case_title: string
          complaint_type_id: string | null
          created_at: string | null
          date_filed: string
          description: string
          filed_by: string | null
          id: string
          resolution_date: string | null
          status: Database["public"]["Enums"]["complaint_status"]
          updated_at: string | null
        }
        Insert: {
          barangay_id?: string | null
          case_number?: string | null
          case_title: string
          complaint_type_id?: string | null
          created_at?: string | null
          date_filed?: string
          description: string
          filed_by?: string | null
          id?: string
          resolution_date?: string | null
          status?: Database["public"]["Enums"]["complaint_status"]
          updated_at?: string | null
        }
        Update: {
          barangay_id?: string | null
          case_number?: string | null
          case_title?: string
          complaint_type_id?: string | null
          created_at?: string | null
          date_filed?: string
          description?: string
          filed_by?: string | null
          id?: string
          resolution_date?: string | null
          status?: Database["public"]["Enums"]["complaint_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "complaints_barangay_id_fkey"
            columns: ["barangay_id"]
            isOneToOne: false
            referencedRelation: "barangays"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_complaint_type_id_fkey"
            columns: ["complaint_type_id"]
            isOneToOne: false
            referencedRelation: "complaint_types"
            referencedColumns: ["complaint_type_id"]
          },
          {
            foreignKeyName: "complaints_filed_by_fkey"
            columns: ["filed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lupon_members: {
        Row: {
          barangay_id: string | null
          created_at: string | null
          lupon_member_id: string
          position: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          barangay_id?: string | null
          created_at?: string | null
          lupon_member_id?: string
          position?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          barangay_id?: string | null
          created_at?: string | null
          lupon_member_id?: string
          position?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lupon_members_barangay_id_fkey"
            columns: ["barangay_id"]
            isOneToOne: false
            referencedRelation: "barangays"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lupon_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      municipalities: {
        Row: {
          municipality_id: number
          name: string
          province_id: number | null
        }
        Insert: {
          municipality_id?: never
          name: string
          province_id?: number | null
        }
        Update: {
          municipality_id?: never
          name?: string
          province_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "municipalities_province_id_fkey"
            columns: ["province_id"]
            isOneToOne: false
            referencedRelation: "provinces"
            referencedColumns: ["province_id"]
          },
        ]
      }
      people: {
        Row: {
          address: string | null
          contact_info: string | null
          created_at: string | null
          first_name: string
          last_name: string
          person_id: string
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          contact_info?: string | null
          created_at?: string | null
          first_name: string
          last_name: string
          person_id?: string
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          contact_info?: string | null
          created_at?: string | null
          first_name?: string
          last_name?: string
          person_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      provinces: {
        Row: {
          name: string
          province_id: number
        }
        Insert: {
          name: string
          province_id?: never
        }
        Update: {
          name?: string
          province_id?: never
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          role_id: number
          role_name: string
        }
        Insert: {
          role_id?: never
          role_name: string
        }
        Update: {
          role_id?: never
          role_name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          person_id: number | null
          role_id: number | null
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          person_id?: number | null
          role_id?: number | null
          updated_at?: string | null
          user_id?: string
          username: string
        }
        Update: {
          created_at?: string | null
          person_id?: number | null
          role_id?: number | null
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      complaint_view: {
        Row: {
          barangay_name: string | null
          case_number: string | null
          case_title: string | null
          complaint_description: string | null
          complaint_id: string | null
          complaint_type: string | null
          date_filed: string | null
          documents: Json | null
          history: Json | null
          participants: Json | null
          resolution_date: string | null
          status: Database["public"]["Enums"]["complaint_status"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      complaint_status: "PENDING" | "IN_PROCESS" | "RESOLVED" | "DISMISSED"
      COMPLAINT_STATUS: "PENDING" | "IN_PROCESS" | "RESOLVED" | "DISMISSED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
