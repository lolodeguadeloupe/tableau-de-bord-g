import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { BasicInfoFields } from "./BasicInfoFields"
import { MediaFields } from "./MediaFields"
import { MenuFields } from "./MenuFields"
import { Restaurant, RestaurantFormData, restaurantSchema } from "./restaurantSchema"
import { ZodError } from "zod"

interface RestaurantFormProps {
  restaurant: Restaurant | null
  onSuccess: () => void
  onCancel: () => void
}

export function RestaurantForm({ restaurant, onSuccess, onCancel }: RestaurantFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    type: '',
    location: '',
    description: '',
    offer: '',
    icon: 'utensils',
    image: '',
    gallery_images: [],
    rating: 5,
    poids: 0,
    menus: []
  })
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (restaurant) {
      // Si un restaurant existe, on initialise le formulaire avec ses données
      setFormData({
        name: restaurant.name, // Nom du restaurant
        type: restaurant.type, // Type de cuisine
        location: restaurant.location, // Adresse
        description: restaurant.description, // Description
        offer: restaurant.offer, // Offre spéciale
        icon: restaurant.icon, // Icône du restaurant
        image: restaurant.image, // Image principale
        gallery_images: restaurant.gallery_images || [], // Galerie d'images avec valeur par défaut []
        rating: typeof restaurant.rating === 'number' ? restaurant.rating : 5, // Note avec valeur par défaut 5
        poids: typeof restaurant.poids === 'number' ? restaurant.poids : 0, // Poids avec valeur par défaut 0
        menus: restaurant.menus // Menus du restaurant
      })
    } else {
      // Si pas de restaurant, on initialise le formulaire avec des valeurs par défaut
      setFormData({
        name: '', // Champ nom vide
        type: '', // Type de cuisine vide  
        location: '', // Adresse vide
        description: '', // Description vide
        offer: '', // Pas d'offre
        icon: 'utensils', // Icône par défaut
        image: '', // Pas d'image
        gallery_images: [], // Galerie vide
        rating: 5, // Note par défaut
        poids: 0, // Poids par défaut
        menus: [] // Pas de menus
      })
    }
  }, [restaurant]) // Le useEffect se déclenche quand le restaurant change

  const handleFieldChange = (field: string, value: RestaurantFormData[keyof RestaurantFormData]) => {
    console.log('🔄 Changement de champ:', field, value, typeof value)
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleMenusChange = (menus: { name: string; items: { name: string; price: number }[] }[]) => {
    setFormData(prev => ({
      ...prev,
      menus
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast({
        title: "Authentification requise",
        description: "Vous devez être connecté pour gérer les restaurants.",
        variant: "destructive",
      })
      return
    }

    console.log('📋 Données du formulaire avant validation:', formData)

    // Validate form data using Zod schema
    try {
      const validatedData = restaurantSchema.parse(formData)
      console.log('✅ Données validées:', validatedData)
      
      // Prepare data for database insertion/update - ensure all required fields are strings
      const dbData = {
        name: validatedData.name,
        type: validatedData.type,
        location: validatedData.location,
        description: validatedData.description,
        offer: validatedData.offer || '',
        icon: validatedData.icon,
        image: validatedData.image || '',
        gallery_images: validatedData.gallery_images || [],
        rating: validatedData.rating,
        poids: validatedData.poids,
        menus: validatedData.menus || []
      }
      
      setLoading(true)

      console.log('💾 Sauvegarde du restaurant:', dbData)
      console.log('👤 Utilisateur connecté:', user.id)

      if (restaurant) {
        // Modification
        const { error } = await supabase
          .from('restaurants')
          .update(dbData)
          .eq('id', restaurant.id)

        if (error) {
          console.error('❌ Erreur lors de la modification:', error)
          throw error
        }

        toast({
          title: "Restaurant modifié",
          description: "Le restaurant a été modifié avec succès.",
        })
      } else {
        // Création
        const { error } = await supabase
          .from('restaurants')
          .insert(dbData)

        if (error) {
          console.error('❌ Erreur lors de la création:', error)
          throw error
        }

        toast({
          title: "Restaurant créé",
          description: "Le restaurant a été créé avec succès.",
        })
      }

      onSuccess()
    } catch (validationError) {
      console.error('❌ Erreur de validation:', validationError)
      
      if (validationError instanceof ZodError) {
        // Zod validation errors
        const errorMessages = validationError.errors.map((err) => `${err.path.join('.')}: ${err.message}`).join(', ')
        console.error('📝 Messages d\'erreur détaillés:', errorMessages)
        toast({
          title: "Erreur de validation",
          description: errorMessages,
          variant: "destructive",
        })
      } else {
        console.error('💥 Erreur lors de la sauvegarde:', validationError)
        
        if (validationError && typeof validationError === 'object' && 'code' in validationError) {
          if (validationError.code === 'PGRST301') {
            toast({
              title: "Erreur d'authentification",
              description: "Votre session a expiré. Veuillez vous reconnecter.",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Erreur",
              description: `Impossible de sauvegarder le restaurant: ${validationError.code}`,
              variant: "destructive",
            })
          }
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de sauvegarder le restaurant.",
            variant: "destructive",
          })
        }
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <BasicInfoFields formData={formData} onFieldChange={handleFieldChange} />
      <MediaFields formData={formData} onFieldChange={handleFieldChange} />
      <MenuFields formData={formData} onFieldChange={handleFieldChange} />

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {restaurant ? 'Modifier' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}
