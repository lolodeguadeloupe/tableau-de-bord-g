
import { useState, useEffect } from "react"
import { User, CreditCard, Activity, Calendar } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

interface Subscription {
  id: string
  plan_name: string
  status: string
  start_date: string
  end_date: string | null
  price: number
  currency: string
  auto_renew: boolean
}

interface Consumption {
  id: string
  service_type: string
  service_name: string
  consumption_date: string
  amount_consumed: number
  currency: string
  status: string
}

interface UserDetailsModalProps {
  user: {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
    role: string
    created_at: string
  } | null
  isOpen: boolean
  onClose: () => void
}

export function UserDetailsModal({ user, isOpen, onClose }: UserDetailsModalProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [consumption, setConsumption] = useState<Consumption[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user && isOpen) {
      fetchUserData()
    }
  }, [user, isOpen])

  const fetchUserData = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Récupérer les abonnements
      const { data: subsData, error: subsError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (subsError) throw subsError

      // Récupérer la consommation
      const { data: consData, error: consError } = await supabase
        .from('user_consumption')
        .select('*')
        .eq('user_id', user.id)
        .order('consumption_date', { ascending: false })
        .limit(10)

      if (consError) throw consError

      setSubscriptions(subsData || [])
      setConsumption(consData || [])
    } catch (error: any) {
      console.error('Erreur lors de la récupération des données:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de l'utilisateur.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      expired: "destructive", 
      cancelled: "secondary",
      completed: "default"
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status === 'active' ? 'Actif' :
         status === 'expired' ? 'Expiré' :
         status === 'cancelled' ? 'Annulé' :
         status === 'completed' ? 'Terminé' : status}
      </Badge>
    )
  }

  if (!user) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Détails de l'utilisateur
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nom complet</p>
                  <p className="font-medium">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : "Non renseigné"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rôle</p>
                  <Badge variant={
                    user.role === "admin" ? "default" : 
                    user.role === "editor" ? "secondary" : 
                    "outline"
                  }>
                    {user.role === "admin" ? "Administrateur" :
                     user.role === "editor" ? "Éditeur" : "Utilisateur"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inscrit le</p>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Onglets pour abonnements et consommation */}
          <Tabs defaultValue="subscriptions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="subscriptions" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Abonnements ({subscriptions.length})
              </TabsTrigger>
              <TabsTrigger value="consumption" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Consommation ({consumption.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="subscriptions" className="space-y-4">
              {loading ? (
                <p className="text-center text-muted-foreground">Chargement...</p>
              ) : subscriptions.length === 0 ? (
                <p className="text-center text-muted-foreground">Aucun abonnement trouvé</p>
              ) : (
                subscriptions.map((sub) => (
                  <Card key={sub.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{sub.plan_name}</h4>
                            {getStatusBadge(sub.status)}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Du {new Date(sub.start_date).toLocaleDateString('fr-FR')}
                              {sub.end_date && ` au ${new Date(sub.end_date).toLocaleDateString('fr-FR')}`}
                            </p>
                            <p>Renouvellement automatique : {sub.auto_renew ? 'Oui' : 'Non'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">{sub.price}€</p>
                          <p className="text-sm text-muted-foreground">{sub.currency}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="consumption" className="space-y-4">
              {loading ? (
                <p className="text-center text-muted-foreground">Chargement...</p>
              ) : consumption.length === 0 ? (
                <p className="text-center text-muted-foreground">Aucune consommation trouvée</p>
              ) : (
                consumption.map((cons) => (
                  <Card key={cons.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{cons.service_name}</h4>
                            <Badge variant="outline">{cons.service_type}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <p className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(cons.consumption_date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold">{cons.amount_consumed}€</p>
                          <p className="text-sm text-muted-foreground">{cons.currency}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
