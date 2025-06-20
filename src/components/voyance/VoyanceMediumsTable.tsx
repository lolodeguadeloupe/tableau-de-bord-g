
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, Star, Images } from "lucide-react"
import { VoyanceMediumModal } from "./VoyanceMediumModal"
import { useToast } from "@/hooks/use-toast"

export function VoyanceMediumsTable() {
  const [selectedMedium, setSelectedMedium] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const { toast } = useToast()

  const { data: mediums, isLoading, refetch } = useQuery({
    queryKey: ['voyance-mediums'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('voyance_mediums')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  const handleEdit = (medium: any) => {
    setSelectedMedium(medium)
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    try {
      const { error } = await supabase
        .from('voyance_mediums')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Médium supprimé",
        description: "Le médium a été supprimé avec succès."
      })
      refetch()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le médium.",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Médium</TableHead>
            <TableHead>Spécialités</TableHead>
            <TableHead>Langues</TableHead>
            <TableHead>Prix/séance</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mediums?.map((medium) => (
            <TableRow key={medium.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={medium.image} />
                      <AvatarFallback>
                        {medium.name?.charAt(0)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {medium.gallery_images && medium.gallery_images.length > 0 && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                        <Images className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{medium.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {medium.experience_years} ans d'expérience
                    </div>
                    {medium.location && (
                      <div className="text-xs text-muted-foreground">
                        📍 {medium.location}
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {medium.specialties?.slice(0, 2).map((specialty: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {medium.specialties?.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{medium.specialties.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {medium.languages?.slice(0, 2).map((lang: string, index: number) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium">
                  {medium.price_per_session}€
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{medium.rating}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={medium.is_active ? "default" : "secondary"}>
                  {medium.is_active ? "Actif" : "Inactif"}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(medium)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(medium.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <VoyanceMediumModal
        open={showModal}
        onOpenChange={setShowModal}
        medium={selectedMedium}
        onSuccess={() => {
          setShowModal(false)
          setSelectedMedium(null)
          refetch()
        }}
      />
    </>
  )
}
