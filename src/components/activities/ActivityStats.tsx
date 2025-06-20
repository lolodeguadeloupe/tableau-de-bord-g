
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
        change="Nombre total d'activités"
        changeType="neutral"
      />
      <StatCard
        title="Activités visibles"
        value={activeActivities}
        icon={Eye}
        change="Activités affichées sur le site"
        changeType="positive"
      />
      <StatCard
        title="Activités masquées"
        value={inactiveActivities}
        icon={EyeOff}
        change="Activités non affichées"
        changeType="neutral"
      />
    </div>
  )
}
