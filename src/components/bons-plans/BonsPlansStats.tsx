
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tag, TrendingUp, Eye, Users } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export function BonsPlansStats() {
  const { data: stats } = useQuery({
    queryKey: ['bons-plans-stats'],
    queryFn: async () => {
      const { data: bonsPlans, error } = await supabase
        .from('bons_plans')
        .select('*')

      if (error) throw error

      const total = bonsPlans?.length || 0
      const active = bonsPlans?.filter(bp => bp.is_active)?.length || 0
      const inactive = total - active

      return {
        total,
        active,
        inactive,
        engagement: Math.floor(Math.random() * 100) // Placeholder
      }
    }
  })

  const statCards = [
    {
      title: "Total des bons plans",
      value: stats?.total || 0,
      icon: Tag,
      description: "Offres créées"
    },
    {
      title: "Bons plans actifs",
      value: stats?.active || 0,
      icon: TrendingUp,
      description: "Offres en cours"
    },
    {
      title: "Bons plans inactifs",
      value: stats?.inactive || 0,
      icon: Eye,
      description: "Offres désactivées"
    },
    {
      title: "Engagement",
      value: `${stats?.engagement || 0}%`,
      icon: Users,
      description: "Taux d'intérêt"
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
