
-- Créer un bucket pour les images des restaurants
INSERT INTO storage.buckets (id, name, public)
VALUES ('restaurant-images', 'restaurant-images', true)
ON CONFLICT (id) DO NOTHING;

-- Créer une politique pour permettre aux utilisateurs authentifiés d'uploader des images
CREATE POLICY "Authenticated users can upload restaurant images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'restaurant-images' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre aux utilisateurs authentifiés de supprimer leurs images
CREATE POLICY "Authenticated users can delete restaurant images" ON storage.objects
FOR DELETE USING (bucket_id = 'restaurant-images' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre aux utilisateurs authentifiés de mettre à jour leurs images
CREATE POLICY "Authenticated users can update restaurant images" ON storage.objects
FOR UPDATE USING (bucket_id = 'restaurant-images' AND auth.role() = 'authenticated');

-- Politique pour permettre la lecture publique des images
CREATE POLICY "Public read access for restaurant images" ON storage.objects
FOR SELECT USING (bucket_id = 'restaurant-images');
