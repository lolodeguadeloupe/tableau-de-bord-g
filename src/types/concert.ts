
import type { Json } from "@/integrations/supabase/types"

export interface Concert {
  id: number
  name: string
  artist: string
  genre: string
  image: string
  location: string
  description: string
  date: string
  time: string
  price: number
  offer: string
  rating: number
  icon: string
  gallery_images?: string[]
  created_at?: string
  updated_at?: string
}

export interface ConcertTableData extends Omit<Concert, 'id'> {
  id: string
  price_display: string
  rating_display: JSX.Element
  image_preview: JSX.Element
  date_time: string
}
