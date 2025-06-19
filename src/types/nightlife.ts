
export interface NightlifeEvent {
  id: number
  name: string
  type: string
  venue: string
  image: string
  description: string
  date: string
  time: string
  price: number
  offer: string
  rating: number
  features: string[]
  gallery_images?: string[]
  created_at?: string
  updated_at?: string
}

export interface NightlifeEventTableData extends Omit<NightlifeEvent, 'id'> {
  id: string
  price_display: string
  rating_display: JSX.Element
  image_preview: JSX.Element
  date_time: string
}
