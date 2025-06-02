
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { Json } from "@/integrations/supabase/types"

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

const accommodationSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  type: z.string().min(1, "Le type est requis"),
  location: z.string().min(1, "Le lieu est requis"),
  description: z.string().min(1, "La description est requise"),
  price: z.number().min(0.01, "Le prix doit être supérieur à 0"),
  rating: z.number().min(0, "La note doit être positive").max(5, "La note ne peut pas dépasser 5"),
  rooms: z.number().int().min(1, "Au moins 1 chambre requise"),
  bathrooms: z.number().int().min(1, "Au moins 1 salle de bain requise"),
  max_guests: z.number().int().min(1, "Au moins 1 invité autorisé"),
  image: z.string().optional(),
  discount: z.number().int().min(0).max(100).optional(),
  amenities: z.string().optional(),
  features: z.string().optional(),
  rules: z.string().optional(),
})

type AccommodationFormData = z.infer<typeof accommodationSchema>

export function AccommodationModal({ accommodation, isOpen, onClose, onSuccess }: AccommodationModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<AccommodationFormData>({
    resolver: zodResolver(accommodationSchema),
    defaultValues: {
      name: "",
      type: "",
      location: "",
      description: "",
      price: 0,
      rating: 0,
      rooms: 1,
      bathrooms: 1,
      max_guests: 1,
      image: "",
      discount: undefined,
      amenities: "",
      features: "",
      rules: "",
    },
  })

  useEffect(() => {
    if (accommodation) {
      console.log('🔄 Chargement des données de l\'hébergement:', accommodation)
      
      // Convertir les tableaux JSON en strings pour l'affichage
      const amenitiesStr = Array.isArray(accommodation.amenities) 
        ? (accommodation.amenities as string[]).join(", ") 
        : ""
      const featuresStr = Array.isArray(accommodation.features) 
        ? (accommodation.features as string[]).join(", ") 
        : ""
      const rulesStr = Array.isArray(accommodation.rules) 
        ? (accommodation.rules as string[]).join(", ") 
        : ""

      form.reset({
        name: accommodation.name,
        type: accommodation.type,
        location: accommodation.location,
        description: accommodation.description,
        price: Number(accommodation.price),
        rating: Number(accommodation.rating),
        rooms: Number(accommodation.rooms),
        bathrooms: Number(accommodation.bathrooms),
        max_guests: Number(accommodation.max_guests),
        image: accommodation.image || "",
        discount: accommodation.discount ? Number(accommodation.discount) : undefined,
        amenities: amenitiesStr,
        features: featuresStr,
        rules: rulesStr,
      })
    } else {
      console.log('🆕 Création d\'un nouvel hébergement')
      form.reset({
        name: "",
        type: "",
        location: "",
        description: "",
        price: 0,
        rating: 0,
        rooms: 1,
        bathrooms: 1,
        max_guests: 1,
        image: "",
        discount: undefined,
        amenities: "",
        features: "",
        rules: "",
      })
    }
  }, [accommodation, form])

  const onSubmit = async (data: AccommodationFormData) => {
    setLoading(true)
    console.log('💾 Début de la sauvegarde avec les données:', data)

    try {
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
        image: data.image?.trim() || "",
        discount: data.discount || null,
        amenities: data.amenities ? 
          data.amenities.split(",").map(item => item.trim()).filter(Boolean) : 
          [],
        features: data.features ? 
          data.features.split(",").map(item => item.trim()).filter(Boolean) : 
          [],
        rules: data.rules ? 
          data.rules.split(",").map(item => item.trim()).filter(Boolean) : 
          [],
        gallery_images: []
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
      
      toast({
        title: "Erreur de sauvegarde",
        description: `Impossible de ${accommodation ? 'modifier' : 'créer'} l'hébergement: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {accommodation ? "Modifier l'hébergement" : "Créer un nouvel hébergement"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom *</FormLabel>
                    <FormControl>
                      <Input placeholder="Villa Paradis" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="appartement">Appartement</SelectItem>
                        <SelectItem value="maison">Maison</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="resort">Resort</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lieu *</FormLabel>
                  <FormControl>
                    <Input placeholder="Paris, France" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Description de l'hébergement..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix (€) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        min="0" 
                        placeholder="150" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note (0-5) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="5" 
                        step="0.1" 
                        placeholder="4.5" 
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remise (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        placeholder="10" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="rooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chambres *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="2" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salles de bain *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="1" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="max_guests"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invités max *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="4" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de l'image</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/image.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Équipements (séparés par des virgules)</FormLabel>
                  <FormControl>
                    <Input placeholder="WiFi, Climatisation, Piscine..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caractéristiques (séparées par des virgules)</FormLabel>
                  <FormControl>
                    <Input placeholder="Vue mer, Balcon, Jardin..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Règles (séparées par des virgules)</FormLabel>
                  <FormControl>
                    <Input placeholder="Non-fumeur, Animaux interdits..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
      </DialogContent>
    </Dialog>
  )
}
