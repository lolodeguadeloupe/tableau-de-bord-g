
-- Ajouter la colonne gallery_images à la table voyance_mediums
ALTER TABLE public.voyance_mediums 
ADD COLUMN gallery_images jsonb DEFAULT '[]'::jsonb;
