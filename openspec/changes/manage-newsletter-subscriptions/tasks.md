# Tasks - Gestion des newsletters

## Tâches de développement

### 1. Backend & Types
- [x] **Créer les types TypeScript pour newsletter_subscriptions**
  - Ajouter les interfaces dans `src/types/newsletter.ts`
  - Définir les types pour les opérations CRUD

### 2. Hooks & Logic
- [x] **Créer le hook useNewsletterActions**
  - Actions CRUD pour les abonnements newsletter
  - Gestion des erreurs et notifications
  - Pagination et tri des données

### 3. Composants UI
- [x] **Créer NewsletterStats component**
  - Affichage du nombre total d'abonnés
  - Évolution mensuelle des inscriptions
  - Taux de croissance

- [x] **Créer NewsletterTable component**
  - Liste paginée des abonnés avec email et date d'inscription
  - Actions de suppression avec confirmation
  - Recherche et filtres

- [ ] **Créer NewsletterModal component** (optionnel)
  - Pour éditer/voir les détails d'un abonnement si nécessaire

### 4. Page principale
- [x] **Créer la page Newsletter**
  - Intégration des composants Stats et Table
  - Layout cohérent avec les autres pages
  - Gestion des permissions d'accès

### 5. Navigation & Routing
- [x] **Ajouter Newsletter dans la sidebar**
  - Ajout dans `AppSidebar.tsx`
  - Icône appropriée (Mail)

- [x] **Configurer le routing**
  - Route `/newsletter` dans le router principal
  - Protection par ProtectedRoute avec vérification admin

### 6. Tests & Validation
- [x] **Test des fonctionnalités**
  - Vérifier l'affichage des données
  - Tester les actions CRUD
  - Validation des permissions

- [x] **Test responsive**
  - Interface mobile-friendly
  - Table responsive avec scroll horizontal si nécessaire

### 7. Documentation
- [ ] **Mettre à jour la documentation**
  - Ajouter dans le README les nouvelles fonctionnalités
  - Documenter les permissions requises

## Dépendances
- Les permissions d'accès admin/super_admin doivent être fonctionnelles
- La table `newsletter_subscriptions` existe déjà en base de données
- Les composants UI de base (DataTable, StatCard) sont réutilisés

## Validation
- [x] L'interface affiche correctement la liste des abonnés
- [x] Les statistiques sont exactes et à jour
- [x] Les actions de suppression fonctionnent avec confirmation
- [x] La pagination fonctionne pour de grandes listes
- [x] Seuls les admin/super_admin ont accès à la fonctionnalité
- [x] L'interface est responsive et cohérente avec le reste de l'application