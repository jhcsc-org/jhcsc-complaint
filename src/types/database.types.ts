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
            referencedRelation: "admin_report_view"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_documents_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "citizen_notifications_view"
            referencedColumns: ["complaint_id"]
          },
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
            foreignKeyName: "complaint_documents_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "lupon_report_view"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_documents_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "report_lupon_documentation"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_documents_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "report_lupon_member_complaints"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_documents_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "report_lupon_participant_details"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_documents_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "report_lupon_resolution_times"
            referencedColumns: ["complaint_id"]
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
            foreignKeyName: "complaint_history_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "admin_report_view"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_history_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "citizen_notifications_view"
            referencedColumns: ["complaint_id"]
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
          {
            foreignKeyName: "complaint_history_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "lupon_report_view"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_history_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "report_lupon_documentation"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_history_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "report_lupon_member_complaints"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_history_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "report_lupon_participant_details"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_history_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "report_lupon_resolution_times"
            referencedColumns: ["complaint_id"]
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
            foreignKeyName: "complaint_participants_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "admin_report_view"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_participants_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "citizen_notifications_view"
            referencedColumns: ["complaint_id"]
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
            foreignKeyName: "complaint_participants_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "lupon_report_view"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_participants_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "report_lupon_documentation"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_participants_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "report_lupon_member_complaints"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_participants_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "report_lupon_participant_details"
            referencedColumns: ["complaint_id"]
          },
          {
            foreignKeyName: "complaint_participants_complaint_id_fkey"
            columns: ["complaint_id"]
            isOneToOne: false
            referencedRelation: "report_lupon_resolution_times"
            referencedColumns: ["complaint_id"]
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
            referencedRelation: "citizen_dashboard_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "lupon_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["user_id"]
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
          address: string | null
          barangay_id: string | null
          created_at: string | null
          first_name: string
          last_name: string | null
          middle_name: string | null
          role_id: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          barangay_id?: string | null
          created_at?: string | null
          first_name: string
          last_name?: string | null
          middle_name?: string | null
          role_id?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Update: {
          address?: string | null
          barangay_id?: string | null
          created_at?: string | null
          first_name?: string
          last_name?: string | null
          middle_name?: string | null
          role_id?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_barangay_id_fkey"
            columns: ["barangay_id"]
            isOneToOne: false
            referencedRelation: "barangays"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "user_roles"
            referencedColumns: ["role_id"]
          },
        ]
      }
    }
    Views: {
      admin_dashboard_view: {
        Row: {
          active_users: Json | null
          avg_resolution_time_days: number | null
          complaint_trends_last_12_months: Json | null
          complaints_by_barangay: Json | null
          complaints_by_type: Json | null
          dismissed_complaints: number | null
          in_process_complaints: number | null
          pending_complaints: number | null
          recent_complaints: Json | null
          resolved_complaints: number | null
          sla_compliance_percentage: number | null
          total_admins: number | null
          total_citizens: number | null
          total_complaints: number | null
          total_lupon_members: number | null
          total_users: number | null
          user_growth_trends_last_12_months: Json | null
          users_by_province: Json | null
        }
        Relationships: []
      }
      admin_report_view: {
        Row: {
          barangay_name: string | null
          case_number: string | null
          case_title: string | null
          complaint_description: string | null
          complaint_id: string | null
          complaint_type: string | null
          created_at: string | null
          date_filed: string | null
          documents: Json | null
          filed_by: string | null
          history: Json | null
          municipality_name: string | null
          participants: Json | null
          resolution_date: string | null
          status: Database["public"]["Enums"]["complaint_status"] | null
          updated_at: string | null
        }
        Relationships: []
      }
      citizen_dashboard_view: {
        Row: {
          avg_resolution_time_days: number | null
          complaint_trends_last_12_months: Json | null
          dismissed_complaints: number | null
          first_name: string | null
          in_process_complaints: number | null
          last_name: string | null
          pending_complaints: number | null
          recent_complaints: Json | null
          resolved_complaints: number | null
          top_complaint_types: Json | null
          total_complaints: number | null
          user_id: string | null
        }
        Relationships: []
      }
      citizen_notifications_view: {
        Row: {
          action_date: string | null
          case_number: string | null
          complaint_id: string | null
          notification: string | null
        }
        Relationships: []
      }
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
      lupon_member_dashboard_view: {
        Row: {
          avg_resolution_time_days: number | null
          barangay_name: string | null
          complaint_trends_last_12_months: Json | null
          dismissed_complaints: number | null
          first_name: string | null
          in_process_complaints: number | null
          last_name: string | null
          lupon_member_id: string | null
          participants_in_recent_complaints: Json | null
          pending_complaints: number | null
          recent_complaints: Json | null
          resolved_complaints: number | null
          top_complaint_types: Json | null
          total_complaints: number | null
        }
        Relationships: []
      }
      lupon_report_view: {
        Row: {
          barangay_name: string | null
          case_number: string | null
          case_title: string | null
          complaint_description: string | null
          complaint_id: string | null
          complaint_type: string | null
          created_at: string | null
          date_filed: string | null
          documents: Json | null
          filed_by: string | null
          history: Json | null
          participants: Json | null
          resolution_date: string | null
          status: Database["public"]["Enums"]["complaint_status"] | null
          updated_at: string | null
        }
        Relationships: []
      }
      report_lupon_complaint_summary: {
        Row: {
          avg_resolution_time_days: number | null
          barangay_name: string | null
          complaint_trends_last_12_months: Json | null
          dismissed_complaints: number | null
          first_name: string | null
          in_process_complaints: number | null
          last_name: string | null
          lupon_member_id: string | null
          pending_complaints: number | null
          resolved_complaints: number | null
          top_complaint_types: Json | null
          total_complaints: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lupon_members_user_id_fkey"
            columns: ["lupon_member_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "lupon_members_user_id_fkey"
            columns: ["lupon_member_id"]
            isOneToOne: false
            referencedRelation: "citizen_dashboard_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "lupon_members_user_id_fkey"
            columns: ["lupon_member_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["user_id"]
          },
        ]
      }
      report_lupon_complaint_trends: {
        Row: {
          complaint_count: number | null
          month: string | null
        }
        Relationships: []
      }
      report_lupon_documentation: {
        Row: {
          complaint_id: string | null
          document_id: string | null
          file_name: string | null
          file_path: string | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Relationships: []
      }
      report_lupon_member_activity: {
        Row: {
          avg_resolution_time_days: number | null
          complaints_handled: number | null
          first_name: string | null
          last_name: string | null
          lupon_member_id: string | null
          resolved_complaints: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lupon_members_user_id_fkey"
            columns: ["lupon_member_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "lupon_members_user_id_fkey"
            columns: ["lupon_member_id"]
            isOneToOne: false
            referencedRelation: "citizen_dashboard_view"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "lupon_members_user_id_fkey"
            columns: ["lupon_member_id"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["user_id"]
          },
        ]
      }
      report_lupon_member_complaints: {
        Row: {
          barangay_name: string | null
          case_number: string | null
          case_title: string | null
          complaint_description: string | null
          complaint_id: string | null
          complaint_type: string | null
          created_at: string | null
          date_filed: string | null
          documents: Json | null
          filed_by: string | null
          history: Json | null
          participants: Json | null
          resolution_date: string | null
          status: Database["public"]["Enums"]["complaint_status"] | null
          updated_at: string | null
        }
        Relationships: []
      }
      report_lupon_participant_details: {
        Row: {
          complaint_id: string | null
          contact_info: string | null
          participant_id: string | null
          participant_name: string | null
          role: string | null
        }
        Relationships: []
      }
      report_lupon_resolution_times: {
        Row: {
          case_number: string | null
          case_title: string | null
          complaint_id: string | null
          date_filed: string | null
          resolution_date: string | null
          resolution_time_days: number | null
        }
        Relationships: []
      }
      user_profile: {
        Row: {
          address: string | null
          barangay_name: string | null
          created_at: string | null
          email: string | null
          first_name: string | null
          last_name: string | null
          middle_name: string | null
          municipality_name: string | null
          province_name: string | null
          role_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      bytea_to_text: {
        Args: {
          data: string
        }
        Returns: string
      }
      http: {
        Args: {
          request: Database["public"]["CompositeTypes"]["http_request"]
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_delete:
        | {
            Args: {
              uri: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
      http_get:
        | {
            Args: {
              uri: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
      http_head: {
        Args: {
          uri: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_header: {
        Args: {
          field: string
          value: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_post:
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: Database["public"]["CompositeTypes"]["http_response"]
          }
      http_put: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_response"]
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: {
          curlopt: string
          value: string
        }
        Returns: boolean
      }
      text_to_bytea: {
        Args: {
          data: string
        }
        Returns: string
      }
      urlencode:
        | {
            Args: {
              data: Json
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
    }
    Enums: {
      complaint_status: "PENDING" | "IN_PROCESS" | "RESOLVED" | "DISMISSED"
      COMPLAINT_STATUS: "PENDING" | "IN_PROCESS" | "RESOLVED" | "DISMISSED"
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
