
-- Ajouter des politiques pour permettre aux admins de gérer tous les profils
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update all profiles" 
ON public.profiles FOR UPDATE 
USING (public.is_admin());

CREATE POLICY "Admins can insert profiles" 
ON public.profiles FOR INSERT 
WITH CHECK (public.is_admin());

CREATE POLICY "Admins can delete profiles" 
ON public.profiles FOR DELETE 
USING (public.is_admin());
