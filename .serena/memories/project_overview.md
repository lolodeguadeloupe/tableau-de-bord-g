# Tableau de Bord G - Vue d'ensemble du projet

## Objectif du projet
Application web de tableau de bord pour la gestion de divers services touristiques et de divertissement en Guadeloupe, incluant :
- Restaurants et hébergements
- Activités de loisirs et concerts
- Location de voitures
- Voyance et promotions
- Partenariats et voyages
- Gestion des utilisateurs et permissions

## Technologies utilisées
- **Frontend**: React 18.3.1 avec TypeScript
- **Build Tool**: Vite 5.4.1
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **State Management**: TanStack React Query pour la gestion des données
- **Routing**: React Router DOM
- **Forms**: React Hook Form avec Zod validation
- **UI Components**: Radix UI primitives avec shadcn/ui
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns

## Architecture
- Application SPA (Single Page Application) avec React
- Architecture modulaire avec composants réutilisables
- Intégration Supabase pour l'authentification et la base de données
- Système de permissions par rôles (user, admin, super_admin)
- Design responsive avec Tailwind CSS

## Déploiement
- Conteneurisation avec Docker
- Configuration Nginx pour le proxy reverse
- Hébergement possible via Lovable.dev