
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { BasicInfoFields } from "./BasicInfoFields"
import { MediaFields } from "./MediaFields"
import { Restaurant, RestaurantFormData, restaurantSchema } from "./restaurantSchema"

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
    rating: 5
  })
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    if (restaurant) {
      setFormData({
        name: restaurant.name,
        type: restaurant.type,
        location: restaurant.location,
        description: restaurant.description,
        offer: restaurant.offer,
        icon: restaurant.icon,
        image: restaurant.image,
        rating: restaurant.rating
      })
    } else {
      setFormData({
        name: '',
        type: '',
        location: '',
        description: '',
        offer: '',
        icon: 'utensils',
        image: '',
        rating: 5
      })
    }
  }, [restaurant])

  const handleFieldChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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

    // Validate form data using Zod schema
    try {
      const validatedData = restaurantSchema.parse(formData)
      
      setLoading(true)

      console.log('💾 Sauvegarde du restaurant:', validatedData)
      console.log('👤 Utilisateur connecté:', user.id)

      if (restaurant) {
        // Modification
        const { error } = await supabase
          .from('restaurants')
          .update(validatedData)
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
          .insert(validatedData)

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
    } catch (validationError: any) {
      if (validationError.errors) {
        // Zod validation errors
        const errorMessages = validationError.errors.map((err: any) => err.message).join(', ')
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
