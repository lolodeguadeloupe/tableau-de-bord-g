# Checklist de fin de tâche

## Avant de marquer une tâche comme terminée

### 1. Qualité du code
- [ ] Le code suit les conventions de style du projet
- [ ] Pas de `console.log` ou code de debug laissé
- [ ] Variables et fonctions nommées de manière claire
- [ ] Types TypeScript corrects et complets
- [ ] Gestion d'erreur appropriée

### 2. Linting et validation
```bash
# Exécuter le linting
npm run lint

# Vérifier les erreurs TypeScript
npx tsc --noEmit
```

### 3. Tests fonctionnels
- [ ] L'application démarre sans erreur (`npm run dev`)
- [ ] Les nouvelles fonctionnalités fonctionnent comme attendu
- [ ] Pas de régression sur les fonctionnalités existantes
- [ ] Interface responsive testée sur différentes tailles d'écran

### 4. Performance et optimisation
- [ ] Pas d'imports inutiles
- [ ] Composants optimisés (éviter les re-renders inutiles)
- [ ] Images optimisées si ajoutées
- [ ] Bundle build sans erreur (`npm run build`)

### 5. Git et documentation
- [ ] Modifications committées avec un message descriptif
- [ ] Code commenté si nécessaire (logique complexe)
- [ ] README mis à jour si nouvelles fonctionnalités importantes

### 6. Sécurité
- [ ] Pas de clés API ou secrets exposés
- [ ] Validation côté client et serveur pour les formulaires
- [ ] Permissions d'accès vérifiées
- [ ] Sanitisation des inputs utilisateur

### 7. Accessibilité
- [ ] Labels appropriés pour les formulaires
- [ ] Navigation clavier fonctionnelle
- [ ] Contrastes de couleurs respectés
- [ ] Alt text pour les images

## Commandes de vérification finale
```bash
# Build de production pour vérifier
npm run build

# Linting complet
npm run lint

# Vérification TypeScript
npx tsc --noEmit

# Test de l'application
npm run dev
```