
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthForm } from "@/components/AuthForm"
import { useAuth } from "@/hooks/useAuth"

export default function Auth() {
  const navigate = useNavigate()
  const { user, loading, isAdmin } = useAuth()

  useEffect(() => {
    console.log('🔑 Auth page - Current state:', { 
      hasUser: !!user, 
      loading, 
      isAdmin,
      userEmail: user?.email 
    })

    // Only redirect if we have a user AND they are admin AND not loading
    console.log('🔑 Auth page - Current state:', { 
      hasUser: !!user, 
      loading,
      isAdmin,
      userEmail: user?.email,
      userRole: user?.user_metadata.role
    })

    if (user && isAdmin && !loading) {
      console.log('✅ Admin user detected, redirecting to dashboard')
      navigate('/', { replace: true })
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

  // If user is authenticated and admin, they'll be redirected by the useEffect
  if (user && isAdmin) {
    return null
  }

  return <AuthForm onSuccess={() => {
    console.log('🎉 Authentication successful, waiting for profile validation...')
    // Don't navigate immediately, let the useEffect handle it after profile is loaded
  }} />
}
