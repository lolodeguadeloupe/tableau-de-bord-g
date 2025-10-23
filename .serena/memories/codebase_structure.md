# Structure de la base de code

## Architecture générale
Application React TypeScript avec architecture modulaire centrée sur les domaines métier.

## Dossiers principaux

### `/src/components/`
Composants organisés par domaine fonctionnel :
- `ui/` - Composants de base (shadcn/ui, boutons, formulaires)
- `activities/` - Gestion des activités
- `restaurant/` - Module restaurant
- `accommodation/` - Hébergements
- `car-rental/` - Location de voitures
- `concert/` - Gestion des concerts
- `leisure/` et `loisirs/` - Activités de loisirs
- `nightlife/` - Vie nocturne
- `partners/` - Gestion des partenaires
- `travel/` - Voyages
- `voyance/` - Services de voyance
- `promotions/` - Promotions
- `bons-plans/` - Bons plans

### `/src/hooks/`
Hooks personnalisés pour la logique métier :
- `useAuth.tsx` - Authentication
- `useUsers.tsx` - Gestion utilisateurs
- `use[Domain]Actions.tsx` - Actions CRUD par domaine
- `use-mobile.tsx` - Détection mobile
- `use-toast.ts` - Notifications

### `/src/pages/`
Pages principales de l'application :
- `Dashboard.tsx` - Tableau de bord principal
- `Auth.tsx` - Authentification
- `Settings.tsx` - Paramètres
- `Users.tsx` - Gestion utilisateurs
- Domaines spécifiques (Restaurants, Concerts, etc.)

### `/src/integrations/`
Intégrations externes :
- `supabase/` - Configuration et types Supabase
- Scripts d'administration base de données

### `/src/types/`
Définitions TypeScript par domaine métier

### `/src/lib/`
Utilitaires partagés :
- `utils.ts` - Fonctions helper

## Fichiers de configuration
- `package.json` - Dépendances et scripts
- `vite.config.ts` - Configuration Vite
- `tailwind.config.ts` - Configuration Tailwind
- `eslint.config.js` - Configuration ESLint
- `tsconfig.json` - Configuration TypeScript
- `components.json` - Configuration shadcn/ui

## Base de données
- `schema.sql` - Schéma complet Supabase
- Architecture PostgreSQL avec RLS (Row Level Security)
- Tables pour chaque domaine métier
- Système de permissions par rôles

## Docker
- `Dockerfile` - Image de production
- `docker-compose.yml` - Configuration multi-services
- Configuration Nginx pour reverse proxy