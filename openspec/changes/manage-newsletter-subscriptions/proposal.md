# Gestion des newsletters - Affichage des abonnés

## Why
Actuellement, le projet dispose d'une table `newsletter_subscriptions` dans la base de données, mais il n'existe aucune interface d'administration pour gérer et visualiser la liste des personnes inscrites à la newsletter.

## What Changes
Ajout d'une nouvelle fonctionnalité de gestion des newsletters dans l'interface d'administration, comprenant :

1. **Page Newsletter** - Nouvelle page `/newsletter` accessible aux administrateurs
2. **Composants dédiés** - NewsletterTable, NewsletterStats, NewsletterModal
3. **Hook de gestion** - useNewsletterActions pour les opérations CRUD
4. **Navigation** - Ajout dans la sidebar avec les autres modules
5. **Permissions** - Protection par rôles admin/super_admin

## Solution proposée
Implémenter une interface d'administration complète pour gérer les abonnements à la newsletter, permettant de :

1. **Visualiser la liste des abonnés** - Afficher tous les emails inscrits avec leurs dates d'inscription
2. **Gérer les abonnements** - Permettre de supprimer des abonnés si nécessaire
3. **Analyser les données** - Afficher des statistiques sur les abonnements (nombre total, évolution, etc.)

## Bénéfices
- **Visibilité** : Les administrateurs peuvent voir qui est abonné à la newsletter
- **Gestion** : Possibilité de gérer les abonnements (RGPD compliance)
- **Analytics** : Suivi de la croissance de la base d'abonnés
- **Conformité** : Respect des exigences de transparence des données

## Périmètre
Cette fonctionnalité s'intègre naturellement dans l'interface d'administration existante aux côtés des autres modules (restaurants, activités, partenaires, etc.).

## Contraintes techniques
- Utilisation de Supabase pour la base de données (table `newsletter_subscriptions` existante)
- Interface cohérente avec les autres modules du tableau de bord
- Respect des permissions d'accès (admin/super_admin uniquement)
- Pagination pour gérer de grandes listes d'abonnés

## Non-scope
- Envoi de newsletters (pas dans cette proposition)
- Formulaire d'inscription publique (déjà géré séparément)
- Segmentation avancée des abonnés
- Intégration avec des services d'emailing externes