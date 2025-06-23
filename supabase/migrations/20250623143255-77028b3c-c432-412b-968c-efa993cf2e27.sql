
-- Créer un bucket pour les images des promotions
INSERT INTO storage.buckets (id, name, public)
VALUES ('promotion-images', 'promotion-images', true)
ON CONFLICT (id) DO NOTHING;

-- Créer une politique pour permettre aux utilisateurs authentifiés d'uploader des images
CREATE POLICY "Authenticated users can upload promotion images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'promotion-images' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre aux utilisateurs authentifiés de supprimer leurs images
CREATE POLICY "Authenticated users can delete promotion images" ON storage.objects
FOR DELETE USING (bucket_id = 'promotion-images' AND auth.role() = 'authenticated');

-- Créer une politique pour permettre aux utilisateurs authentifiés de mettre à jour leurs images
CREATE POLICY "Authenticated users can update promotion images" ON storage.objects
FOR UPDATE USING (bucket_id = 'promotion-images' AND auth.role() = 'authenticated');
