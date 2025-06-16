
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, profile, loading, isAdmin } = useAuth()
 
  console.log("user", user)
  console.log("profile", profile)
  console.log("loading", loading)
  console.log("isAdmin", isAdmin)

  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    console.log('🛡️ Vérification de l\'authentification et des droits:', { 
      user: user?.id, 
      loading,
      isAdmin,
      role: profile?.role,
    })

    if (!loading) {
      if (!user) {
        console.log('🚫 Utilisateur non authentifié, redirection vers /auth')
        navigate('/auth')
        return
      }

      if (!isAdmin) {
        console.log('🚫 Accès refusé. L\'utilisateur n\'est pas administrateur.')
        toast({
          title: "Accès refusé",
          description: "Vous devez être administrateur pour accéder à cette page.",
          variant: "destructive",
        })
        navigate('/auth')
        return
      }

      console.log('✅ Utilisateur admin authentifié, accès autorisé')
    }
  }, [user, profile, loading, isAdmin, navigate, toast])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return null
  }

  return <>{children}</>
}
