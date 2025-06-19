
-- Créer un enum pour les différents types d'admin
CREATE TYPE public.admin_type AS ENUM ('super_admin', 'partner_admin');

-- Ajouter une colonne admin_type à la table profiles
ALTER TABLE public.profiles ADD COLUMN admin_type public.admin_type DEFAULT 'partner_admin';

-- Mettre à jour le compte super admin existant
UPDATE public.profiles 
SET admin_type = 'super_admin' 
WHERE email = 'admin@clubcreole.com' AND role = 'admin';

-- Créer une fonction pour vérifier si un utilisateur est super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin' 
    AND admin_type = 'super_admin'
  );
$$;

-- Créer une fonction pour vérifier si un utilisateur est admin partenaire
CREATE OR REPLACE FUNCTION public.is_partner_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin' 
    AND admin_type = 'partner_admin'
  );
$$;
