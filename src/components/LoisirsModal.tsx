
import { useState, useEffect } from "react"
import { Plus, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { BasicInfoFields } from "@/components/loisirs/BasicInfoFields"
import { DateFields } from "@/components/loisirs/DateFields"
import { ParticipantsFields } from "@/components/loisirs/ParticipantsFields"
import { ImageUploadSection } from "@/components/loisirs/ImageUploadSection"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { formatDateForInput } from "@/utils/dateUtils"
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
            <BasicInfoFields formData={formData} setFormData={setFormData} />
            <DateFields formData={formData} setFormData={setFormData} />
            <ParticipantsFields formData={formData} setFormData={setFormData} />
            <ImageUploadSection formData={formData} onImagesChange={handleImagesChange} />
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
