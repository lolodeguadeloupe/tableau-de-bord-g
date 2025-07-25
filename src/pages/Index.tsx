
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Calendar, Settings, Utensils, Music, PartyPopper, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { usePartnerActivities } from "@/hooks/usePartnerActivities"

const Index = () => {
  const navigate = useNavigate()
  const { user, profile, loading, isSuperAdmin } = useAuth()
  const { hasAccessToActivityType, loading: activitiesLoading } = usePartnerActivities()

  useEffect(() => {
  }, [user, profile, loading])

  if (loading || activitiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Tableau de Bord
          </h1>
          <p className="text-muted-foreground">
            Bienvenue dans votre interface d'administration
            {profile?.first_name && `, ${profile.first_name}`}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Loisirs Actifs
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +2 depuis le mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hébergements
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +1 cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Restaurants
            </CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              +3 nouveaux partenaires
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Utilisateurs Actifs
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345</div>
            <p className="text-xs text-muted-foreground">
              +5% cette semaine
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {hasAccessToActivityType('leisure_activity') && (
          <Card>
            <CardHeader>
              <CardTitle>Gestion des Loisirs</CardTitle>
              <CardDescription>
                Créer et gérer vos activités de loisirs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/leisure-activities')}
                className="w-full"
              >
                Accéder aux Loisirs
              </Button>
            </CardContent>
          </Card>
        )}

        {hasAccessToActivityType('accommodation') && (
          <Card>
            <CardHeader>
              <CardTitle>Hébergements</CardTitle>
              <CardDescription>
                Gérer les hébergements disponibles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/accommodations')}
                className="w-full"
              >
                Gérer les Hébergements
              </Button>
            </CardContent>
          </Card>
        )}

        {hasAccessToActivityType('restaurant') && (
          <Card>
            <CardHeader>
              <CardTitle>Restaurants</CardTitle>
              <CardDescription>
                Gérer vos restaurants partenaires
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/restaurants')}
                className="w-full"
              >
                Gérer les Restaurants
              </Button>
            </CardContent>
          </Card>
        )}

        {hasAccessToActivityType('concert') && (
          <Card>
            <CardHeader>
              <CardTitle>Concerts</CardTitle>
              <CardDescription>
                Gérer les événements musicaux
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/concerts')}
                className="w-full"
              >
                Gérer les Concerts
              </Button>
            </CardContent>
          </Card>
        )}

        {hasAccessToActivityType('nightlife') && (
          <Card>
            <CardHeader>
              <CardTitle>Soirées</CardTitle>
              <CardDescription>
                Gérer les événements nocturnes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/nightlife')}
                className="w-full"
              >
                Gérer les Soirées
              </Button>
            </CardContent>
          </Card>
        )}

        {isSuperAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs</CardTitle>
              <CardDescription>
                Voir et gérer les utilisateurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => navigate('/users')}
                className="w-full"
              >
                Gérer les Utilisateurs
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="mt-8 border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-yellow-800">Informations de Debug</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-yellow-700">
            <div>Utilisateur ID: {user?.id || 'Non connecté'}</div>
            <div>Email: {user?.email || 'N/A'}</div>
            <div>Rôle: {profile?.role || 'N/A'}</div>
            <div>Statut de chargement: {loading ? 'En cours' : 'Terminé'}</div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Index
