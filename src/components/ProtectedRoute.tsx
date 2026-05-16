import React, { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth-context'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: import('@/lib/supabase').UserRole[]
  superAdminOnly?: boolean
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  superAdminOnly = false,
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const [session, setSession] = useState<any>(undefined)
  const location = useLocation()

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    // Listen for changes
    const { data: { subscription } } = 
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

    return () => subscription.unsubscribe()
  }, [])

  // Still loading auth context or waiting for session check
  if (loading || session === undefined) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '50px', height: '50px',
          border: '4px solid #f1f5f9',
          borderTopColor: '#f59e0b',
          borderRadius: '50%',
          animation: 'spin 1s cubic-bezier(0.76, 0, 0.24, 1) infinite'
        }} />
        <div style={{ textAlign: 'center' }}>
           <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>Scholara</h2>
           <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, margin: '4px 0 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
             Initializing Workspace...
           </p>
        </div>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg) } }
        `}</style>
      </div>
    )
  }

  // Allow if there's a real Supabase session OR a guest/demo user in AuthContext
  const isAuthenticated = !!session || !!user

  // No session and no user — redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Super admin guard
  if (superAdminOnly && profile && profile.role !== 'super_admin') {
    return <Navigate to="/dashboard" replace />
  }

  // Role check — only if allowedRoles is specified AND profile is loaded
  if (allowedRoles && profile && !allowedRoles.includes(profile.role as any)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
