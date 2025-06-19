
-- Créer un bucket pour les images des compagnies de location (s'il n'existe pas déjà)
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-rental-images', 'car-rental-images', true)
ON CONFLICT (id) DO NOTHING;

-- Créer une politique pour permettre aux utilisateurs authentifiés d'uploader des images
CREATE POLICY "Authenticated users can upload car rental images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'car-rental-images' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre aux utilisateurs authentifiés de supprimer leurs images
CREATE POLICY "Authenticated users can delete car rental images" ON storage.objects
FOR DELETE USING (bucket_id = 'car-rental-images' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre aux utilisateurs authentifiés de mettre à jour leurs images
CREATE POLICY "Authenticated users can update car rental images" ON storage.objects
FOR UPDATE USING (bucket_id = 'car-rental-images' AND auth.role() = 'authenticated');

-- Ajouter une colonne gallery_images à la table car_rental_companies pour stocker les images
ALTER TABLE car_rental_companies ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb;

-- Créer un bucket pour les images des modèles de voitures (s'il n'existe pas déjà)
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-model-images', 'car-model-images', true)
ON CONFLICT (id) DO NOTHING;

-- Créer une politique pour permettre aux utilisateurs authentifiés d'uploader des images de modèles
CREATE POLICY "Authenticated users can upload car model images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'car-model-images' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre aux utilisateurs authentifiés de supprimer leurs images de modèles
CREATE POLICY "Authenticated users can delete car model images" ON storage.objects
FOR DELETE USING (bucket_id = 'car-model-images' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre aux utilisateurs authentifiés de mettre à jour leurs images de modèles
CREATE POLICY "Authenticated users can update car model images" ON storage.objects
FOR UPDATE USING (bucket_id = 'car-model-images' AND auth.role() = 'authenticated');

-- Ajouter une colonne gallery_images à la table car_models pour stocker les images
ALTER TABLE car_models ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb;
