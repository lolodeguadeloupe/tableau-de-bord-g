insert into storage.buckets (id, name, public)
values ('partner-images', 'partner-images', true);

CREATE POLICY "Allow authenticated users to upload partner images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'partner-images' AND auth.uid() = (select id from public.profiles where id = auth.uid()));

CREATE POLICY "Allow authenticated users to view partner images" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'partner-images');

CREATE POLICY "Allow authenticated users to update partner images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'partner-images' AND auth.uid() = (select id from public.profiles where id = auth.uid()));

CREATE POLICY "Allow authenticated users to delete partner images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'partner-images' AND auth.uid() = (select id from public.profiles where id = auth.uid()));