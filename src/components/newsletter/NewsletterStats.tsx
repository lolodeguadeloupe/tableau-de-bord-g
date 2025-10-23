import { Mail, TrendingUp, Users, UserPlus } from "lucide-react"
import { StatCard } from "@/components/StatCard"
import type { NewsletterStats } from "@/types/newsletter"

interface NewsletterStatsProps {
  stats: NewsletterStats | null
  loading: boolean
}

export function NewsletterStats({ stats, loading }: NewsletterStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total des abonnés"
          value="0"
          change="Aucune donnée"
          changeType="neutral"
          icon={Users}
        />
        <StatCard
          title="Ce mois-ci"
          value="0"
          change="Aucune donnée"
          changeType="neutral"
          icon={UserPlus}
        />
        <StatCard
          title="Croissance"
          value="0%"
          change="Aucune donnée"
          changeType="neutral"
          icon={TrendingUp}
        />
        <StatCard
          title="Newsletter"
          value="Actif"
          change="Système opérationnel"
          changeType="positive"
          icon={Mail}
        />
      </div>
    )
  }

  const formatGrowthChange = (percentage: number) => {
    if (percentage === 0) return "Aucun changement"
    if (percentage > 0) return `+${percentage}% ce mois`
    return `${percentage}% ce mois`
  }

  const getGrowthType = (percentage: number): 'positive' | 'negative' | 'neutral' => {
    if (percentage > 0) return 'positive'
    if (percentage < 0) return 'negative'
    return 'neutral'
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total des abonnés"
        value={stats.totalSubscribers.toLocaleString()}
        change={`${stats.totalSubscribers} personnes inscrites`}
        changeType="neutral"
        icon={Users}
      />
      <StatCard
        title="Nouveaux ce mois"
        value={stats.monthlyGrowth}
        change={`${stats.recentSubscriptions} nouvelles inscriptions`}
        changeType={stats.monthlyGrowth > 0 ? "positive" : "neutral"}
        icon={UserPlus}
      />
      <StatCard
        title="Taux de croissance"
        value={`${stats.growthPercentage}%`}
        change={formatGrowthChange(stats.growthPercentage)}
        changeType={getGrowthType(stats.growthPercentage)}
        icon={TrendingUp}
      />
      <StatCard
        title="Newsletter"
        value="Actif"
        change="Système opérationnel"
        changeType="positive"
        icon={Mail}
      />
    </div>
  )
}