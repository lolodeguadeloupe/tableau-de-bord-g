
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
import { Star } from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export function VoyanceReviewsTable() {
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['voyance-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('voyance_reviews')
        .select(`
          *,
          voyance_mediums!inner(name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ))
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
          <TableHead>Note</TableHead>
          <TableHead>Commentaire</TableHead>
          <TableHead>Date consultation</TableHead>
          <TableHead>Publié le</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews?.map((review) => (
          <TableRow key={review.id}>
            <TableCell>
              <div className="font-medium">{review.client_name}</div>
            </TableCell>
            <TableCell>
              <div className="font-medium">
                {review.voyance_mediums?.name}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  {renderStars(review.rating)}
                </div>
                <Badge variant="secondary">
                  {review.rating}/5
                </Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="max-w-xs truncate text-sm">
                {review.comment}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm">
                {format(new Date(review.consultation_date), 'dd MMM yyyy', { locale: fr })}
              </div>
            </TableCell>
            <TableCell>
              <div className="text-sm text-muted-foreground">
                {format(new Date(review.created_at), 'dd MMM yyyy', { locale: fr })}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
