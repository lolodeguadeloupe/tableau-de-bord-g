import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Users, Calendar, MapPin, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { Json } from "@/integrations/supabase/types"

interface Loisir {
  id: number
  title: string
  description: string
  location: string
  start_date: string
  end_date: string
  max_participants: number
  current_participants: number
  image: string
  gallery_images?: Json
}

export default function LeisureActivityDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loisir, setLoisir] = useState<Loisir | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const { toast } = useToast()

  useEffect(() => {
    if (id) {
      fetchLoisir(parseInt(id))
    }
  }, [id])

  const fetchLoisir = async (loisirId: number) => {
    console.log('🔄 Récupération du loisir ID:', loisirId)
    try {
      const { data, error } = await supabase
        .from('loisirs')
        .select('*')
        .eq('id', loisirId)
        .single()

      if (error) {
        console.error('❌ Erreur Supabase:', error)
        throw error
      }

      console.log('✅ Loisir récupéré:', data)
      setLoisir(data)
      setSelectedImage(data.image)
    } catch (error: unknown) {
      console.error('💥 Erreur lors du chargement du loisir:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger ce loisir.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getAvailabilityColor = (current: number, max: number) => {
    const ratio = current / max
    if (ratio >= 1) return "bg-red-100 text-red-800"
    if (ratio >= 0.8) return "bg-orange-100 text-orange-800"
    return "bg-green-100 text-green-800"
  }

  const getAvailabilityText = (current: number, max: number) => {
    const available = max - current
    if (available <= 0) return "Complet"
    return `${available} places disponibles`
  }

  const getGalleryImages = (): string[] => {
    if (!loisir?.gallery_images) return []
    
    try {
      if (Array.isArray(loisir.gallery_images)) {
        return loisir.gallery_images as string[]
      }
      return []
    } catch {
      return []
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement du loisir...</div>
      </div>
    )
  }

  if (!loisir) {
    return (
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-foreground mb-4">Loisir non trouvé</h1>
        <Button onClick={() => navigate('/leisure-activities')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>
      </div>
    )
  }

  const galleryImages = getGalleryImages()
  const allImages = [loisir.image, ...galleryImages].filter(Boolean)

  return (
    <div className="space-y-6">
      {/* En-tête avec bouton retour */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/leisure-activities')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">{loisir.title}</h1>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {loisir.location}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section images */}
        <div className="space-y-4">
          {/* Image principale */}
          <div className="aspect-video rounded-lg overflow-hidden">
            <img 
              src={selectedImage} 
              alt={loisir.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Galerie d'images */}
          {allImages.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {allImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(image)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === image ? 'border-primary' : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${loisir.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informations du loisir */}
        <div className="space-y-6">
          {/* Disponibilité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {loisir.current_participants}/{loisir.max_participants}
                </span>
                <Badge className={getAvailabilityColor(loisir.current_participants, loisir.max_participants)}>
                  {getAvailabilityText(loisir.current_participants, loisir.max_participants)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Dates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Période
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Début:</span> {loisir.start_date}
                </div>
                <div>
                  <span className="font-medium">Fin:</span> {loisir.end_date}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {loisir.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
