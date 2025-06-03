
import { useEffect } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog"
import type { Json } from "@/integrations/supabase/types"
import { AccommodationForm } from "./accommodation/AccommodationForm"

interface Accommodation {
  id: number
  name: string
  type: string
  location: string
  description: string
  price: number
  rating: number
  rooms: number
  bathrooms: number
  max_guests: number
  image: string
  gallery_images?: Json
  amenities?: Json
  features?: Json
  rules?: Json
  discount?: number
}

interface AccommodationModalProps {
  accommodation?: Accommodation | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AccommodationModal({ accommodation, isOpen, onClose, onSuccess }: AccommodationModalProps) {
  useEffect(() => {
    if (accommodation) {
      console.log('🔄 Chargement des données de l\'hébergement:', accommodation)
    } else {
      console.log('🆕 Création d\'un nouvel hébergement')
    }
  }, [accommodation])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {accommodation ? "Modifier l'hébergement" : "Créer un nouvel hébergement"}
          </DialogTitle>
        </DialogHeader>
        
        <AccommodationForm 
          accommodation={accommodation}
          onSuccess={onSuccess}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}
