
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { NightlifeEvent, NightlifeEventTableData } from "@/types/nightlife"

export function useNightlifeActions() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchEvents = async (): Promise<NightlifeEvent[]> => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('nightlife_events')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching nightlife events:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les événements de soirée.",
          variant: "destructive",
        })
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite.",
        variant: "destructive",
      })
      return []
    } finally {
      setLoading(false)
    }
  }

  const saveEvent = async (eventData: Partial<NightlifeEvent>): Promise<NightlifeEvent | null> => {
    try {
      setLoading(true)
      console.log('saveEvent called with:', eventData)
      
      if (eventData.id) {
        // Update existing event
        console.log('Updating event with ID:', eventData.id)
        const { data, error } = await supabase
          .from('nightlife_events')
          .update({
            name: eventData.name,
            type: eventData.type,
            venue: eventData.venue,
            image: eventData.image,
            description: eventData.description,
            date: eventData.date,
            time: eventData.time,
            price: eventData.price,
            offer: eventData.offer,
            rating: eventData.rating,
            features: eventData.features,
            gallery_images: eventData.gallery_images,
            updated_at: new Date().toISOString()
          })
          .eq('id', eventData.id)
          .select()

        if (error) {
          console.error('Update error:', error)
          throw error
        }

        console.log('Update result:', data)

        if (!data || data.length === 0) {
          throw new Error('No rows updated')
        }

        toast({
          title: "Succès",
          description: "L'événement de soirée a été modifié avec succès.",
        })

        return data[0]
      } else {
        // Create new event
        console.log('Creating new event')
        const { data, error } = await supabase
          .from('nightlife_events')
          .insert({
            name: eventData.name,
            type: eventData.type,
            venue: eventData.venue,
            image: eventData.image || eventData.gallery_images?.[0] || '',
            description: eventData.description,
            date: eventData.date,
            time: eventData.time,
            price: eventData.price,
            offer: eventData.offer,
            rating: eventData.rating || 4.5,
            features: eventData.features || [],
            gallery_images: eventData.gallery_images || []
          })
          .select()

        if (error) {
          console.error('Insert error:', error)
          throw error
        }

        console.log('Insert result:', data)

        if (!data || data.length === 0) {
          throw new Error('No rows inserted')
        }

        toast({
          title: "Succès",
          description: "L'événement de soirée a été créé avec succès.",
        })

        return data[0]
      }
    } catch (error) {
      console.error('Error saving nightlife event:', error)
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder l'événement de soirée.",
        variant: "destructive",
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (eventData: NightlifeEventTableData): NightlifeEvent => {
    console.log('Converting table data to event data:', eventData)
    
    // Ensure all required fields are properly converted and present
    const convertedEvent: NightlifeEvent = {
      id: parseInt(eventData.id),
      name: eventData.name || '',
      type: eventData.type || '',
      venue: eventData.venue || '',
      image: eventData.image || '',
      description: eventData.description || '',
      date: eventData.date || '',
      time: eventData.time || '',
      price: eventData.price || 0,
      offer: eventData.offer || '',
      rating: eventData.rating || 4.5,
      features: Array.isArray(eventData.features) ? eventData.features : [],
      gallery_images: Array.isArray(eventData.gallery_images) ? eventData.gallery_images : []
    }
    
    console.log('Converted event data:', convertedEvent)
    return convertedEvent
  }

  const handleDelete = async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('nightlife_events')
        .delete()
        .eq('id', parseInt(id))

      if (error) throw error

      toast({
        title: "Succès",
        description: "L'événement de soirée a été supprimé avec succès.",
      })

      return true
    } catch (error) {
      console.error('Error deleting nightlife event:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'événement de soirée.",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchEvents,
    saveEvent,
    handleEdit,
    handleDelete,
    loading
  }
}
