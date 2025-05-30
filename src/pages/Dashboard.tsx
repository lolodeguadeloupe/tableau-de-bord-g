
import { Users, FileText, Eye, TrendingUp, Activity, Clock } from "lucide-react"
import { StatCard } from "@/components/StatCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

const statsData = [
  {
    title: "Utilisateurs Total",
    value: "12,543",
    change: "+12% ce mois",
    changeType: "positive" as const,
    icon: Users
  },
  {
    title: "Articles Publiés",
    value: "1,429",
    change: "+8% ce mois",
    changeType: "positive" as const,
    icon: FileText
  },
  {
    title: "Pages Vues",
    value: "89,432",
    change: "-3% ce mois",
    changeType: "negative" as const,
    icon: Eye
  },
  {
    title: "Taux de Conversion",
    value: "3.2%",
    change: "+0.5% ce mois",
    changeType: "positive" as const,
    icon: TrendingUp
  }
]

const chartData = [
  { name: 'Jan', utilisateurs: 400, articles: 240 },
  { name: 'Fév', utilisateurs: 300, articles: 139 },
  { name: 'Mar', utilisateurs: 200, articles: 980 },
  { name: 'Avr', utilisateurs: 278, articles: 390 },
  { name: 'Mai', utilisateurs: 189, articles: 480 },
  { name: 'Jun', utilisateurs: 239, articles: 380 }
]

const trafficData = [
  { name: 'Organique', value: 400, color: '#3b82f6' },
  { name: 'Direct', value: 300, color: '#10b981' },
  { name: 'Social', value: 200, color: '#f59e0b' },
  { name: 'Référent', value: 100, color: '#ef4444' }
]

const recentActivity = [
  { action: "Nouvel utilisateur inscrit", time: "Il y a 2 minutes", icon: Users },
  { action: "Article publié", time: "Il y a 15 minutes", icon: FileText },
  { action: "Mise à jour système", time: "Il y a 1 heure", icon: Activity },
  { action: "Sauvegarde effectuée", time: "Il y a 2 heures", icon: Clock }
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Vue d'ensemble de votre site</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Évolution Mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--background))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="utilisateurs" fill="#3b82f6" radius={4} />
                <Bar dataKey="articles" fill="#10b981" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-border/40">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Sources de Trafic</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trafficData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {trafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activité récente */}
      <Card className="border border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Activité Récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-600/10 flex items-center justify-center">
                  <activity.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
