
import { useState, useEffect } from "react"
import { Plus, UserPlus } from "lucide-react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"

interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  created_at: string
  updated_at: string
}

const columns = [
  { key: "first_name", label: "Prénom" },
  { key: "last_name", label: "Nom" },
  { key: "email", label: "Email" },
  { key: "role", label: "Rôle" },
  { key: "created_at", label: "Date d'inscription" }
]

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    editors: 0,
    users: 0
  })
  const { toast } = useToast()
  const { isAdmin } = useAuth()

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setUsers(data || [])
      
      // Calculer les statistiques
      const total = data?.length || 0
      const admins = data?.filter(user => user.role === 'admin').length || 0
      const editors = data?.filter(user => user.role === 'editor').length || 0
      const regularUsers = data?.filter(user => user.role === 'user').length || 0

      setStats({
        total,
        admins,
        editors,
        users: regularUsers
      })
    } catch (error: any) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les utilisateurs.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleEdit = (user: User) => {
    console.log("Modifier utilisateur:", user)
    toast({
      title: "Fonctionnalité à venir",
      description: "L'édition des utilisateurs sera bientôt disponible.",
    })
  }

  const handleDelete = async (userId: string) => {
    if (!isAdmin) {
      toast({
        title: "Accès refusé",
        description: "Seuls les administrateurs peuvent supprimer des utilisateurs.",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (error) throw error

      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
      })

      // Recharger la liste
      fetchUsers()
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
        variant: "destructive",
      })
    }
  }

  // Transformer les données pour l'affichage avec badges
  const displayUsers = users.map(user => ({
    ...user,
    first_name: user.first_name || "-",
    last_name: user.last_name || "-",
    role: (
      <Badge variant={
        user.role === "admin" ? "default" : 
        user.role === "editor" ? "secondary" : 
        "outline"
      }>
        {user.role === "admin" ? "Administrateur" :
         user.role === "editor" ? "Éditeur" : "Utilisateur"}
      </Badge>
    ),
    created_at: new Date(user.created_at).toLocaleDateString('fr-FR')
  }))

  const statsCards = [
    { title: "Total Utilisateurs", value: stats.total.toString(), change: "Tous les utilisateurs" },
    { title: "Administrateurs", value: stats.admins.toString(), change: "Accès complet" },
    { title: "Éditeurs", value: stats.editors.toString(), change: "Accès modération" },
    { title: "Utilisateurs", value: stats.users.toString(), change: "Accès standard" }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-muted-foreground">Chargement des utilisateurs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground mt-1">Gérez les comptes et permissions utilisateurs</p>
        </div>
        {isAdmin && (
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
            <UserPlus className="h-4 w-4 mr-2" />
            Nouvel Utilisateur
          </Button>
        )}
      </div>

      {/* Statistiques utilisateurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="border border-border/40 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table des utilisateurs */}
      <DataTable
        title="Liste des Utilisateurs"
        data={displayUsers}
        columns={columns}
        onEdit={handleEdit}
        onDelete={isAdmin ? handleDelete : undefined}
      />
    </div>
  )
}
