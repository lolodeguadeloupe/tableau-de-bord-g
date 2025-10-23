# Conventions de style et de code

## Conventions de nommage
- **Fichiers**: PascalCase pour les composants React (ex: `UserMenu.tsx`)
- **Dossiers**: kebab-case ou camelCase selon le contexte
- **Variables**: camelCase (ex: `userName`, `isLoading`)
- **Fonctions**: camelCase (ex: `handleSubmit`, `fetchUserData`)
- **Types/Interfaces**: PascalCase (ex: `UserProfile`, `ApiResponse`)
- **Constantes**: UPPER_SNAKE_CASE (ex: `API_BASE_URL`)

## Structure des composants
- Un composant par fichier
- Export par défaut pour le composant principal
- Imports organisés : React → libraries → local imports
- Props typées avec TypeScript
- Hooks personnalisés dans le dossier `src/hooks/`

## Organisation des fichiers
```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI de base (shadcn/ui)
│   └── [domain]/       # Composants spécifiques par domaine
├── hooks/              # Hooks personnalisés
├── lib/                # Utilitaires et configurations
├── pages/              # Pages de l'application
├── types/              # Définitions TypeScript
└── integrations/       # Intégrations externes (Supabase)
```

## Standards de code
- TypeScript strict activé
- ESLint configuré avec les règles React recommandées
- Pas de `console.log` en production
- Gestion d'erreur avec try/catch
- Validation des formulaires avec Zod
- Tests unitaires (si implémentés)

## Conventions React
- Hooks personnalisés préfixés par `use`
- Props destructurées en début de fonction
- Conditional rendering avec `&&` ou ternaire
- Keys uniques pour les listes
- Éviter les `any` en TypeScript

## CSS/Styling
- Tailwind CSS pour le styling
- Classes utilitaires organisées (layout → spacing → colors → effects)
- Composants shadcn/ui pour l'interface
- Responsive design mobile-first
- Variables CSS custom pour les couleurs dans `index.css`