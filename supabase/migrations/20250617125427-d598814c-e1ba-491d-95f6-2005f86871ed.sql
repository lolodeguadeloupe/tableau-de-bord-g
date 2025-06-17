
-- Supprimer les politiques existantes qui causent la récursion
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profiles" ON public.profiles;

-- Créer des politiques simples sans récursion
CREATE POLICY "Enable read access for users based on user_id" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Enable insert for users based on user_id" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);
