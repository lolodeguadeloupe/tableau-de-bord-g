export interface Partner {
  id: number;
  business_name: string;
  business_type: string;
  description?: string | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  created_at: string;
  updated_at: string;
  type?: string | null;
  image?: string | null;
  location?: string | null;
  rating?: number | null;
  offer?: string | null;
  icon_name?: string | null;
  gallery_images?: string[];
  status: 'en_attente' | 'approuve' | 'rejete';
  weight?: number | null;
  user_id?: string | null;
}
