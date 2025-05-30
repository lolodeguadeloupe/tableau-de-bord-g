
import { useState } from "react"
import { Plus, UserPlus } from "lucide-react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const usersData = [
  {
    id: "1",
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@email.com",
    role: "Admin",
    statut: "Actif",
    dateInscription: "2024-01-15",
    derniereConnexion: "2024-05-28"
  },
  {
    id: "2", 
    nom: "Martin",
    prenom: "Marie",
    email: "marie.martin@email.com",
    role: "Editeur",
    statut: "Actif",
    dateInscription: "2024-02-03",
    derniereConnexion: "2024-05-29"
  },
  {
    id: "3",
    nom: "Bernard",
    prenom: "Pierre",
    email: "pierre.bernard@email.com", 
    role: "Contributeur",
    statut: "Inactif",
    dateInscription: "2024-01-20",
    derniereConnexion: "2024-05-15"
  },
  {
    id: "4",
    nom: "Durand",
    prenom: "Sophie",
    email: "sophie.durand@email.com",
    role: "Editeur", 
    statut: "Actif",
    dateInscription: "2024-03-12",
    derniereConnexion: "2024-05-30"
  },
  {
    id: "5",
    nom: "Leroy",
    prenom: "Marc",
    email: "marc.leroy@email.com",
    role: "Contributeur",
    statut: "Actif", 
    dateInscription: "2024-04-08",
    derniereConnexion: "2024-05-29"
  }
]

const columns = [
  { key: "prenom", label: "Prénom" },
  { key: "nom", label: "Nom" },
  { key: "email", label: "Email" },
  { key: "role", label: "Rôle" },
  { key: "statut", label: "Statut" },
  { key: "dateInscription", label: "Date d'inscription" },
  { key: "derniereConnexion", label: "Dernière connexion" }
]

const statsCards = [
  { title: "Total Utilisateurs", value: "125", change: "+12 ce mois" },
  { title: "Utilisateurs Actifs", value: "98", change: "+8 ce mois" },
  { title: "Nouveaux Inscrits", value: "23", change: "+5 cette semaine" },
  { title: "Administrateurs", value: "8", change: "Aucun changement" }
]

export default function Users() {
  const [users, setUsers] = useState(usersData)

  const handleEdit = (user: any) => {
    console.log("Modifier utilisateur:", user)
    // Ici vous pourriez ouvrir un modal d'édition
  }

  const handleDelete = (userId: string) => {
    console.log("Supprimer utilisateur:", userId)
    setUsers(users.filter(user => user.id !== userId))
  }

  // Transformer les données pour l'affichage avec badges
  const displayUsers = users.map(user => ({
    ...user,
    role: (
      <Badge variant={user.role === "Admin" ? "default" : user.role === "Editeur" ? "secondary" : "outline"}>
        {user.role}
      </Badge>
    ),
    statut: (
      <Badge variant={user.statut === "Actif" ? "default" : "destructive"}>
        {user.statut}
      </Badge>
    )
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground mt-1">Gérez les comptes et permissions utilisateurs</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
          <UserPlus className="h-4 w-4 mr-2" />
          Nouvel Utilisateur
        </Button>
      </div>

      {/* Statistiques utilisateurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="border border-border/40 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-green-600">{stat.change}</p>
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
        onDelete={handleDelete}
      />
    </div>
  )
}
