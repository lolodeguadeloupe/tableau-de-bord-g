export interface Partner {
  id: string;
  business_name: string;
  business_type: string;
  description?: string;
  address?: string;
  phone?: string;
  website?: string;
  image?: string; // URL de l'image principale
  gallery_images?: string[]; // Tableau d'URLs pour la galerie
  created_at: string;
  updated_at: string;
}
