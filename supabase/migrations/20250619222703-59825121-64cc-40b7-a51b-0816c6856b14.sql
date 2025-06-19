
-- Ajouter la colonne gallery_images à la table restaurants
ALTER TABLE public.restaurants 
ADD COLUMN gallery_images jsonb DEFAULT '[]'::jsonb;
