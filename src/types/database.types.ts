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
      amenities: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          changed_at: string
          changed_by: string | null
          changed_data: string | null
          id: number
          operation: string
          record_id: number
          table_name: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          changed_data?: string | null
          id?: number
          operation: string
          record_id: number
          table_name: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          changed_data?: string | null
          id?: number
          operation?: string
          record_id?: number
          table_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "vw_user"
            referencedColumns: ["user_id"]
          },
        ]
      }
      booking_schedule: {
        Row: {
          booking_id: number
          date: string
          end_time: string
          id: number
          start_time: string
        }
        Insert: {
          booking_id: number
          date: string
          end_time: string
          id?: never
          start_time: string
        }
        Update: {
          booking_id?: number
          date?: string
          end_time?: string
          id?: never
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_schedule_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_statuses: {
        Row: {
          id: number
          status: string
        }
        Insert: {
          id?: number
          status: string
        }
        Update: {
          id?: number
          status?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_status_id: number | null
          created_at: string | null
          id: number
          is_deleted: boolean
          payment_status_id: number | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
          venue_id: number
        }
        Insert: {
          booking_status_id?: number | null
          created_at?: string | null
          id?: number
          is_deleted?: boolean
          payment_status_id?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
          venue_id: number
        }
        Update: {
          booking_status_id?: number | null
          created_at?: string | null
          id?: number
          is_deleted?: boolean
          payment_status_id?: number | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
          venue_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "bookings_booking_status_id_fkey"
            columns: ["booking_status_id"]
            isOneToOne: false
            referencedRelation: "booking_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_payment_status_id_fkey"
            columns: ["payment_status_id"]
            isOneToOne: false
            referencedRelation: "payment_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "vw_user"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "bookings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "vw_manager"
            referencedColumns: ["venue_id"]
          },
        ]
      }
      lgu: {
        Row: {
          address: string | null
          contact_info: string | null
          id: number
          name: string
        }
        Insert: {
          address?: string | null
          contact_info?: string | null
          id?: number
          name: string
        }
        Update: {
          address?: string | null
          contact_info?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      notification_types: {
        Row: {
          id: number
          type: string
        }
        Insert: {
          id?: number
          type: string
        }
        Update: {
          id?: number
          type?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: number
          is_deleted: boolean
          is_read: boolean
          message: string
          notification_type_id: number
          recipient_id: string
          related_booking_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_deleted?: boolean
          is_read?: boolean
          message: string
          notification_type_id: number
          recipient_id: string
          related_booking_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          is_deleted?: boolean
          is_read?: boolean
          message?: string
          notification_type_id?: number
          recipient_id?: string
          related_booking_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_notification_type_id_fkey"
            columns: ["notification_type_id"]
            isOneToOne: false
            referencedRelation: "notification_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "vw_user"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_related_booking_id_fkey"
            columns: ["related_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_modes: {
        Row: {
          id: number
          mode: string
        }
        Insert: {
          id?: number
          mode: string
        }
        Update: {
          id?: number
          mode?: string
        }
        Relationships: []
      }
      payment_statuses: {
        Row: {
          id: number
          status: string
        }
        Insert: {
          id?: number
          status: string
        }
        Update: {
          id?: number
          status?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          booking_id: number
          confirmation_status: boolean
          created_at: string
          currency_code: string
          id: number
          is_deleted: boolean
          is_down_payment: boolean
          payment_date: string
          payment_mode_id: number
          transaction_reference: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id: number
          confirmation_status?: boolean
          created_at?: string
          currency_code?: string
          id?: number
          is_deleted?: boolean
          is_down_payment?: boolean
          payment_date?: string
          payment_mode_id: number
          transaction_reference?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: number
          confirmation_status?: boolean
          created_at?: string
          currency_code?: string
          id?: number
          is_deleted?: boolean
          is_down_payment?: boolean
          payment_date?: string
          payment_mode_id?: number
          transaction_reference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_payment_mode_id_fkey"
            columns: ["payment_mode_id"]
            isOneToOne: false
            referencedRelation: "payment_modes"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          affiliation: string | null
          created_at: string
          id: string
          is_deleted: boolean
          name: string | null
          phone_number: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          affiliation?: string | null
          created_at?: string
          id: string
          is_deleted?: boolean
          name?: string | null
          phone_number?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          affiliation?: string | null
          created_at?: string
          id?: string
          is_deleted?: boolean
          name?: string | null
          phone_number?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      venue_amenities: {
        Row: {
          amenity_id: number
          venue_id: number
        }
        Insert: {
          amenity_id: number
          venue_id: number
        }
        Update: {
          amenity_id?: number
          venue_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "venue_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_amenities_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "venues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venue_amenities_venue_id_fkey"
            columns: ["venue_id"]
            isOneToOne: false
            referencedRelation: "vw_manager"
            referencedColumns: ["venue_id"]
          },
        ]
      }
      venue_types: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      venues: {
        Row: {
          created_at: string
          id: number
          is_deleted: boolean
          is_paid: boolean
          lgu_id: number | null
          location: string
          manager_id: string
          name: string
          rate: number | null
          updated_at: string
          venue_photo: string | null
          venue_type_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          is_deleted?: boolean
          is_paid?: boolean
          lgu_id?: number | null
          location: string
          manager_id: string
          name: string
          rate?: number | null
          updated_at?: string
          venue_photo?: string | null
          venue_type_id: number
        }
        Update: {
          created_at?: string
          id?: number
          is_deleted?: boolean
          is_paid?: boolean
          lgu_id?: number | null
          location?: string
          manager_id?: string
          name?: string
          rate?: number | null
          updated_at?: string
          venue_photo?: string | null
          venue_type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "venues_lgu_id_fkey"
            columns: ["lgu_id"]
            isOneToOne: false
            referencedRelation: "lgu"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venues_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "venues_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "vw_user"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "venues_venue_type_id_fkey"
            columns: ["venue_type_id"]
            isOneToOne: false
            referencedRelation: "venue_types"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vw_manager: {
        Row: {
          created_at: string | null
          is_paid: boolean | null
          location: string | null
          manager_name: string | null
          rate: number | null
          updated_at: string | null
          venue_id: number | null
          venue_name: string | null
          venue_type: string | null
        }
        Relationships: []
      }
      vw_user: {
        Row: {
          affiliation: string | null
          created_at: string | null
          name: string | null
          phone_number: string | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          affiliation?: string | null
          created_at?: string | null
          name?: string | null
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          affiliation?: string | null
          created_at?: string | null
          name?: string | null
          phone_number?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
