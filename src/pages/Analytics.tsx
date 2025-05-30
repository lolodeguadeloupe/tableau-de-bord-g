
import { TrendingUp, Users, Eye, Clock } from "lucide-react"
import { StatCard } from "@/components/StatCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from "recharts"

const analyticsStats = [
  {
    title: "Pages Vues",
    value: "45,231",
    change: "+12% vs mois dernier",
    changeType: "positive" as const,
    icon: Eye
  },
  {
    title: "Visiteurs Uniques",
    value: "18,543",
    change: "+8% vs mois dernier",
    changeType: "positive" as const,
    icon: Users
  },
  {
    title: "Temps Moyen",
    value: "3m 24s",
    change: "+15s vs mois dernier",
    changeType: "positive" as const,
    icon: Clock
  },
  {
    title: "Taux de Rebond",
    value: "34.2%",
    change: "-2.1% vs mois dernier",
    changeType: "positive" as const,
    icon: TrendingUp
  }
]

const trafficData = [
  { date: '01/05', visiteurs: 1200, pages: 3400, duree: 180 },
  { date: '02/05', visiteurs: 1100, pages: 3200, duree: 165 },
  { date: '03/05', visiteurs: 1400, pages: 3800, duree: 195 },
  { date: '04/05', visiteurs: 1300, pages: 3600, duree: 210 },
  { date: '05/05', visiteurs: 1600, pages: 4200, duree: 225 },
  { date: '06/05', visiteurs: 1500, pages: 4000, duree: 200 },
  { date: '07/05', visiteurs: 1800, pages: 4800, duree: 240 }
]

const topPages = [
  { page: "/", vues: 12543, pourcentage: 28 },
  { page: "/about", vues: 8921, pourcentage: 20 },
  { page: "/contact", vues: 6754, pourcentage: 15 },
  { page: "/services", vues: 5432, pourcentage: 12 },
  { page: "/blog", vues: 4321, pourcentage: 10 }
]

const deviceData = [
  { device: 'Desktop', sessions: 15423, pourcentage: 65 },
  { device: 'Mobile', sessions: 7234, pourcentage: 30 },
  { device: 'Tablet', sessions: 1234, pourcentage: 5 }
]

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Statistiques & Analytics</h1>
          <p className="text-muted-foreground mt-1">Analysez les performances de votre site</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Période: 7 derniers jours
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Graphiques de trafic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Évolution du Trafic</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="visiteurs" 
                  stroke="#3b82f6" 
                  fill="url(#colorVisiteurs)" 
                  strokeWidth={2}
                />
                <defs>
                  <linearGradient id="colorVisiteurs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Pages Vues par Jour</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="pages" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tables des top pages et appareils */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Pages les Plus Visitées</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{page.page}</p>
                    <p className="text-sm text-muted-foreground">{page.vues.toLocaleString()} vues</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${page.pourcentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground w-8">
                      {page.pourcentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Répartition par Appareil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceData.map((device, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{device.device}</p>
                    <p className="text-sm text-muted-foreground">{device.sessions.toLocaleString()} sessions</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{ width: `${device.pourcentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground w-8">
                      {device.pourcentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
