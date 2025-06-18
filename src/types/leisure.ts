
import type { Json } from "@/integrations/supabase/types"

export interface Loisir {
  id: number
  title: string
  description: string
  location: string
  start_date: string
  end_date: string
  max_participants: number
  current_participants: number
  image: string
  gallery_images?: Json
}

export interface LoisirTableData extends Omit<Loisir, 'id'> {
  id: string
  availability: JSX.Element
  participants: string
  dates: string
  image_preview: JSX.Element
}
