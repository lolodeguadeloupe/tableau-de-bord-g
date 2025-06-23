
export interface TravelOffer {
  id: number
  title: string
  destination: string
  departure_location: string
  duration_days: number
  price: number
  departure_date: string | null
  return_date: string | null
  description: string
  image: string | null
  gallery_images: string[]
  inclusions: string[]
  exclusions: string[]
  max_participants: number
  current_participants: number
  is_active: boolean
  partner_id: string | null
  created_at: string
  updated_at: string
}

export interface TravelOfferTableData extends Omit<TravelOffer, 'id' | 'price' | 'is_active'> {
  id: string
  price: JSX.Element
  status: JSX.Element
  _originalPrice: number
}
