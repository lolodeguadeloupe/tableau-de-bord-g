import { Navigate, useLocation } from "react-router-dom"

interface PrivateRouteProps {
  children: React.ReactNode
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const isAuthenticated = localStorage.getItem("authToken") === "admin-token"
  const location = useLocation()
  if (!isAuthenticated) {
    localStorage.removeItem("authToken")
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