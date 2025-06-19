
import { ProtectedRoute } from "./ProtectedRoute"

interface SuperAdminRouteProps {
  children: React.ReactNode
}

export function SuperAdminRoute({ children }: SuperAdminRouteProps) {
  return (
    <ProtectedRoute requireSuperAdmin={true}>
      {children}
    </ProtectedRoute>
  )
}
