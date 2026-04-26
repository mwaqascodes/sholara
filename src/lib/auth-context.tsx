import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase, UserProfile } from './supabase'

export type { UserProfile }

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: UserProfile | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<{ error: any }>
  signUpWithEmail: (email: string, password: string, name: string, role: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Build a fallback profile directly from the Supabase User object
function buildFallbackProfile(u: User): UserProfile {
  return {
    id: u.id,
    email: u.email ?? '',
    full_name:
      u.user_metadata?.full_name ??
      u.user_metadata?.name ??
      u.email?.split('@')[0] ??
      'User',
    avatar_url:
      u.user_metadata?.avatar_url ??
      u.user_metadata?.picture ??
      '',
    role: (u.user_metadata?.role as UserProfile['role']) ?? 'admin',
    school_name: 'My School',
    created_at: new Date().toISOString(),
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true) // TRUE until we know auth state for certain

  async function fetchAndSetProfile(u: User) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', u.id)
        .single()

      if (data) {
        setProfile(data as UserProfile)
        return
      }

      // No row found — try to insert one
      if (error?.code === 'PGRST116' || error?.code === '406') {
        const newProfile = buildFallbackProfile(u)
        const { data: inserted } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single()
        setProfile(inserted ? (inserted as UserProfile) : newProfile)
        return
      }

      // Table missing or network error — use local fallback so user gets in
      setProfile(buildFallbackProfile(u))
    } catch {
      setProfile(buildFallbackProfile(u))
    }
  }

  useEffect(() => {
    let mounted = true
    
    // Step 1: Check for an existing session on first load
    const initializeAuth = async () => {
      const { data: { session: s } } = await supabase.auth.getSession()
      
      if (mounted) {
        if (s?.user) {
          setSession(s)
          setUser(s.user)
          await fetchAndSetProfile(s.user)
        }
        setLoading(false)
      }
    }

    initializeAuth()

    // Step 2: Listen for auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, s) => {
        if (!mounted) return

        if (s?.user) {
          setSession(s)
          setUser(s.user)
          // Use non-blocking fetch here to keep UI responsive
          fetchAndSetProfile(s.user)
        } else {
          setSession(null)
          setUser(null)
          setProfile(null)
        }
        
        // Ensure loading is false if an event occurs (like SIGNED_IN)
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
  }

  async function signInWithEmail(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signUpWithEmail(email: string, password: string, name: string, role: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  return (
    <AuthContext.Provider value={{
      user, session, profile, loading,
      signInWithGoogle, signInWithEmail,
      signUpWithEmail, signOut, resetPassword,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
