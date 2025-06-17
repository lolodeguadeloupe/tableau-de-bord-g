import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

interface PrivateRouteProps {
  children: React.ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAdmin, loading, profile } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div>Chargement...</div>
  }

  if (!profile || !isAdmin) {
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ from: location, error: "Accès refusé : vous devez être administrateur." }} 
      />
    )
  }
  return <>{children}</>
} 