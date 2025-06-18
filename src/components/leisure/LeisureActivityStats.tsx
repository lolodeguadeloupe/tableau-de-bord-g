
import { Users, Eye, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Loisir } from "@/types/leisure"

interface LeisureActivityStatsProps {
  loisirs: Loisir[]
}

export function LeisureActivityStats({ loisirs }: LeisureActivityStatsProps) {
  const totalParticipants = loisirs.reduce((sum, loisir) => sum + loisir.current_participants, 0)
  const totalAvailablePlaces = loisirs.reduce((sum, loisir) => sum + (loisir.max_participants - loisir.current_participants), 0)
  const fillRate = loisirs.length > 0 
    ? Math.round((totalParticipants / loisirs.reduce((sum, loisir) => sum + loisir.max_participants, 0)) * 100)
    : 0

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Loisirs</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loisirs.length}</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Participants Totaux</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalParticipants}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Places Disponibles</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAvailablePlaces}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Taux de Remplissage</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{fillRate}%</div>
        </CardContent>
      </Card>
    </div>
  )
}
