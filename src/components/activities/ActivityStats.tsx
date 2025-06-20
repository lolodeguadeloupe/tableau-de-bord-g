
import { Activity } from "@/types/activity"
import { StatCard } from "@/components/StatCard"
import { Activity as ActivityIcon, Eye, EyeOff } from "lucide-react"

interface ActivityStatsProps {
  activities: Activity[]
}

export function ActivityStats({ activities }: ActivityStatsProps) {
  const totalActivities = activities.length
  const activeActivities = activities.filter(activity => activity.is_active).length
  const inactiveActivities = totalActivities - activeActivities

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Total des activités"
        value={totalActivities}
        icon={ActivityIcon}
        description="Nombre total d'activités"
      />
      <StatCard
        title="Activités visibles"
        value={activeActivities}
        icon={Eye}
        description="Activités affichées sur le site"
        className="border-green-200 bg-green-50"
      />
      <StatCard
        title="Activités masquées"
        value={inactiveActivities}
        icon={EyeOff}
        description="Activités non affichées"
        className="border-orange-200 bg-orange-50"
      />
    </div>
  )
}
