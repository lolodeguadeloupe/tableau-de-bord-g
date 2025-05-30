
import { useState } from "react"
import { Database as DatabaseIcon, Table, Plus, Download, Upload } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tablesData = [
  {
    id: "1",
    nom: "users",
    description: "Table des utilisateurs",
    enregistrements: 1245,
    taille: "2.4 MB",
    derniereModification: "2024-05-30",
    statut: "Active"
  },
  {
    id: "2", 
    nom: "articles",
    description: "Articles du blog",
    enregistrements: 89,
    taille: "856 KB",
    derniereModification: "2024-05-29",
    statut: "Active"
  },
  {
    id: "3",
    nom: "comments",
    description: "Commentaires des articles",
    enregistrements: 2341,
    taille: "1.8 MB", 
    derniereModification: "2024-05-30",
    statut: "Active"
  },
  {
    id: "4",
    nom: "settings",
    description: "Configuration du site",
    enregistrements: 24,
    taille: "12 KB",
    derniereModification: "2024-05-25",
    statut: "Active"
  }
]

const backupsData = [
  {
    id: "1",
    nom: "backup_2024_05_30.sql",
    taille: "15.2 MB",
    date: "2024-05-30 02:00",
    type: "Automatique",
    statut: "Réussi"
  },
  {
    id: "2",
    nom: "backup_2024_05_29.sql", 
    taille: "14.8 MB",
    date: "2024-05-29 02:00",
    type: "Automatique",
    statut: "Réussi"
  },
  {
    id: "3",
    nom: "backup_manual_2024_05_28.sql",
    taille: "14.5 MB",
    date: "2024-05-28 14:30",
    type: "Manuel",
    statut: "Réussi"
  }
]

const statsCards = [
  { title: "Tables Totales", value: "12", description: "Base de données" },
  { title: "Enregistrements", value: "3,699", description: "Total des données" },
  { title: "Taille DB", value: "18.4 MB", description: "Espace utilisé" },
  { title: "Dernière Sauvegarde", value: "2h", description: "Il y a" }
]

export default function Database() {
  const [tables] = useState(tablesData)
  const [backups] = useState(backupsData)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Base de Données</h1>
          <p className="text-muted-foreground mt-1">Gérez votre base de données et sauvegardes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
            <Upload className="h-4 w-4 mr-2" />
            Nouvelle Sauvegarde
          </Button>
        </div>
      </div>

      {/* Statistiques de la base de données */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={index} className="border border-border/40 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <DatabaseIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs pour tables et sauvegardes */}
      <Tabs defaultValue="tables" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="backups">Sauvegardes</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-6">
          <Card className="border border-border/40">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Tables de la Base de Données</CardTitle>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle Table
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {tables.map((table, index) => (
                  <div key={table.id} className={`flex items-center justify-between p-6 border-b border-border/20 hover:bg-muted/20 transition-colors ${index === tables.length - 1 ? 'border-b-0' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-600/10 flex items-center justify-center">
                        <Table className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{table.nom}</h3>
                        <p className="text-sm text-muted-foreground">{table.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">{table.enregistrements.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">Enregistrements</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">{table.taille}</p>
                        <p className="text-xs text-muted-foreground">Taille</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">{table.derniereModification}</p>
                        <p className="text-xs text-muted-foreground">Modifiée</p>
                      </div>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {table.statut}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Voir
                        </Button>
                        <Button variant="outline" size="sm">
                          Exporter
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups" className="space-y-6">
          <Card className="border border-border/40">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">Historique des Sauvegardes</CardTitle>
                <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer Sauvegarde
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {backups.map((backup, index) => (
                  <div key={backup.id} className={`flex items-center justify-between p-6 border-b border-border/20 hover:bg-muted/20 transition-colors ${index === backups.length - 1 ? 'border-b-0' : ''}`}>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-600/10 flex items-center justify-center">
                        <DatabaseIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{backup.nom}</h3>
                        <p className="text-sm text-muted-foreground">{backup.date}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">{backup.taille}</p>
                        <p className="text-xs text-muted-foreground">Taille</p>
                      </div>
                      <Badge variant={backup.type === "Manuel" ? "secondary" : "outline"}>
                        {backup.type}
                      </Badge>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        {backup.statut}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          Restaurer
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configuration automatique */}
          <Card className="border border-border/40">
            <CardHeader className="border-b border-border/40 bg-muted/20">
              <CardTitle className="text-lg font-semibold">Configuration des Sauvegardes Automatiques</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Fréquence</p>
                  <p className="text-2xl font-bold text-foreground">Quotidienne</p>
                  <p className="text-xs text-muted-foreground">Tous les jours à 2h00</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Rétention</p>
                  <p className="text-2xl font-bold text-foreground">30 jours</p>
                  <p className="text-xs text-muted-foreground">Suppression automatique</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Statut</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="bg-green-100 text-green-800">Activé</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Fonctionnel</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
