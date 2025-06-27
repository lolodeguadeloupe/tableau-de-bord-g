import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export interface CarRentalCompany {
  id?: string  // UUID as string
  business_name: string
  business_type?: string
  type: string
  image: string
  location: string
  description: string
  rating: number
  offer: string
  icon_name: string
  partner_id?: string
  gallery_images?: string[]
  created_at?: string
  updated_at?: string
  // Legacy fields for compatibility
  name?: string
}

export interface CarModel {
  id?: number
  company_id: string  // UUID as string
  name: string
  image: string
  price_per_day: number
  category: string
  seats: number
  transmission: string
  air_con: boolean
  is_active: boolean
  gallery_images?: string[]
  created_at?: string
  updated_at?: string
}

export interface CarRentalFeature {
  id?: number
  company_id: string  // UUID as string
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
        .from('partners')
        .select('*')
        .eq('business_type', 'car_rental')
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

      // Transform data to match the expected interface
      const transformedData = (data || []).map(partner => ({
        ...partner,
        name: partner.business_name, // Add legacy name field for compatibility
        id: partner.id // UUID as string
      }))

      return transformedData
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
      
      if (!companyData.business_name && !companyData.name || !companyData.type || !companyData.location) {
        throw new Error('Champs obligatoires manquants')
      }
      
      // Prepare gallery_images - ensure it's an array
      const galleryImages = Array.isArray(companyData.gallery_images) 
        ? companyData.gallery_images 
        : []
      
      // Use business_name or name for compatibility
      const businessName = companyData.business_name || companyData.name || ''
      
      if (companyData.id) {
        console.log('Updating company with ID:', companyData.id)
        
        // First, check if the company exists
        const { data: existingCompany, error: checkError } = await supabase
          .from('partners')
          .select('id')
          .eq('id', companyData.id)
          .single()

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking existing company:', checkError)
          throw new Error('Erreur lors de la vérification: ' + checkError.message)
        }

        if (!existingCompany) {
          console.error('Company not found with ID:', companyData.id)
          throw new Error('Compagnie non trouvée avec cet ID')
        }

        // Update existing company
        const { data, error } = await supabase
          .from('partners')
          .update({
            business_name: businessName,
            business_type: 'car_rental',
            type: companyData.type,
            image: companyData.image || '',
            location: companyData.location,
            description: companyData.description || '',
            rating: Number(companyData.rating) || 4.5,
            offer: companyData.offer || '',
            icon_name: companyData.icon_name || 'Car',
            gallery_images: galleryImages,
            updated_at: new Date().toISOString()
          })
          .eq('id', companyData.id)
          .select()

        if (error) {
          console.error('Update error:', error)
          throw new Error('Erreur de mise à jour: ' + error.message)
        }

        if (!data || data.length === 0) {
          console.error('No rows updated for ID:', companyData.id)
          throw new Error('Aucune ligne mise à jour')
        }

        console.log('Successfully updated company:', data[0])

        toast({
          title: "Succès",
          description: "La compagnie a été modifiée avec succès.",
        })

        return {
          ...data[0],
          name: data[0].business_name // Add legacy name field
        }
      } else {
        // Create new company
        const { data, error } = await supabase
          .from('partners')
          .insert({
            business_name: businessName,
            business_type: 'car_rental',
            type: companyData.type,
            image: companyData.image || '',
            location: companyData.location,
            description: companyData.description || '',
            rating: Number(companyData.rating) || 4.5,
            offer: companyData.offer || '',
            icon_name: companyData.icon_name || 'Car',
            gallery_images: galleryImages
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

        return {
          ...data[0],
          name: data[0].business_name // Add legacy name field
        }
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

  const deleteCompany = async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      const { error } = await supabase
        .from('partners')
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

  const fetchCarModels = async (companyId?: string): Promise<CarModel[]> => {
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
      
      // Prepare gallery_images - ensure it's an array
      const galleryImages = Array.isArray(modelData.gallery_images) 
        ? modelData.gallery_images 
        : []
      
      if (modelData.id) {
        // Update existing model
        const { data, error } = await supabase
          .from('car_models')
          .update({
            name: modelData.name,
            company_id: modelData.company_id, // Now UUID string
            image: modelData.image || '',
            price_per_day: Number(modelData.price_per_day) || 0,
            category: modelData.category,
            seats: Number(modelData.seats) || 5,
            transmission: modelData.transmission || 'Automatique',
            air_con: modelData.air_con ?? true,
            is_active: modelData.is_active ?? true,
            gallery_images: galleryImages,
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
            company_id: modelData.company_id, // Now UUID string
            image: modelData.image || '',
            price_per_day: Number(modelData.price_per_day) || 0,
            category: modelData.category,
            seats: Number(modelData.seats) || 5,
            transmission: modelData.transmission || 'Automatique',
            air_con: modelData.air_con ?? true,
            is_active: modelData.is_active ?? true,
            gallery_images: galleryImages
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
