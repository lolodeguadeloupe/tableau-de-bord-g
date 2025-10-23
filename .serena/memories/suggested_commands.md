# Commandes de développement suggérées

## Commandes principales
```bash
# Démarrage en mode développement
npm run dev
# ou
pnpm dev

# Build de production
npm run build

# Build de développement
npm run build:dev

# Preview du build
npm run preview

# Linting du code
npm run lint
# ou
npx eslint .

# Installation des dépendances
npm install
# ou
pnpm install
```

## Commandes Docker
```bash
# Build et démarrage des conteneurs
docker compose up --build

# Arrêt des conteneurs
docker compose down

# Logs des conteneurs
docker compose logs -f
```

## Commandes Git recommandées
```bash
# Vérification du statut
git status

# Création d'une branche de fonctionnalité
git checkout -b feature/nom-de-la-fonctionnalite

# Commit avec message descriptif
git commit -m "feat: description de la fonctionnalité"

# Push vers le repository
git push origin feature/nom-de-la-fonctionnalite
```

## Outils système (Linux)
```bash
# Navigation
ls -la
cd [directory]

# Recherche de fichiers
find . -name "*.tsx" -type f
grep -r "pattern" src/

# Gestion des processus
ps aux | grep node
kill -9 [PID]
```

## Commandes Supabase (si CLI installé)
```bash
# Connexion à Supabase
supabase login

# Démarrage local
supabase start

# Migration de schéma
supabase db push
```