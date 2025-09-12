# Application Laravel + React.js

Une application moderne avec Laravel comme API backend et React.js comme frontend.

## Structure du projet

```
├── backend/          # API Laravel
├── frontend/         # Application React.js
└── package.json      # Scripts de gestion globale
```

## Installation

### Prérequis
- PHP 8.1+
- Composer
- Node.js 18+
- npm

### Installation complète

```bash
# Installer toutes les dépendances
npm run install:all

# Ou installer séparément
npm run install:backend  # Installe les dépendances Laravel
npm run install:frontend # Installe les dépendances React
```

### Configuration Laravel

1. Copier le fichier d'environnement :
```bash
cd backend
cp .env.example .env
```

2. Générer la clé d'application :
```bash
php artisan key:generate
```

3. Créer la base de données SQLite :
```bash
touch database/database.sqlite
```

4. Exécuter les migrations :
```bash
php artisan migrate
```

## Développement

### Démarrer les deux serveurs simultanément
```bash
npm run dev
```

### Ou démarrer séparément

Backend Laravel (port 8000) :
```bash
npm run dev:backend
```

Frontend React (port 5173) :
```bash
npm run dev:frontend
```

## Fonctionnalités

### Backend Laravel
- API REST avec authentification Sanctum
- Routes protégées
- Gestion des utilisateurs
- Configuration CORS pour React

### Frontend React
- Interface moderne avec Tailwind CSS
- Authentification complète (login/register)
- Routes protégées
- Gestion d'état avec Context API
- Design responsive

## API Endpoints

- `POST /api/login` - Connexion
- `POST /api/register` - Inscription
- `GET /api/user` - Profil utilisateur (protégé)
- `POST /api/logout` - Déconnexion (protégé)
- `GET /api/test` - Test de l'API

## Accès à l'application

- Frontend React : http://localhost:5173
- Backend Laravel : http://localhost:8000
- API : http://localhost:8000/api

## Compte de test

Vous pouvez créer un compte via la page d'inscription ou utiliser l'API directement.

## Technologies utilisées

### Backend
- Laravel 10
- Laravel Sanctum (authentification)
- SQLite (base de données)

### Frontend  
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Lucide React (icônes)