import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { NewsletterSubscription, NewsletterStats, UseNewsletterActionsReturn } from "@/types/newsletter"

export function useNewsletterActions(): UseNewsletterActionsReturn {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([])
  const [stats, setStats] = useState<NewsletterStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erreur lors du chargement des abonnements:', error)
        throw error
      }

      setSubscriptions(data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      setError(errorMessage)
      toast({
        title: "Erreur",
        description: "Impossible de charger les abonnements newsletter.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('created_at')

      if (error) {
        console.error('❌ Erreur lors du chargement des statistiques:', error)
        throw error
      }

      const now = new Date()
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

      const totalSubscribers = data?.length || 0
      const currentMonthSubs = data?.filter(sub => 
        new Date(sub.created_at) >= currentMonth
      ).length || 0
      
      const previousMonthSubs = data?.filter(sub => {
        const createdDate = new Date(sub.created_at)
        return createdDate >= previousMonth && createdDate < currentMonth
      }).length || 0

      const growthPercentage = previousMonthSubs > 0 
        ? ((currentMonthSubs - previousMonthSubs) / previousMonthSubs) * 100 
        : currentMonthSubs > 0 ? 100 : 0

      setStats({
        totalSubscribers,
        monthlyGrowth: currentMonthSubs,
        recentSubscriptions: currentMonthSubs,
        growthPercentage: Math.round(growthPercentage * 100) / 100
      })
    } catch (err) {
      console.error('❌ Erreur lors du calcul des statistiques:', err)
    }
  }

  const deleteSubscription = async (id: string) => {
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Erreur lors de la suppression:', error)
        throw error
      }

      toast({
        title: "Succès",
        description: "L'abonnement a été supprimé avec succès.",
      })

      // Refresh data
      await Promise.all([fetchSubscriptions(), fetchStats()])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue'
      toast({
        title: "Erreur",
        description: `Impossible de supprimer l'abonnement: ${errorMessage}`,
        variant: "destructive",
      })
    }
  }

  const refreshData = () => {
    Promise.all([fetchSubscriptions(), fetchStats()])
  }

  useEffect(() => {
    refreshData()
  }, [])

  return {
    subscriptions,
    stats,
    loading,
    error,
    deleteSubscription,
    refreshData
  }
}