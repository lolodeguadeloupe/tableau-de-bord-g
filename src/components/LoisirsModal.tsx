
import { useState, useEffect } from "react"
import { Activity, Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MultiImageUpload } from "@/components/ui/MultiImageUpload"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { Json } from "@/integrations/supabase/types"

interface Loisir {
  id?: number
  title: string
  description: string
  location: string
  start_date: string
  end_date: string
  max_participants: number
  current_participants?: number
  image: string
  gallery_images?: Json
}

interface LoisirsModalProps {
  loisir: Loisir | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

// Fonction utilitaire pour formater une date au format YYYY-MM-DD
const formatDateForInput = (dateString: string): string => {
  if (!dateString) return ""
  
  // Si la date est déjà au bon format (YYYY-MM-DD), la retourner telle quelle
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }
  
  // Sinon, essayer de parser et formater la date
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ""
    
    return date.toISOString().split('T')[0]
  } catch (error) {
    console.error('Erreur lors du formatage de la date:', error)
    return ""
  }
}

export function LoisirsModal({ loisir, isOpen, onClose, onSuccess }: LoisirsModalProps) {
  const [formData, setFormData] = useState<Loisir>({
    title: "",
    description: "",
    location: "",
    start_date: "",
    end_date: "",
    max_participants: 10,
    current_participants: 0,
    image: "",
    gallery_images: []
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    console.log('🔄 Mise à jour du formulaire avec le loisir:', loisir)
    
    if (loisir) {
      const updatedFormData = {
        ...loisir,
        start_date: formatDateForInput(loisir.start_date),
        end_date: formatDateForInput(loisir.end_date),
      }
      
      console.log('📅 Dates formatées:', {
        original_start: loisir.start_date,
        formatted_start: updatedFormData.start_date,
        original_end: loisir.end_date,
        formatted_end: updatedFormData.end_date
      })
      
      setFormData(updatedFormData)
    } else {
      setFormData({
        title: "",
        description: "",
        location: "",
        start_date: "",
        end_date: "",
        max_participants: 10,
        current_participants: 0,
        image: "",
        gallery_images: []
      })
    }
  }, [loisir])

  const handleImagesChange = (images: string[]) => {
    console.log('📸 Mise à jour des images:', images)
    setFormData(prev => ({
      ...prev,
      image: images[0] || "", // La première image devient l'image principale
      gallery_images: images
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    console.log('💾 Soumission du formulaire avec les données:', formData)

    try {
      if (loisir?.id) {
        // Mise à jour
        const { error } = await supabase
          .from('loisirs')
          .update({
            title: formData.title,
            description: formData.description,
            location: formData.location,
            start_date: formData.start_date,
            end_date: formData.end_date,
            max_participants: formData.max_participants,
            current_participants: formData.current_participants,
            image: formData.image,
            gallery_images: formData.gallery_images
          })
          .eq('id', loisir.id)

        if (error) throw error

        toast({
          title: "Loisir modifié",
          description: "Le loisir a été modifié avec succès.",
        })
      } else {
        // Création
        const { error } = await supabase
          .from('loisirs')
          .insert([{
            title: formData.title,
            description: formData.description,
            location: formData.location,
            start_date: formData.start_date,
            end_date: formData.end_date,
            max_participants: formData.max_participants,
            current_participants: formData.current_participants || 0,
            image: formData.image,
            gallery_images: formData.gallery_images || []
          }])

        if (error) throw error

        toast({
          title: "Loisir créé",
          description: "Le loisir a été créé avec succès.",
        })
      }

      onSuccess()
      onClose()
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le loisir.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Convertir gallery_images en tableau d'URLs pour le composant MultiImageUpload
  const getImagesArray = (): string[] => {
    if (Array.isArray(formData.gallery_images)) {
      return formData.gallery_images as string[]
    }
    // Si on a juste une image principale, la retourner dans un tableau
    if (formData.image) {
      return [formData.image]
    }
    return []
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {loisir ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {loisir ? "Modifier le loisir" : "Créer un loisir"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Titre du loisir"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du loisir"
                rows={3}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Lieu *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Lieu du loisir"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start_date">Date de début *</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end_date">Date de fin *</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="max_participants">Participants max *</Label>
                <Input
                  id="max_participants"
                  type="number"
                  min="1"
                  value={formData.max_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) || 1 }))}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="current_participants">Participants actuels</Label>
                <Input
                  id="current_participants"
                  type="number"
                  min="0"
                  value={formData.current_participants || 0}
                  onChange={(e) => setFormData(prev => ({ ...prev, current_participants: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Images du loisir</Label>
              <MultiImageUpload
                images={getImagesArray()}
                onImagesChange={handleImagesChange}
                bucketName="loisir-images"
                maxImages={5}
              />
              <p className="text-sm text-gray-500">
                La première image sera utilisée comme photo principale du loisir.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sauvegarde..." : (loisir ? "Modifier" : "Créer")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
