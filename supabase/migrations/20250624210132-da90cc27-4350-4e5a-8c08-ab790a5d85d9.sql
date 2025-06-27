
-- Étape 1: Supprimer les politiques RLS existantes qui dépendent de company_id
DROP POLICY IF EXISTS "Partners can manage their company models" ON public.car_models;
DROP POLICY IF EXISTS "Partners can view their company models" ON public.car_models;
DROP POLICY IF EXISTS "Partners can manage their company features" ON public.car_rental_features;
DROP POLICY IF EXISTS "Partners can view their company features" ON public.car_rental_features;
DROP POLICY IF EXISTS "Fleet managers can manage their company" ON public.fleet_managers;
DROP POLICY IF EXISTS "Fleet managers can view their company" ON public.fleet_managers;

-- Étape 2: Ajouter les colonnes manquantes à la table partners
ALTER TABLE public.partners 
ADD COLUMN IF NOT EXISTS type text,
ADD COLUMN IF NOT EXISTS image text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS rating numeric,
ADD COLUMN IF NOT EXISTS offer text,
ADD COLUMN IF NOT EXISTS icon_name text,
ADD COLUMN IF NOT EXISTS gallery_images jsonb DEFAULT '[]'::jsonb;

-- Étape 3: Créer une table temporaire pour mapper les anciens IDs aux nouveaux UUIDs
CREATE TEMP TABLE company_id_mapping AS
SELECT 
  crc.id as old_id,
  COALESCE(crc.partner_id, gen_random_uuid()) as new_uuid
FROM public.car_rental_companies crc;

-- Étape 4: Migrer les données de car_rental_companies vers partners
INSERT INTO public.partners (
  id, 
  business_name, 
  business_type, 
  description, 
  address, 
  phone, 
  website, 
  type, 
  image, 
  location, 
  rating, 
  offer, 
  icon_name, 
  gallery_images,
  created_at, 
  updated_at
)
SELECT 
  m.new_uuid,
  crc.name as business_name,
  'car_rental' as business_type,
  crc.description,
  crc.location as address,
  NULL as phone,
  NULL as website,
  crc.type,
  crc.image,
  crc.location,
  crc.rating,
  crc.offer,
  crc.icon_name,
  COALESCE(crc.gallery_images, '[]'::jsonb) as gallery_images,
  crc.created_at,
  crc.updated_at
FROM public.car_rental_companies crc
JOIN company_id_mapping m ON m.old_id = crc.id
WHERE NOT EXISTS (
  SELECT 1 FROM public.partners p 
  WHERE p.id = m.new_uuid
);

-- Étape 5: Modifier les colonnes company_id pour utiliser UUID au lieu d'integer
-- D'abord, ajouter une nouvelle colonne UUID
ALTER TABLE public.car_models ADD COLUMN IF NOT EXISTS partner_id uuid;
ALTER TABLE public.car_rental_features ADD COLUMN IF NOT EXISTS partner_id uuid;  
ALTER TABLE public.fleet_managers ADD COLUMN IF NOT EXISTS partner_id uuid;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS partner_id uuid;

-- Étape 6: Remplir les nouvelles colonnes avec les UUIDs correspondants
UPDATE public.car_models 
SET partner_id = m.new_uuid
FROM company_id_mapping m
WHERE m.old_id = car_models.company_id;

UPDATE public.car_rental_features 
SET partner_id = m.new_uuid
FROM company_id_mapping m
WHERE m.old_id = car_rental_features.company_id;

UPDATE public.fleet_managers 
SET partner_id = m.new_uuid
FROM company_id_mapping m
WHERE m.old_id = fleet_managers.company_id;

UPDATE public.profiles 
SET partner_id = m.new_uuid
FROM company_id_mapping m
WHERE m.old_id = profiles.company_id;

-- Étape 7: Supprimer les anciennes colonnes company_id et renommer partner_id
ALTER TABLE public.car_models DROP COLUMN company_id CASCADE;
ALTER TABLE public.car_models RENAME COLUMN partner_id TO company_id;

ALTER TABLE public.car_rental_features DROP COLUMN company_id CASCADE;
ALTER TABLE public.car_rental_features RENAME COLUMN partner_id TO company_id;

ALTER TABLE public.fleet_managers DROP COLUMN company_id CASCADE;
ALTER TABLE public.fleet_managers RENAME COLUMN partner_id TO company_id;

ALTER TABLE public.profiles DROP COLUMN company_id CASCADE;
ALTER TABLE public.profiles RENAME COLUMN partner_id TO company_id;

-- Étape 8: Ajouter les contraintes de clé étrangère
ALTER TABLE public.car_models 
ADD CONSTRAINT car_models_company_id_fkey 
FOREIGN KEY (company_id) REFERENCES public.partners(id) ON DELETE CASCADE;

ALTER TABLE public.car_rental_features 
ADD CONSTRAINT car_rental_features_company_id_fkey 
FOREIGN KEY (company_id) REFERENCES public.partners(id) ON DELETE CASCADE;

ALTER TABLE public.fleet_managers 
ADD CONSTRAINT fleet_managers_company_id_fkey 
FOREIGN KEY (company_id) REFERENCES public.partners(id) ON DELETE CASCADE;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_company_id_fkey 
FOREIGN KEY (company_id) REFERENCES public.partners(id) ON DELETE SET NULL;

-- Étape 9: Recréer les politiques RLS avec la nouvelle structure
-- Activer RLS sur car_models si ce n'est pas déjà fait
ALTER TABLE public.car_models ENABLE ROW LEVEL SECURITY;

-- Politiques pour car_models
CREATE POLICY "Partners can manage their company models" 
ON public.car_models 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = car_models.company_id
    AND profiles.role = 'partner'
  ) OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Activer RLS sur car_rental_features si ce n'est pas déjà fait
ALTER TABLE public.car_rental_features ENABLE ROW LEVEL SECURITY;

-- Politiques pour car_rental_features
CREATE POLICY "Partners can manage their company features" 
ON public.car_rental_features 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = car_rental_features.company_id
    AND profiles.role = 'partner'
  ) OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Activer RLS sur fleet_managers si ce n'est pas déjà fait
ALTER TABLE public.fleet_managers ENABLE ROW LEVEL SECURITY;

-- Politiques pour fleet_managers
CREATE POLICY "Fleet managers can manage their company" 
ON public.fleet_managers 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.company_id = fleet_managers.company_id
    AND profiles.role = 'partner'
  ) OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Étape 10: Supprimer la table car_rental_companies après migration
DROP TABLE IF EXISTS public.car_rental_companies CASCADE;
