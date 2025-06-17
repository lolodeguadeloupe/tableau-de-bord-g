-- Réinitialiser les politiques existantes pour la table profiles
drop policy if exists "Profiles are viewable by users who created them" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update own profile" on profiles;

-- Permettre à tous les utilisateurs authentifiés de lire leur propre profil
create policy "Users can view own profile"
on profiles for select
using (auth.uid() = id);

-- Permettre aux administrateurs de voir tous les profils
create policy "Admins can view all profiles"
on profiles for select
using (
  exists (
    select 1
    from profiles
    where id = auth.uid()
    and role = 'admin'
  )
);

-- Permettre aux utilisateurs de créer leur propre profil
create policy "Users can insert own profile"
on profiles for insert
with check (auth.uid() = id);

-- Permettre aux utilisateurs de mettre à jour leur propre profil
create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);
