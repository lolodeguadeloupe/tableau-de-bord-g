
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthForm } from "@/components/AuthForm"
import { useAuth } from "@/hooks/useAuth"

export default function Auth() {
  const navigate = useNavigate()
  const { user, loading, isAdmin } = useAuth()

  useEffect(() => {
    // Rediriger vers le dashboard si l'utilisateur est un admin connecté
    if (user && !loading && isAdmin) {
      navigate('/')
    }
  }, [user, loading, isAdmin, navigate])

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

  if (user && isAdmin) {
    return null // L'administrateur va être redirigé
  }

  return <AuthForm onSuccess={() => navigate('/')} />
}
