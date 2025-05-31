
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireEditor?: boolean
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false, 
  requireEditor = false 
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('🛡️ Vérification des permissions:', { 
      user: user?.id, 
      profile: profile?.role, 
      loading,
      requireAdmin,
      requireEditor 
    })

    if (!loading) {
      if (!user) {
        console.log('🚫 Utilisateur non authentifié, redirection vers /auth')
        navigate('/auth')
        return
      }

      if (requireAdmin && profile?.role !== 'admin') {
        console.log('🚫 Accès admin requis, redirection vers /')
        navigate('/')
        return
      }

      if (requireEditor && !['admin', 'editor'].includes(profile?.role || '')) {
        console.log('🚫 Accès éditeur requis, redirection vers /')
        navigate('/')
        return
      }

      console.log('✅ Permissions validées')
    }
  }, [user, profile, loading, navigate, requireAdmin, requireEditor])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-muted-foreground">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  if (!user || (requireAdmin && profile?.role !== 'admin') || 
      (requireEditor && !['admin', 'editor'].includes(profile?.role || ''))) {
    return null
  }

  return <>{children}</>
}
