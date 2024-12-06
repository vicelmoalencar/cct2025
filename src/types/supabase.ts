export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: number
          name: string
          avatar_url: string | null
          role: 'user' | 'instructor' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: number
          name: string
          avatar_url?: string | null
          role?: 'user' | 'instructor' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          avatar_url?: string | null
          role?: 'user' | 'instructor' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: number
          title: string
          description: string | null
          thumbnail_url: string | null
          level: 'beginner' | 'intermediate' | 'advanced'
          price: number
          instructor_id: number
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          thumbnail_url?: string | null
          level?: 'beginner' | 'intermediate' | 'advanced'
          price: number
          instructor_id: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          level?: 'beginner' | 'intermediate' | 'advanced'
          price?: number
          instructor_id?: number
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      course_modules: {
        Row: {
          id: number
          course_id: number
          title: string
          description: string | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          course_id: number
          title: string
          description?: string | null
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          course_id?: number
          title?: string
          description?: string | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      lessons: {
        Row: {
          id: number
          module_id: number
          title: string
          content: string | null
          video_url: string | null
          duration_minutes: number | null
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          module_id: number
          title: string
          content?: string | null
          video_url?: string | null
          duration_minutes?: number | null
          order_index: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          module_id?: number
          title?: string
          content?: string | null
          video_url?: string | null
          duration_minutes?: number | null
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      course_stats: {
        Row: {
          course_id: number
          course_title: string
          total_students: number
          total_reviews: number
          average_rating: number
          total_favorites: number
        }
      }
    }
    Functions: {
      calculate_course_progress: {
        Args: {
          p_user_id: number
          p_course_id: number
        }
        Returns: number
      }
    }
  }
}
