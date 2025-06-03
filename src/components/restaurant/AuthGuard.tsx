
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
import { useNavigate } from "react-router-dom"

export function AuthGuard() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Restaurants</h1>
          <p className="text-muted-foreground">Gérez vos restaurants partenaires</p>
        </div>
      </div>

      <div className="text-center p-8 bg-blue-50 border border-blue-200 rounded-lg">
        <LogIn className="mx-auto h-12 w-12 text-blue-600 mb-4" />
        <p className="text-lg font-medium text-blue-800 mb-2">Authentification requise</p>
        <p className="text-blue-600 mb-4">
          Vous devez être connecté pour gérer les restaurants.
        </p>
        <Button onClick={() => navigate('/auth')} className="gap-2">
          <LogIn className="h-4 w-4" />
          Se connecter
        </Button>
      </div>
    </div>
  )
}
