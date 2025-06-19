import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export interface CarRentalCompany {
  id: number
  name: string
  type: string
  image: string
  location: string
  description: string
  rating: number
  offer: string
  icon_name: string
  partner_id?: string
  gallery_images?: any
  created_at?: string
  updated_at?: string
}

export interface CarModel {
  id: number
  company_id: number
  name: string
  image: string
  price_per_day: number
  category: string
  seats: number
  transmission: string
  air_con: boolean
  is_active: boolean
  gallery_images?: any
  created_at?: string
  updated_at?: string
}

export interface CarRentalFeature {
  id: number
  company_id: number
  feature: string
  created_at?: string
}

export function useCarRentalActions() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const fetchCompanies = async (): Promise<CarRentalCompany[]> => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('car_rental_companies')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching car rental companies:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les compagnies de location.",
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

  const saveCompany = async (companyData: Partial<CarRentalCompany>): Promise<CarRentalCompany | null> => {
    try {
      setLoading(true)
      console.log('Saving company:', companyData)
      
      if (!companyData.name || !companyData.type || !companyData.location) {
        throw new Error('Champs obligatoires manquants')
      }
      
      if (companyData.id) {
        // Update existing company
        const { data, error } = await supabase
          .from('car_rental_companies')
          .update({
            name: companyData.name,
            type: companyData.type,
            image: companyData.image || '',
            location: companyData.location,
            description: companyData.description || '',
            rating: Number(companyData.rating) || 4.5,
            offer: companyData.offer || '',
            icon_name: companyData.icon_name || 'Car',
            gallery_images: companyData.gallery_images || [],
            updated_at: new Date().toISOString()
          })
          .eq('id', companyData.id)
          .select()

        if (error) {
          console.error('Update error:', error)
          throw new Error('Erreur de mise à jour: ' + error.message)
        }

        if (!data || data.length === 0) {
          throw new Error('Aucune ligne mise à jour')
        }

        toast({
          title: "Succès",
          description: "La compagnie a été modifiée avec succès.",
        })

        return data[0]
      } else {
        // Create new company
        const { data, error } = await supabase
          .from('car_rental_companies')
          .insert({
            name: companyData.name,
            type: companyData.type,
            image: companyData.image || '',
            location: companyData.location,
            description: companyData.description || '',
            rating: Number(companyData.rating) || 4.5,
            offer: companyData.offer || '',
            icon_name: companyData.icon_name || 'Car',
            gallery_images: companyData.gallery_images || []
          })
          .select()

        if (error) {
          console.error('Insert error:', error)
          throw new Error('Erreur de création: ' + error.message)
        }

        if (!data || data.length === 0) {
          throw new Error('Aucune ligne insérée')
        }

        toast({
          title: "Succès",
          description: "La compagnie a été créée avec succès.",
        })

        return data[0]
      }
    } catch (error) {
      console.error('Error saving company:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      
      toast({
        title: "Erreur",
        description: `Impossible de sauvegarder la compagnie: ${errorMessage}`,
        variant: "destructive",
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteCompany = async (id: number): Promise<boolean> => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('car_rental_companies')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "La compagnie a été supprimée avec succès.",
      })

      return true
    } catch (error) {
      console.error('Error deleting company:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la compagnie.",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const fetchCarModels = async (companyId?: number): Promise<CarModel[]> => {
    try {
      setLoading(true)
      let query = supabase
        .from('car_models')
        .select('*')
        .order('created_at', { ascending: false })

      if (companyId) {
        query = query.eq('company_id', companyId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching car models:', error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les modèles de voitures.",
          variant: "destructive",
        })
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error:', error)
      return []
    } finally {
      setLoading(false)
    }
  }

  const saveCarModel = async (modelData: Partial<CarModel>): Promise<CarModel | null> => {
    try {
      setLoading(true)
      console.log('Saving car model:', modelData)
      
      if (!modelData.name || !modelData.company_id || !modelData.category) {
        throw new Error('Champs obligatoires manquants')
      }
      
      if (modelData.id) {
        // Update existing model
        const { data, error } = await supabase
          .from('car_models')
          .update({
            name: modelData.name,
            company_id: modelData.company_id,
            image: modelData.image || '',
            price_per_day: Number(modelData.price_per_day) || 0,
            category: modelData.category,
            seats: Number(modelData.seats) || 5,
            transmission: modelData.transmission || 'Automatique',
            air_con: modelData.air_con ?? true,
            is_active: modelData.is_active ?? true,
            gallery_images: modelData.gallery_images || [],
            updated_at: new Date().toISOString()
          })
          .eq('id', modelData.id)
          .select()

        if (error) {
          console.error('Update error:', error)
          throw new Error('Erreur de mise à jour: ' + error.message)
        }

        toast({
          title: "Succès",
          description: "Le modèle a été modifié avec succès.",
        })

        return data?.[0] || null
      } else {
        // Create new model
        const { data, error } = await supabase
          .from('car_models')
          .insert({
            name: modelData.name,
            company_id: modelData.company_id,
            image: modelData.image || '',
            price_per_day: Number(modelData.price_per_day) || 0,
            category: modelData.category,
            seats: Number(modelData.seats) || 5,
            transmission: modelData.transmission || 'Automatique',
            air_con: modelData.air_con ?? true,
            is_active: modelData.is_active ?? true,
            gallery_images: modelData.gallery_images || []
          })
          .select()

        if (error) {
          console.error('Insert error:', error)
          throw new Error('Erreur de création: ' + error.message)
        }

        toast({
          title: "Succès",
          description: "Le modèle a été créé avec succès.",
        })

        return data?.[0] || null
      }
    } catch (error) {
      console.error('Error saving car model:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue'
      
      toast({
        title: "Erreur",
        description: `Impossible de sauvegarder le modèle: ${errorMessage}`,
        variant: "destructive",
      })
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteCarModel = async (id: number): Promise<boolean> => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('car_models')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Succès",
        description: "Le modèle a été supprimé avec succès.",
      })

      return true
    } catch (error) {
      console.error('Error deleting car model:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le modèle.",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchCompanies,
    saveCompany,
    deleteCompany,
    fetchCarModels,
    saveCarModel,
    deleteCarModel,
    loading
  }
}
