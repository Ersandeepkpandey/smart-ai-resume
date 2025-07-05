import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key-here'

// Check if we have valid Supabase credentials
const isSupabaseConfigured = supabaseUrl &&
                            supabaseAnonKey &&
                            supabaseUrl.includes('supabase.co') &&
                            supabaseAnonKey.length > 50

// Client-side Supabase client
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => {
  return supabaseUrl &&
         supabaseAnonKey &&
         supabaseUrl.includes('supabase.co') &&
         supabaseAnonKey.length > 50
}

// Server-side Supabase client (supports cookies for Next.js App Router)
export const createServerClient = (options?: { cookies?: () => any }) => {
  if (options && typeof options.cookies === 'function') {
    // For Next.js App Router: pass cookies getter for SSR session support
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: {
          getItem: async (key: string) => {
            const cookieStore = options.cookies && options.cookies()
            return cookieStore?.get(key)?.value || null
          },
          setItem: async () => {},
          removeItem: async () => {},
        },
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }
  // Default: no cookies
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: string
          status: string
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          status?: string
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          status?: string
          last_login?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      resumes: {
        Row: {
          id: string
          user_id: string
          title: string
          template_id: string
          content: any
          ats_score: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          template_id: string
          content: any
          ats_score?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          template_id?: string
          content?: any
          ats_score?: number
          created_at?: string
          updated_at?: string
        }
      }
      templates: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          status: string
          html_content: string
          css_styles: string | null
          preview_image: string | null
          usage_count: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category?: string
          status?: string
          html_content: string
          css_styles?: string | null
          preview_image?: string | null
          usage_count?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          status?: string
          html_content?: string
          css_styles?: string | null
          preview_image?: string | null
          usage_count?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}