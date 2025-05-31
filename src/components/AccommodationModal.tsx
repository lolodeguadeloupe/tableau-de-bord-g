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
  price: z.string().min(1, "Le prix est requis"),
  rating: z.string().min(1, "La note est requise"),
  rooms: z.string().min(1, "Le nombre de chambres est requis"),
  bathrooms: z.string().min(1, "Le nombre de salles de bain est requis"),
  max_guests: z.string().min(1, "Le nombre d'invités maximum est requis"),
  image: z.string().url("L'URL de l'image doit être valide"),
  discount: z.string().optional(),
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
      price: "",
      rating: "",
      rooms: "",
      bathrooms: "",
      max_guests: "",
      image: "",
      discount: "",
      amenities: "",
      features: "",
      rules: "",
    },
  })

  useEffect(() => {
    if (accommodation) {
      form.reset({
        name: accommodation.name,
        type: accommodation.type,
        location: accommodation.location,
        description: accommodation.description,
        price: accommodation.price.toString(),
        rating: accommodation.rating.toString(),
        rooms: accommodation.rooms.toString(),
        bathrooms: accommodation.bathrooms.toString(),
        max_guests: accommodation.max_guests.toString(),
        image: accommodation.image,
        discount: accommodation.discount?.toString() || "",
        amenities: Array.isArray(accommodation.amenities) ? (accommodation.amenities as string[]).join(", ") : "",
        features: Array.isArray(accommodation.features) ? (accommodation.features as string[]).join(", ") : "",
        rules: Array.isArray(accommodation.rules) ? (accommodation.rules as string[]).join(", ") : "",
      })
    } else {
      form.reset({
        name: "",
        type: "",
        location: "",
        description: "",
        price: "",
        rating: "",
        rooms: "",
        bathrooms: "",
        max_guests: "",
        image: "",
        discount: "",
        amenities: "",
        features: "",
        rules: "",
      })
    }
  }, [accommodation, form])

  const onSubmit = async (data: AccommodationFormData) => {
    setLoading(true)
    console.log('💾 Début de la sauvegarde:', data)

    try {
      const accommodationData = {
        name: data.name,
        type: data.type,
        location: data.location,
        description: data.description,
        price: parseFloat(data.price),
        rating: parseFloat(data.rating),
        rooms: parseInt(data.rooms),
        bathrooms: parseInt(data.bathrooms),
        max_guests: parseInt(data.max_guests),
        image: data.image,
        discount: data.discount ? parseInt(data.discount) : null,
        amenities: data.amenities ? data.amenities.split(",").map(item => item.trim()).filter(Boolean) : [],
        features: data.features ? data.features.split(",").map(item => item.trim()).filter(Boolean) : [],
        rules: data.rules ? data.rules.split(",").map(item => item.trim()).filter(Boolean) : [],
        gallery_images: [] // Add the required gallery_images field
      }

      console.log('📝 Données préparées:', accommodationData)

      let result
      if (accommodation) {
        // Mise à jour
        result = await supabase
          .from('accommodations')
          .update(accommodationData)
          .eq('id', accommodation.id)
      } else {
        // Création - pass single object, not array
        result = await supabase
          .from('accommodations')
          .insert(accommodationData)
      }

      console.log('📊 Résultat Supabase:', result)

      if (result.error) {
        console.error('❌ Erreur Supabase:', result.error)
        throw result.error
      }

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
      toast({
        title: "Erreur",
        description: accommodation 
          ? "Impossible de modifier l'hébergement." 
          : "Impossible de créer l'hébergement.",
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
                    <FormLabel>Nom</FormLabel>
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
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <FormLabel>Lieu</FormLabel>
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
                  <FormLabel>Description</FormLabel>
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
                    <FormLabel>Prix (€)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="150" {...field} />
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
                    <FormLabel>Note (0-5)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        max="5" 
                        step="0.1" 
                        placeholder="4.5" 
                        {...field} 
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
                      <Input type="number" placeholder="10" {...field} />
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
                    <FormLabel>Chambres</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="2" {...field} />
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
                    <FormLabel>Salles de bain</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
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
                    <FormLabel>Invités max</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="4" {...field} />
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

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
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
