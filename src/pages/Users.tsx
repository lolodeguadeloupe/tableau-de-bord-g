
import { useState, useEffect } from "react"
import { Plus, UserPlus, Edit, Trash2, Eye } from "lucide-react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { UserEditModal } from "@/components/UserEditModal"
import { UserDetailsModal } from "@/components/UserDetailsModal"

interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  admin_type?: string
  created_at: string
  updated_at: string
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    superAdmins: 0,
    partnerAdmins: 0,
    editors: 0,
    users: 0
  })
  const { toast } = useToast()
  const { isSuperAdmin } = useAuth()

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
      const superAdmins = data?.filter(user => user.role === 'admin' && user.admin_type === 'super_admin').length || 0
      const partnerAdmins = data?.filter(user => user.role === 'admin' && (user.admin_type === 'partner_admin' || (user.role === 'admin' && !user.admin_type))).length || 0
      const editors = data?.filter(user => user.role === 'editor').length || 0
      const regularUsers = data?.filter(user => user.role === 'user').length || 0

      setStats({
        total,
        superAdmins,
        partnerAdmins,
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
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setDetailsModalOpen(true)
  }

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedUser || !isSuperAdmin) {
      toast({
        title: "Accès refusé",
        description: "Seuls les super administrateurs peuvent supprimer des utilisateurs.",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', selectedUser.id)

      if (error) throw error

      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
      })

      fetchUsers()
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'utilisateur.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setSelectedUser(null)
    }
  }

  // Configuration des colonnes avec actions personnalisées
  const columns = [
    { key: "first_name", label: "Prénom" },
    { key: "last_name", label: "Nom" },
    { key: "email", label: "Email" },
    { key: "role", label: "Rôle" },
    { key: "created_at", label: "Date d'inscription" }
  ]

  // Transformer les données pour l'affichage avec badges et actions personnalisées
  const displayUsers = users.map(user => {
    let roleText = "Utilisateur"
    let roleVariant: "default" | "secondary" | "outline" | "destructive" = "outline"
    
    if (user.role === "admin") {
      if (user.admin_type === "super_admin") {
        roleText = "Super Admin"
        roleVariant = "destructive"
      } else {
        roleText = "Admin Partenaire"
        roleVariant = "default"
      }
    } else if (user.role === "editor") {
      roleText = "Éditeur"
      roleVariant = "secondary"
    }

    return {
      ...user,
      first_name: user.first_name || "-",
      last_name: user.last_name || "-",
      role: (
        <Badge variant={roleVariant}>
          {roleText}
        </Badge>
      ),
      created_at: new Date(user.created_at).toLocaleDateString('fr-FR'),
      actions: (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewDetails(user)}
            className="h-8 px-3"
          >
            <Eye className="h-4 w-4 mr-1" />
            Voir
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(user)}
            className="h-8 px-3"
          >
            <Edit className="h-4 w-4 mr-1" />
            Modifier
          </Button>
          {isSuperAdmin && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDeleteClick(user)}
              className="h-8 px-3 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Supprimer
            </Button>
          )}
        </div>
      )
    }
  })

  const statsCards = [
    { title: "Total Utilisateurs", value: stats.total.toString(), change: "Tous les utilisateurs" },
    { title: "Super Administrateurs", value: stats.superAdmins.toString(), change: "Accès total" },
    { title: "Admins Partenaires", value: stats.partnerAdmins.toString(), change: "Accès limité" },
    { title: "Éditeurs", value: stats.editors.toString(), change: "Accès modération" },
    { title: "Utilisateurs", value: stats.users.toString(), change: "Accès standard" }
  ]

  // Seuls les Super Admin peuvent accéder à cette page
  if (!isSuperAdmin && !loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Accès refusé</h2>
          <p className="text-muted-foreground">Seuls les Super Administrateurs peuvent accéder à la gestion des utilisateurs.</p>
        </div>
      </div>
    )
  }

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
        {isSuperAdmin && (
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
            <UserPlus className="h-4 w-4 mr-2" />
            Nouvel Utilisateur
          </Button>
        )}
      </div>

      {/* Statistiques utilisateurs */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
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
        columns={[...columns, { key: "actions", label: "Actions" }]}
        showActions={false}
      />

      {/* Modals */}
      <UserEditModal
        user={selectedUser}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedUser(null)
        }}
        onSuccess={fetchUsers}
      />

      <UserDetailsModal
        user={selectedUser}
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false)
          setSelectedUser(null)
        }}
      />

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur "{selectedUser?.email}" ? 
              Cette action est irréversible et supprimera également tous les données associées à cet utilisateur.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedUser(null)}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
