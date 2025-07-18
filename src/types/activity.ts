
export interface Activity {
  id: number
  name: string
  icon_name: string
  path: string
  is_active: boolean
  rating: number
  created_at: string
}

export interface ActivityTableData extends Omit<Activity, 'id' | 'rating'> {
  id: string
  status: JSX.Element
  rating: JSX.Element
  _originalRating: number
}
