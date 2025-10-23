# Design - Gestion des newsletters

## Architecture

### Structure des données
La table `newsletter_subscriptions` existe déjà avec la structure suivante :
```sql
CREATE TABLE public.newsletter_subscriptions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
```

### Modèle de données TypeScript
```typescript
interface NewsletterSubscription {
  id: string
  email: string
  created_at: string
  updated_at: string
}

interface NewsletterStats {
  totalSubscribers: number
  monthlyGrowth: number
  recentSubscriptions: number
}
```

## Patterns architecturaux

### 1. Hook personnalisé (useNewsletterActions)
Suit le pattern établi des autres modules :
```typescript
export const useNewsletterActions = () => {
  // CRUD operations
  // Error handling
  // React Query integration
}
```

### 2. Composants modulaires
- **NewsletterStats** : Réutilise le pattern `StatCard`
- **NewsletterTable** : Étend le pattern `DataTable` existant
- **Page Newsletter** : Suit la structure des autres pages de gestion

### 3. Permissions et sécurité
- **Row Level Security (RLS)** : Utilisation des politiques Supabase existantes
- **Composant de protection** : `PrivateRoute` ou `SuperAdminRoute`
- **Validation côté client et serveur**

## Considérations UX/UI

### Interface utilisateur
- **Layout cohérent** : Même structure que Partners, Restaurants, etc.
- **Table responsive** : Affichage adaptatif mobile/desktop
- **Actions intuitives** : Suppression avec confirmation modale
- **Feedback visuel** : Toast notifications pour les actions

### Navigation
- **Placement logique** : Dans la sidebar avec les autres modules de gestion
- **Icône appropriée** : Mail ou Newsletter icon
- **Breadcrumb** : Si applicable selon le pattern existant

## Considérations techniques

### Performance
- **Pagination** : Chargement par pages (ex: 50 items par page)
- **Recherche optimisée** : Index sur la colonne email
- **Cache** : React Query pour la mise en cache des données

### Sécurité
- **Validation email** : Côté client et serveur
- **Protection CSRF** : Via Supabase RLS
- **Audit trail** : Les timestamps `created_at`/`updated_at` existants

### Scalabilité
- **Index database** : Sur email pour les recherches rapides
- **Lazy loading** : Chargement à la demande
- **Optimistic updates** : Pour une UX fluide

## Points de décision

### 1. Niveau de permissions
**Décision** : Accès admin/super_admin uniquement
**Justification** : Données sensibles (emails des utilisateurs)

### 2. Actions disponibles
**Décision** : Lecture et suppression uniquement
**Justification** : 
- Pas de modification d'email (sécurité)
- Création via formulaire public séparé
- Suppression pour conformité RGPD

### 3. Intégration dans la navigation
**Décision** : Module de gestion au même niveau que Partners, Restaurants
**Justification** : 
- Cohérence avec l'architecture existante
- Facilité d'accès pour les administrateurs

## Impact sur l'existant

### Code existant
- **Aucune modification** des tables ou schémas existants
- **Réutilisation** des composants UI (DataTable, StatCard, etc.)
- **Extension** du système de navigation actuel

### Base de données
- **Pas de migration** nécessaire
- **Possibilité d'ajouter des index** pour optimiser les performances
- **RLS policies** potentiellement à ajouter selon les besoins

### Infrastructure
- **Pas d'impact** sur le déploiement existant
- **Compatibilité** avec Docker et configuration actuelle