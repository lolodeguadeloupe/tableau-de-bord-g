
-- Créer un bucket pour les images des compagnies de location de voitures
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-rental-images', 'car-rental-images', true)
ON CONFLICT (id) DO NOTHING;

-- Créer un bucket pour les images des modèles de voitures
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-model-images', 'car-model-images', true)
ON CONFLICT (id) DO NOTHING;

-- Créer des politiques pour permettre aux utilisateurs authentifiés d'uploader des images de compagnies
CREATE POLICY "Authenticated users can upload car rental images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'car-rental-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete car rental images" ON storage.objects
FOR DELETE USING (bucket_id = 'car-rental-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update car rental images" ON storage.objects
FOR UPDATE USING (bucket_id = 'car-rental-images' AND auth.role() = 'authenticated');

-- Créer des politiques pour permettre aux utilisateurs authentifiés d'uploader des images de modèles
CREATE POLICY "Authenticated users can upload car model images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'car-model-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete car model images" ON storage.objects
FOR DELETE USING (bucket_id = 'car-model-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update car model images" ON storage.objects
FOR UPDATE USING (bucket_id = 'car-model-images' AND auth.role() = 'authenticated');

-- Permettre la lecture publique des images
CREATE POLICY "Public can view car rental images" ON storage.objects
FOR SELECT USING (bucket_id = 'car-rental-images');

CREATE POLICY "Public can view car model images" ON storage.objects
FOR SELECT USING (bucket_id = 'car-model-images');
