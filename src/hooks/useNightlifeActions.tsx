
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
      console.log('=== SAVE EVENT START ===')
      console.log('Raw eventData received:', JSON.stringify(eventData, null, 2))
      
      // Validate required fields
      if (!eventData.name || !eventData.type || !eventData.venue) {
        console.error('Missing required fields:', { name: eventData.name, type: eventData.type, venue: eventData.venue })
        throw new Error('Champs obligatoires manquants')
      }
      
      if (eventData.id) {
        // Update existing event
        const eventId = typeof eventData.id === 'string' ? parseInt(eventData.id) : eventData.id
        console.log('Updating event with ID:', eventId, 'type:', typeof eventId)
        
        // Prepare update data
        const updateData = {
          name: eventData.name,
          type: eventData.type,
          venue: eventData.venue,
          image: eventData.image || '',
          description: eventData.description || '',
          date: eventData.date || '',
          time: eventData.time || '',
          price: Number(eventData.price) || 0,
          offer: eventData.offer || '',
          rating: Number(eventData.rating) || 4.5,
          features: Array.isArray(eventData.features) ? eventData.features : [],
          gallery_images: Array.isArray(eventData.gallery_images) ? eventData.gallery_images : [],
          updated_at: new Date().toISOString()
        }
        
        console.log('Update data prepared:', JSON.stringify(updateData, null, 2))
        
        // Check current user session
        const { data: session, error: sessionError } = await supabase.auth.getSession()
        console.log('Current session:', session?.session?.user?.id, 'Session error:', sessionError)
        
        // Try the update with better error handling
        const { data, error, status, statusText } = await supabase
          .from('nightlife_events')
          .update(updateData)
          .eq('id', eventId)
          .select()

        console.log('Update response:', { data, error, status, statusText })

        if (error) {
          console.error('Update error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          throw new Error('Erreur de mise à jour: ' + error.message)
        }

        if (!data || data.length === 0) {
          // Try to fetch the event again to see if it still exists
          const { data: checkData, error: checkError } = await supabase
            .from('nightlife_events')
            .select('*')
            .eq('id', eventId)
            .single()
          
          console.log('Event check after failed update:', { checkData, checkError })
          
          if (checkError) {
            throw new Error('Événement non trouvé après tentative de mise à jour: ' + checkError.message)
          }
          
          throw new Error('Aucune ligne mise à jour - possible problème de permissions RLS')
        }

        console.log('Update successful:', data)

        toast({
          title: "Succès",
          description: "L'événement de soirée a été modifié avec succès.",
        })

        return data[0]
      } else {
        // Create new event
        console.log('Creating new event')
        
        const insertData = {
          name: eventData.name,
          type: eventData.type,
          venue: eventData.venue,
          image: eventData.image || eventData.gallery_images?.[0] || '',
          description: eventData.description || '',
          date: eventData.date || '',
          time: eventData.time || '',
          price: Number(eventData.price) || 0,
          offer: eventData.offer || '',
          rating: Number(eventData.rating) || 4.5,
          features: Array.isArray(eventData.features) ? eventData.features : [],
          gallery_images: Array.isArray(eventData.gallery_images) ? eventData.gallery_images : []
        }
        
        console.log('Insert data prepared:', JSON.stringify(insertData, null, 2))
        
        const { data, error } = await supabase
          .from('nightlife_events')
          .insert(insertData)
          .select()

        if (error) {
          console.error('Insert error:', error)
          throw new Error('Erreur de création: ' + error.message)
        }

        console.log('Insert result:', data)

        if (!data || data.length === 0) {
          throw new Error('Aucune ligne insérée')
        }

        toast({
          title: "Succès",
          description: "L'événement de soirée a été créé avec succès.",
        })

        return data[0]
      }
    } catch (error) {
      console.error('=== SAVE EVENT ERROR ===')
      console.error('Error saving nightlife event:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      console.error('Error message:', errorMessage)
      
      toast({
        title: "Erreur",
        description: `Impossible de sauvegarder l'événement de soirée: ${errorMessage}`,
        variant: "destructive",
      })
      return null
    } finally {
      setLoading(false)
      console.log('=== SAVE EVENT END ===')
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
