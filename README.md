# LandingLab

Application de création de landing pages avec React, Vite, TailwindCSS et Firebase.

## Configuration du Projet

1. Cloner le repository
```bash
git clone <your-repo-url>
cd landinglab
```

2. Installer les dépendances
```bash
npm install
```

3. Configurer les variables d'environnement
Créer un fichier `.env` à la racine du projet :
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Développement Local

```bash
npm run dev
```

## Déploiement sur Vercel

1. Installer Vercel CLI
```bash
npm install -g vercel
```

2. Se connecter à Vercel
```bash
vercel login
```

3. Déployer l'application
```bash
vercel
```

4. Pour déployer en production
```bash
vercel --prod
```

## Fonctionnalités

- Authentification utilisateur (Email/Password et Google)
- Création et gestion de landing pages
- Interface utilisateur moderne avec TailwindCSS
- Base de données Firebase Firestore
- Déploiement automatisé avec Vercel
