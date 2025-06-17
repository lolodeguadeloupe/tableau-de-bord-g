
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('🛡️ ProtectedRoute - Auth state:', { 
      hasUser: !!user, 
      loading,
      isAdmin,
      userEmail: user?.email
    })

    if (!loading) {
      if (!user) {
        console.log('🚫 No user found, redirecting to /auth')
        navigate('/auth')
        return
      }

      if (!isAdmin) {
        console.log('🚫 User is not admin, redirecting to /auth')
        navigate('/auth')
        return
      }

      console.log('✅ Admin user authenticated, access granted')
    }
  }, [user, loading, isAdmin, navigate])

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

  if (!user || !isAdmin) {
    return null
  }

  return <>{children}</>
}
