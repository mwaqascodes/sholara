import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  }
})

export type UserRole = 'super_admin' | 'school_admin' | 'admin' | 'teacher' | 'parent' | 'student'

export interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url: string
  role: UserRole
  school_id?: string
  school_name: string
  created_at: string
}
