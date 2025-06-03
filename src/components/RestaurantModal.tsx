import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface Restaurant {
  id: number
  name: string
  type: string
  location: string
  description: string
  offer: string
  icon: string
  image: string
  rating: number
}

interface RestaurantModalProps {
  restaurant: Restaurant | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function RestaurantModal({ restaurant, isOpen, onClose, onSuccess }: RestaurantModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
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
  const { user, loading: authLoading } = useAuth()

  const restaurantTypes = [
    'Italien',
    'Français',
    'Asiatique',
    'Méditerranéen',
    'Fusion',
    'Traditionnel',
    'Fast Food',
    'Gastronomique',
    'Brasserie',
    'Pizzeria'
  ]

  const iconOptions = [
    { value: 'utensils', label: 'Couverts' },
    { value: 'chef-hat', label: 'Toque de chef' },
    { value: 'wine', label: 'Vin' },
    { value: 'coffee', label: 'Café' },
    { value: 'pizza', label: 'Pizza' },
    { value: 'fish', label: 'Poisson' }
  ]

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
  }, [restaurant, isOpen])

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

    setLoading(true)

    try {
      console.log('💾 Sauvegarde du restaurant:', formData)
      console.log('👤 Utilisateur connecté:', user.id)

      if (restaurant) {
        // Modification
        const { error } = await supabase
          .from('restaurants')
          .update(formData)
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
          .insert(formData)

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
      onClose()
    } catch (error: unknown) {
      console.error('💥 Erreur lors de la sauvegarde:', error)
      
      if (error && typeof error === 'object' && 'code' in error) {
        if (error.code === 'PGRST301') {
          toast({
            title: "Erreur d'authentification",
            description: "Votre session a expiré. Veuillez vous reconnecter.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Erreur",
            description: `Impossible de sauvegarder le restaurant: ${error.code}`,
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
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (authLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Vérification de l'authentification...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Authentification requise</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center">
            <p className="text-muted-foreground mb-4">
              Vous devez être connecté pour gérer les restaurants.
            </p>
            <Button onClick={onClose}>Fermer</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {restaurant ? 'Modifier le restaurant' : 'Nouveau restaurant'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du restaurant *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Nom du restaurant"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de cuisine *</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  {restaurantTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Localisation *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Adresse ou ville"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Note (1-5) *</Label>
              <Select value={formData.rating.toString()} onValueChange={(value) => handleChange('rating', parseInt(value))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <SelectItem key={rating} value={rating.toString()}>
                      {rating} étoile{rating > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Description du restaurant..."
              required
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="offer">Offre spéciale</Label>
            <Input
              id="offer"
              value={formData.offer}
              onChange={(e) => handleChange('offer', e.target.value)}
              placeholder="Ex: -20% sur le menu, Menu découverte..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icône</Label>
              <Select value={formData.icon} onValueChange={(value) => handleChange('icon', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de l'image</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder="https://exemple.com/image.jpg"
                type="url"
              />
            </div>
          </div>

          {formData.image && (
            <div className="space-y-2">
              <Label>Aperçu de l'image</Label>
              <img 
                src={formData.image} 
                alt="Aperçu" 
                className="w-full h-32 object-cover rounded border"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {restaurant ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
