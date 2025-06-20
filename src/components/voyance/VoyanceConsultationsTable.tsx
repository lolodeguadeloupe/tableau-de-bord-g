
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Phone, Mail } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function VoyanceConsultationsTable() {
  const { data: consultations, isLoading } = useQuery({
    queryKey: ['voyance-consultations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('voyance_consultations')
        .select(`
          *,
          voyance_mediums!inner(name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning'
      case 'confirmed':
        return 'default'
      case 'completed':
        return 'success'
      case 'cancelled':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente'
      case 'confirmed':
        return 'Confirmée'
      case 'completed':
        return 'Terminée'
      case 'cancelled':
        return 'Annulée'
      default:
        return status
    }
  }

  if (isLoading) {
    return <div>Chargement...</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client</TableHead>
          <TableHead>Médium</TableHead>
          <TableHead>Date/Heure</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {consultations?.map((consultation) => (
          <TableRow key={consultation.id}>
            <TableCell>
              <div>
                <div className="font-medium">{consultation.client_name}</div>
                <div className="text-sm text-muted-foreground">
                  {consultation.client_email}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="font-medium">
                {consultation.voyance_mediums?.name}
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium">
                  {format(new Date(consultation.preferred_date), 'dd MMM yyyy', { locale: fr })}
                </div>
                <div className="text-sm text-muted-foreground">
                  {consultation.preferred_time}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {consultation.consultation_type}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={getStatusColor(consultation.status) as any}>
                {getStatusLabel(consultation.status)}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${consultation.client_phone}`}>
                    <Phone className="h-4 w-4" />
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`mailto:${consultation.client_email}`}>
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
