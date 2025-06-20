
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
import { Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface BonsPlansTableProps {
  onEdit: (bonPlan: any) => void
}

export function BonsPlansTable({ onEdit }: BonsPlansTableProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const { data: bonsPlans, refetch } = useQuery({
    queryKey: ['bons-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bons_plans')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('bons_plans')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Statut modifié",
        description: `Le bon plan a été ${!currentStatus ? 'activé' : 'désactivé'}.`
      })

      refetch()
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce bon plan ?')) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('bons_plans')
        .delete()
        .eq('id', id)

      if (error) throw error

      toast({
        title: "Bon plan supprimé",
        description: "Le bon plan a été supprimé avec succès."
      })

      refetch()
    } catch (error) {
      console.error('Erreur:', error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le bon plan.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  if (!bonsPlans) {
    return <div>Chargement...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titre</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Badge</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bonsPlans.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              Aucun bon plan trouvé
            </TableCell>
          </TableRow>
        ) : (
          bonsPlans.map((bonPlan) => (
            <TableRow key={bonPlan.id}>
              <TableCell className="font-medium">{bonPlan.title}</TableCell>
              <TableCell className="max-w-xs truncate">{bonPlan.description}</TableCell>
              <TableCell>
                {bonPlan.badge && (
                  <Badge variant="secondary">{bonPlan.badge}</Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={bonPlan.is_active ? "default" : "secondary"}>
                  {bonPlan.is_active ? "Actif" : "Inactif"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(bonPlan.id, bonPlan.is_active)}
                    disabled={loading}
                  >
                    {bonPlan.is_active ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(bonPlan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(bonPlan.id)}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
