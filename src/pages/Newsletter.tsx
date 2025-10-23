import { useAuth } from "@/hooks/useAuth"
import { useNewsletterActions } from "@/hooks/useNewsletterActions"
import { NewsletterStats } from "@/components/newsletter/NewsletterStats"
import { NewsletterTable } from "@/components/newsletter/NewsletterTable"
import { Mail, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Newsletter() {
  const { isAdmin, isSuperAdmin, loading: authLoading } = useAuth()
  const {
    subscriptions,
    stats,
    loading,
    error,
    deleteSubscription,
    refreshData
  } = useNewsletterActions()

  // Seuls les Admin et Super Admin peuvent accéder à cette page
  if (!isAdmin && !isSuperAdmin && !authLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Accès refusé</h2>
          <p className="text-muted-foreground">
            Seuls les Administrateurs peuvent accéder à la gestion des newsletters.
          </p>
        </div>
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-muted-foreground">Vérification des permissions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-indigo-600/10 flex items-center justify-center">
            <Mail className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Newsletter</h1>
            <p className="text-muted-foreground">
              Gérez les abonnements et visualisez les statistiques de votre newsletter
            </p>
          </div>
        </div>
        <Button
          onClick={refreshData}
          variant="outline"
          className="flex items-center gap-2"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-medium">Erreur de chargement</h3>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Statistics */}
      <NewsletterStats stats={stats} loading={loading} />

      {/* Table */}
      <NewsletterTable
        subscriptions={subscriptions}
        loading={loading}
        onDelete={deleteSubscription}
      />

      {/* Empty State */}
      {!loading && subscriptions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Mail className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Aucun abonnement newsletter
          </h3>
          <p className="text-muted-foreground mb-4">
            Il n'y a actuellement aucune personne inscrite à votre newsletter.
          </p>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      )}
    </div>
  )
}