import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { RestaurantModal } from "@/components/RestaurantModal"
import { useAuth } from "@/hooks/useAuth"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { RestaurantStats } from "@/components/restaurant/RestaurantStats"
import { AuthGuard } from "@/components/restaurant/AuthGuard"
import { EmptyState } from "@/components/restaurant/EmptyState"
import { transformRestaurantsToTableData, dataTableColumns, formatTableData } from "@/components/restaurant/RestaurantTableUtils"
import { useRestaurants } from "@/hooks/useRestaurants"
import { useRestaurantActions } from "@/hooks/useRestaurantActions"

export default function Restaurants() {
  const { user, loading: authLoading } = useAuth()
  const { restaurants, loading, fetchRestaurants } = useRestaurants(authLoading)
  const {
    isModalOpen,
    selectedRestaurant,
    deleteRestaurantId,
    setDeleteRestaurantId,
    handleEdit,
    handleDelete,
    handleModalClose,
    handleCreateNew
  } = useRestaurantActions(user, fetchRestaurants)

  console.log('🎯 État actuel:', { loading, restaurants: restaurants.length, isModalOpen, user: user?.id })

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Chargement des restaurants...</div>
      </div>
    )
  }

  if (!user) {
    return <AuthGuard />
  }

  const tableData = transformRestaurantsToTableData(restaurants)
  const formattedTableData = formatTableData(restaurants)

  const handleEditWrapper = (item: any) => {
    console.log('🎯 handleEditWrapper - item reçu:', item)
    
    // CORRECTION: Utiliser restaurants (complet) au lieu de tableData (transformé sans menus)
    const originalRestaurant = restaurants.find(r => r.id.toString() === item.id)
    console.log('🎯 handleEditWrapper - restaurant original avec menus:', originalRestaurant)
    console.log('📋 Menus du restaurant original:', originalRestaurant?.menus)
    
    if (originalRestaurant) {
      handleEdit({ ...originalRestaurant, id: originalRestaurant.id.toString() })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Restaurants</h1>
          <p className="text-muted-foreground">Gérez vos restaurants partenaires</p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau restaurant
        </Button>
      </div>

      {restaurants.length === 0 && !loading && <EmptyState />}

      <RestaurantStats restaurants={restaurants} />

      {restaurants.length > 0 && (
        <DataTable
          title="Liste des restaurants"
          data={formattedTableData}
          columns={dataTableColumns}
          onEdit={handleEditWrapper}
          onDelete={(id) => setDeleteRestaurantId(parseInt(id))}
        />
      )}

      <RestaurantModal
        restaurant={selectedRestaurant}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={fetchRestaurants}
      />

      <AlertDialog open={deleteRestaurantId !== null} onOpenChange={() => setDeleteRestaurantId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce restaurant ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteRestaurantId && handleDelete(deleteRestaurantId.toString())}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
