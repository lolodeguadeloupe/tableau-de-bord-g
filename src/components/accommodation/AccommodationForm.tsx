
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { Json } from "@/integrations/supabase/types"
import { accommodationSchema, AccommodationFormData, Amenity } from "./accommodationSchema"
import { BasicInfoFields } from "./BasicInfoFields"
import { PricingFields } from "./PricingFields"
import { CapacityFields } from "./CapacityFields"
import { AdditionalFields } from "./AdditionalFields"

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

interface AccommodationFormProps {
  accommodation?: Accommodation | null
  onSuccess: () => void
  onClose: () => void
}

// Fonction utilitaire pour convertir JSON en chaîne de caractères
const convertJsonToString = (value: Json | undefined | null): string => {
  if (!value) return ""
  
  if (typeof value === "string") {
    return value
  }
  
  if (Array.isArray(value)) {
    return value.filter(item => typeof item === "string").join(", ")
  }
  
  if (typeof value === "object" && value !== null) {
    // Si c'est un objet, extraire les valeurs qui sont des chaînes
    const values = Object.values(value).filter(v => typeof v === "string")
    return values.join(", ")
  }
  
  return ""
}

// Fonction pour parser les amenities depuis le JSON
const parseAmenitiesFromJson = (value: Json | undefined | null): Amenity[] => {
  if (!value) return []
  
  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === "object" && item !== null) {
        return {
          name: String(item.name || ""),
          available: typeof item.available === "boolean" ? item.available : true
        }
      }
      return {
        name: String(item),
        available: true
      }
    }).filter(item => item.name)
  }
  
  return []
}

export function AccommodationForm({ accommodation, onSuccess, onClose }: AccommodationFormProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  console.log('🔧 Données d\'hébergement reçues:', accommodation)
  
  const form = useForm<AccommodationFormData>({
    resolver: zodResolver(accommodationSchema),
    defaultValues: {
      name: accommodation?.name || "",
      type: accommodation?.type || "",
      location: accommodation?.location || "",
      description: accommodation?.description || "",
      price: accommodation ? Number(accommodation.price) : 0,
      rating: accommodation ? Number(accommodation.rating) : 0,
      rooms: accommodation ? Number(accommodation.rooms) : 1,
      bathrooms: accommodation ? Number(accommodation.bathrooms) : 1,
      max_guests: accommodation ? Number(accommodation.max_guests) : 1,
      image: accommodation?.image || "",
      discount: accommodation?.discount ? Number(accommodation.discount) : undefined,
      amenities: parseAmenitiesFromJson(accommodation?.amenities),
      features: convertJsonToString(accommodation?.features),
      rules: convertJsonToString(accommodation?.rules),
      gallery_images: accommodation?.gallery_images ? 
        (Array.isArray(accommodation.gallery_images) ? (accommodation.gallery_images as string[]) : []) : [],
    },
  })

  console.log('📝 Valeurs par défaut du formulaire:', form.getValues())

  const onSubmit = async (data: AccommodationFormData) => {
    setLoading(true)
    console.log('💾 Début de la sauvegarde avec les données:', data)

    try {
      // Vérifier l'authentification
      const { data: { user } } = await supabase.auth.getUser()
      console.log('👤 Utilisateur authentifié:', user?.id)
      
      if (!user) {
        throw new Error('Vous devez être connecté pour effectuer cette action')
      }

      // Si des images de galerie sont définies et qu'il n'y a pas d'image principale, utiliser la première image de la galerie
      let mainImage = data.image
      if (!mainImage && data.gallery_images && data.gallery_images.length > 0) {
        mainImage = data.gallery_images[0]
      }

      // Préparation des données pour la base de données
      const accommodationData = {
        name: data.name.trim(),
        type: data.type,
        location: data.location.trim(),
        description: data.description.trim(),
        price: data.price,
        rating: data.rating,
        rooms: data.rooms,
        bathrooms: data.bathrooms,
        max_guests: data.max_guests,
        image: mainImage?.trim() || "",
        discount: data.discount || null,
        amenities: data.amenities || [],
        features: data.features ? 
          data.features.split(",").map(item => item.trim()).filter(Boolean) : 
          [],
        rules: data.rules ? 
          data.rules.split(",").map(item => item.trim()).filter(Boolean) : 
          [],
        gallery_images: data.gallery_images || []
      }

      console.log('📝 Données préparées pour Supabase:', accommodationData)

      let result
      if (accommodation?.id) {
        // Mise à jour d'un hébergement existant
        console.log('🔄 Mise à jour de l\'hébergement ID:', accommodation.id)
        result = await supabase
          .from('accommodations')
          .update(accommodationData)
          .eq('id', accommodation.id)
          .select()
          
        console.log('📊 Résultat de la mise à jour:', result)
      } else {
        // Création d'un nouvel hébergement
        console.log('➕ Création d\'un nouvel hébergement')
        result = await supabase
          .from('accommodations')
          .insert([accommodationData])
          .select()
          
        console.log('📊 Résultat de la création:', result)
      }

      if (result.error) {
        console.error('❌ Erreur Supabase:', result.error)
        throw new Error(`Erreur de base de données: ${result.error.message}`)
      }

      if (!result.data || result.data.length === 0) {
        console.error('❌ Aucune donnée retournée par Supabase')
        throw new Error('Aucune donnée retournée après la sauvegarde')
      }

      console.log('✅ Sauvegarde réussie, données retournées:', result.data)
      
      toast({
        title: accommodation ? "Hébergement modifié" : "Hébergement créé",
        description: accommodation 
          ? "L'hébergement a été modifié avec succès." 
          : "L'hébergement a été créé avec succès.",
      })

      onSuccess()
      onClose()
    } catch (error: unknown) {
      console.error('💥 Erreur lors de la sauvegarde:', error)
      const errorMessage = error instanceof Error ? error.message : "Erreur inconnue"
      console.error('📋 Détail de l\'erreur:', errorMessage)
      
      // Messages d'erreur spécifiques
      let userMessage = errorMessage
      if (errorMessage.includes('row-level security')) {
        userMessage = 'Accès refusé. Veuillez vous connecter et réessayer.'
      } else if (errorMessage.includes('permission denied')) {
        userMessage = 'Permissions insuffisantes pour cette opération.'
      } else if (errorMessage.includes('connecté')) {
        userMessage = 'Vous devez être connecté pour effectuer cette action.'
      }
      
      toast({
        title: "Erreur de sauvegarde",
        description: `Impossible de ${accommodation ? 'modifier' : 'créer'} l'hébergement: ${userMessage}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BasicInfoFields control={form.control} />
        <PricingFields control={form.control} />
        <CapacityFields control={form.control} />
        <AdditionalFields control={form.control} />

        <DialogFooter className="gap-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Sauvegarde..." : (accommodation ? "Modifier" : "Créer")}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
