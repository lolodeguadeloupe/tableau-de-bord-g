
-- Ajouter la colonne gallery_images à la table car_models si elle n'existe pas déjà
ALTER TABLE car_models ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb;

-- Ajouter la colonne gallery_images à la table car_rental_companies si elle n'existe pas déjà
ALTER TABLE car_rental_companies ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb;
