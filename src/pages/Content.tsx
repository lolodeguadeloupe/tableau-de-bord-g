
import { useState } from "react"
import { Plus, FileText, Image, Video } from "lucide-react"
import { DataTable } from "@/components/DataTable"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const articlesData = [
  {
    id: "1",
    titre: "Guide complet du développement web",
    auteur: "Jean Dupont",
    statut: "Publié",
    dateCreation: "2024-05-15",
    datePublication: "2024-05-20",
    vues: "1,234"
  },
  {
    id: "2",
    titre: "Les tendances UI/UX en 2024",
    auteur: "Marie Martin", 
    statut: "Brouillon",
    dateCreation: "2024-05-28",
    datePublication: "-",
    vues: "-"
  },
  {
    id: "3",
    titre: "Introduction à React et TypeScript",
    auteur: "Pierre Bernard",
    statut: "En révision",
    dateCreation: "2024-05-10",
    datePublication: "-", 
    vues: "-"
  }
]

const pagesData = [
  {
    id: "1",
    titre: "Page d'accueil",
    url: "/",
    statut: "Publié",
    dateModification: "2024-05-25",
    auteur: "Admin"
  },
  {
    id: "2", 
    titre: "À propos",
    url: "/about",
    statut: "Publié",
    dateModification: "2024-05-20",
    auteur: "Jean Dupont"
  },
  {
    id: "3",
    titre: "Contact",
    url: "/contact", 
    statut: "Brouillon",
    dateModification: "2024-05-28",
    auteur: "Marie Martin"
  }
]

const mediaData = [
  {
    id: "1",
    nom: "hero-banner.jpg",
    type: "Image",
    taille: "2.4 MB",
    dateUpload: "2024-05-20",
    utilise: "3 fois"
  },
  {
    id: "2",
    nom: "presentation-video.mp4", 
    type: "Vidéo",
    taille: "15.2 MB",
    dateUpload: "2024-05-18",
    utilise: "1 fois"
  }
]

const articlesColumns = [
  { key: "titre", label: "Titre" },
  { key: "auteur", label: "Auteur" },
  { key: "statut", label: "Statut" },
  { key: "dateCreation", label: "Date de création" },
  { key: "vues", label: "Vues" }
]

const pagesColumns = [
  { key: "titre", label: "Titre" },
  { key: "url", label: "URL" },
  { key: "statut", label: "Statut" },
  { key: "dateModification", label: "Dernière modification" },
  { key: "auteur", label: "Auteur" }
]

const mediaColumns = [
  { key: "nom", label: "Nom du fichier" },
  { key: "type", label: "Type" },
  { key: "taille", label: "Taille" },
  { key: "dateUpload", label: "Date d'upload" },
  { key: "utilise", label: "Utilisé" }
]

export default function Content() {
  const [articles, setArticles] = useState(articlesData)
  const [pages, setPages] = useState(pagesData)
  const [media, setMedia] = useState(mediaData)

  const handleEdit = (item: any) => {
    console.log("Modifier:", item)
  }

  const handleDelete = (id: string, type: string) => {
    console.log("Supprimer:", id, type)
    if (type === "articles") {
      setArticles(articles.filter(article => article.id !== id))
    } else if (type === "pages") {
      setPages(pages.filter(page => page.id !== id))
    } else if (type === "media") {
      setMedia(media.filter(m => m.id !== id))
    }
  }

  // Transformer les données pour l'affichage avec badges
  const displayArticles = articles.map(article => ({
    ...article,
    statut: (
      <Badge variant={
        article.statut === "Publié" ? "default" : 
        article.statut === "Brouillon" ? "secondary" : "outline"
      }>
        {article.statut}
      </Badge>
    )
  }))

  const displayPages = pages.map(page => ({
    ...page,
    statut: (
      <Badge variant={page.statut === "Publié" ? "default" : "secondary"}>
        {page.statut}
      </Badge>
    )
  }))

  const displayMedia = media.map(m => ({
    ...m,
    type: (
      <Badge variant="outline" className="flex items-center gap-1 w-fit">
        {m.type === "Image" ? <Image className="h-3 w-3" /> : <Video className="h-3 w-3" />}
        {m.type}
      </Badge>
    )
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion du Contenu</h1>
          <p className="text-muted-foreground mt-1">Gérez vos articles, pages et médias</p>
        </div>
      </div>

      {/* Statistiques contenu */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-border/40 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Articles</p>
                <p className="text-2xl font-bold text-foreground">{articles.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border/40 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Pages</p>
                <p className="text-2xl font-bold text-foreground">{pages.length}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Médias</p>
                <p className="text-2xl font-bold text-foreground">{media.length}</p>
              </div>
              <Image className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Vues Totales</p>
                <p className="text-2xl font-bold text-foreground">1,234</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs pour les différents types de contenu */}
      <Tabs defaultValue="articles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="media">Médias</TabsTrigger>
        </TabsList>

        <TabsContent value="articles" className="space-y-6">
          <div className="flex justify-end">
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Article
            </Button>
          </div>
          <DataTable
            title="Articles"
            data={displayArticles}
            columns={articlesColumns}
            onEdit={handleEdit}
            onDelete={(id) => handleDelete(id, "articles")}
          />
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <div className="flex justify-end">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Page
            </Button>
          </div>
          <DataTable
            title="Pages"
            data={displayPages}
            columns={pagesColumns}
            onEdit={handleEdit}
            onDelete={(id) => handleDelete(id, "pages")}
          />
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <div className="flex justify-end">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-700 hover:from-purple-700 hover:to-pink-800">
              <Plus className="h-4 w-4 mr-2" />
              Upload Média
            </Button>
          </div>
          <DataTable
            title="Bibliothèque Média"
            data={displayMedia}
            columns={mediaColumns}
            onEdit={handleEdit}
            onDelete={(id) => handleDelete(id, "media")}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
