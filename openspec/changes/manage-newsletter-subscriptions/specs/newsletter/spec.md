# Newsletter Management

## ADDED Requirements

### R1: Newsletter Subscription Listing
Les administrateurs doivent pouvoir visualiser la liste complète des abonnés à la newsletter avec leurs informations de base.

#### Scenario: Affichage de la liste des abonnés
**Given** un administrateur connecté avec les permissions appropriées  
**When** il accède à la page Newsletter  
**Then** il voit la liste paginée des abonnés avec :
- L'adresse email de chaque abonné
- La date d'inscription (created_at)
- Le nombre total d'abonnés
- Navigation par pages (50 abonnés par page)

#### Scenario: Recherche d'abonnés
**Given** un administrateur sur la page Newsletter  
**When** il saisit un terme de recherche dans le champ de recherche  
**Then** la liste se filtre pour afficher uniquement les emails contenant le terme recherché  
**And** la pagination se met à jour en conséquence

### R2: Newsletter Statistics Display
Les administrateurs doivent pouvoir consulter des statistiques sur les abonnements newsletter.

#### Scenario: Affichage des statistiques globales
**Given** un administrateur sur la page Newsletter  
**Then** il voit les statistiques suivantes :
- Nombre total d'abonnés actuels
- Nombre de nouvelles inscriptions ce mois-ci
- Taux de croissance mensuel (pourcentage)
- Graphique d'évolution des inscriptions (optionnel)

### R3: Newsletter Subscription Management
Les administrateurs doivent pouvoir supprimer des abonnements pour respecter les demandes de désinscription et la conformité RGPD.

#### Scenario: Suppression d'un abonnement
**Given** un administrateur visualisant la liste des abonnés  
**When** il clique sur l'action "Supprimer" pour un abonné spécifique  
**Then** une modale de confirmation s'affiche avec le message "Êtes-vous sûr de vouloir supprimer cet abonnement ?"  
**When** il confirme la suppression  
**Then** l'abonnement est supprimé de la base de données  
**And** la liste se met à jour sans l'abonné supprimé  
**And** une notification de succès s'affiche

#### Scenario: Annulation de suppression
**Given** un administrateur ayant cliqué sur "Supprimer" pour un abonné  
**When** la modale de confirmation s'affiche  
**And** il clique sur "Annuler"  
**Then** la modale se ferme  
**And** l'abonnement reste dans la liste

### R4: Access Control and Permissions
L'accès à la gestion des newsletters doit être restreint aux utilisateurs autorisés.

#### Scenario: Accès autorisé pour administrateurs
**Given** un utilisateur connecté avec le rôle "admin" ou "super_admin"  
**When** il accède à l'URL /newsletter  
**Then** il voit la page de gestion des newsletters  
**And** il peut effectuer toutes les actions disponibles

#### Scenario: Accès refusé pour utilisateurs standard
**Given** un utilisateur connecté avec le rôle "user"  
**When** il tente d'accéder à l'URL /newsletter  
**Then** il est redirigé vers la page d'accueil ou une page d'erreur 403  
**And** un message d'erreur indique "Accès non autorisé"

### R5: Navigation and Integration
La fonctionnalité newsletter doit s'intégrer naturellement dans l'interface d'administration existante.

#### Scenario: Navigation via sidebar
**Given** un administrateur connecté  
**When** il consulte la sidebar de navigation  
**Then** il voit un élément "Newsletter" avec une icône mail appropriée  
**When** il clique sur cet élément  
**Then** il est dirigé vers la page de gestion des newsletters

#### Scenario: Cohérence UI avec les autres modules
**Given** un administrateur sur la page Newsletter  
**Then** l'interface utilise les mêmes composants que les autres pages de gestion :
- Même header avec titre et actions
- Même style de tableau avec pagination
- Mêmes composants de statistiques (StatCard)
- Mêmes modales de confirmation

### R6: Data Integrity and Performance
Le système doit gérer efficacement les données newsletter avec de bonnes performances.

#### Scenario: Gestion de grandes listes d'abonnés
**Given** une base de données contenant plus de 1000 abonnés  
**When** un administrateur accède à la page Newsletter  
**Then** la page se charge en moins de 3 secondes  
**And** seuls les 50 premiers résultats sont affichés  
**And** la navigation par pages permet d'accéder aux autres résultats

#### Scenario: Mise à jour temps réel des données
**Given** un administrateur ayant la page Newsletter ouverte  
**When** un autre administrateur supprime un abonnement  
**Then** la liste se met à jour automatiquement (ou après rafraîchissement)  
**And** les statistiques reflètent les nouveaux chiffres

## Cross-references
- Cette spécification s'appuie sur les patterns établis dans les modules Partners et Restaurants
- Utilise le système d'authentification et de permissions existant
- Réutilise les composants UI de base (DataTable, StatCard, Modal)