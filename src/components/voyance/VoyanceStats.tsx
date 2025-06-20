
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Star, TrendingUp } from "lucide-react"

export function VoyanceStats() {
  const { data: stats } = useQuery({
    queryKey: ['voyance-stats'],
    queryFn: async () => {
      const [mediumsResult, consultationsResult, reviewsResult] = await Promise.all([
        supabase.from('voyance_mediums').select('id', { count: 'exact' }),
        supabase.from('voyance_consultations').select('id', { count: 'exact' }),
        supabase.from('voyance_reviews').select('rating').order('created_at', { ascending: false })
      ])

      const totalMediums = mediumsResult.count || 0
      const totalConsultations = consultationsResult.count || 0
      const reviews = reviewsResult.data || []
      const averageRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0

      return {
        totalMediums,
        totalConsultations,
        totalReviews: reviews.length,
        averageRating
      }
    }
  })

  const statCards = [
    {
      title: "Médiums actifs",
      value: stats?.totalMediums || 0,
      icon: Users,
      description: "Médiums enregistrés"
    },
    {
      title: "Consultations",
      value: stats?.totalConsultations || 0,
      icon: Calendar,
      description: "Total des consultations"
    },
    {
      title: "Avis clients",
      value: stats?.totalReviews || 0,
      icon: Star,
      description: "Nombre d'avis"
    },
    {
      title: "Note moyenne",
      value: stats?.averageRating ? stats.averageRating.toFixed(1) : "0.0",
      icon: TrendingUp,
      description: "Sur 5 étoiles"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
