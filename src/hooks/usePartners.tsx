
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

export interface Partner {
  id: number
  business_name: string
  business_type: string
  description: string | null
  address: string | null
  phone: string | null
  website: string | null
  image: string | null
  location: string | null
  rating: number | null
  offer: string | null
  icon_name: string | null
  type: string | null
  gallery_images: string[]
  status: string
  created_at: string
  updated_at: string
}

export function usePartners(authLoading: boolean) {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchPartners = async () => {
    if (authLoading) return

    try {
      console.log('🔍 Récupération des partenaires...')
      setLoading(true)

      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erreur lors de la récupération des partenaires:', error)
        throw error
      }

      console.log('✅ Partenaires récupérés:', data?.length || 0)
      setPartners(data || [])
    } catch (error) {
      console.error('💥 Erreur lors de la récupération des partenaires:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les partenaires.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [authLoading])

  return {
    partners,
    loading,
    fetchPartners
  }
}
