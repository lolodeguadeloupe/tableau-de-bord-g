
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { Eye, EyeOff, Euro } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import type { TravelOffer, TravelOfferTableData } from "@/types/travel"

interface TravelTableProps {
  offers: TravelOffer[]
  onEdit: (offer: TravelOffer) => void
  onDelete: (id: string) => void
  onRefresh: () => void
}

export function TravelTable({ offers, onEdit, onDelete, onRefresh }: TravelTableProps) {
  const { toast } = useToast()

  const toggleVisibility = async (offer: TravelOffer) => {
    try {
      const { error } = await supabase
        .from('travel_offers')
        .update({ is_active: !offer.is_active })
        .eq('id', offer.id)

      if (error) throw error

      toast({
        title: "Statut mis à jour",
        description: `L'offre de voyage est maintenant ${!offer.is_active ? 'visible' : 'masquée'}.`,
      })

      onRefresh()
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de l'offre.",
        variant: "destructive",
      })
    }
  }

  const tableData: TravelOfferTableData[] = offers.map(offer => ({
    ...offer,
    id: offer.id.toString(),
    _originalPrice: offer.price,
    status: (
      <div className="flex items-center gap-2">
        <Badge 
          variant={offer.is_active ? "default" : "secondary"}
          className={offer.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
        >
          {offer.is_active ? (
            <>
              <Eye className="h-3 w-3 mr-1" />
              Visible
            </>
          ) : (
            <>
              <EyeOff className="h-3 w-3 mr-1" />
              Masquée
            </>
          )}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleVisibility(offer)}
          className="h-8 w-8 p-0 hover:bg-gray-100"
        >
          {offer.is_active ? (
            <Eye className="h-4 w-4 text-green-600" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-600" />
          )}
        </Button>
      </div>
    ),
    price: (
      <div className="flex items-center gap-1">
        <Euro className="h-4 w-4 text-green-600" />
        <span className="font-medium">{offer.price.toFixed(0)}€</span>
      </div>
    )
  }))

  const columns = [
    { key: 'title', label: 'Titre' },
    { key: 'destination', label: 'Destination' },
    { key: 'duration_days', label: 'Durée (jours)' },
    { key: 'price', label: 'Prix' },
    { key: 'current_participants', label: 'Participants' },
    { key: 'status', label: 'Statut' }
  ]

  const handleEdit = (item: TravelOfferTableData) => {
    const offer: TravelOffer = {
      ...item,
      id: parseInt(item.id),
      price: item._originalPrice
    }
    onEdit(offer)
  }

  if (offers.length === 0) {
    return (
      <div className="text-center p-8 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-lg font-medium text-blue-800">Aucune offre de voyage trouvée</p>
        <p className="text-blue-600 mt-2">
          La table 'travel_offers' semble être vide. Créez votre première offre en cliquant sur "Nouveau voyage".
        </p>
      </div>
    )
  }

  return (
    <DataTable
      title="Liste des offres de voyage"
      data={tableData}
      columns={columns}
      onEdit={handleEdit}
      onDelete={onDelete}
    />
  )
}
