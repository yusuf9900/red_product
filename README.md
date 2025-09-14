# 🏨 RED PRODUCT - Gestion Hôtelière

Application web complète de gestion hôtelière développée avec Laravel (backend) et React.js (frontend).

## 🚀 Fonctionnalités Principales

- **Gestion des Hôtels**
  - Création, lecture, mise à jour et suppression d'hôtels
  - Téléchargement et affichage des photos d'hôtels
  - Gestion des prix et devises
  - Recherche et filtrage des hôtels

- **Tableau de Bord**
  - Vue d'ensemble des statistiques
  - Interface utilisateur moderne et réactive
  - Navigation intuitive avec barre latérale

- **Sécurité**
  - Authentification utilisateur sécurisée avec Laravel Sanctum
  - Protection des routes API
  - Gestion des sessions

## 🛠️ Structure du Projet

```
project/
├── backend/               # API Laravel
│   ├── app/               # Modèles et contrôleurs
│   ├── config/            # Fichiers de configuration
│   ├── database/          # Migrations et seeders
│   └── routes/            # Définition des routes API
│
├── frontend/              # Application React.js
│   ├── public/            # Fichiers statiques
│   └── src/               # Code source React
│       ├── components/    # Composants réutilisables
│       ├── contexts/      # Contextes React
│       └── services/      # Services API
│
└── package.json           # Scripts de gestion globale
```

## 🚀 Installation

### Prérequis

- PHP 8.1+
- Composer 2.0+
- Node.js 18+
- npm 9+
- SQLite (ou autre SGBD supporté par Laravel)

### Installation Complète

1. **Cloner le dépôt**
```bash
git clone [URL_DU_DEPOT]
cd red-product/project
```

2. **Installer les dépendances**
```bash
# Installer toutes les dépendances en une commande
npm run install:all

# Ou installer séparément
npm run install:backend   # Dépendances Laravel
npm run install:frontend  # Dépendances React
```

3. **Configuration du Backend**

```bash
cd backend

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env
# Exemple pour SQLite :
DB_CONNECTION=sqlite
DB_DATABASE=/chemin/vers/la/base/de/donnees.sqlite

# Créer la base de données SQLite
# (si vous utilisez SQLite)
touch database/database.sqlite

# Exécuter les migrations et les seeders
php artisan migrate --seed
```

4. **Configuration du Frontend**

```bash
cd ../frontend

# Créer le fichier .env à partir de .env.example
cp .env.example .env

# Modifier les variables d'environnement si nécessaire
# VITE_API_URL doit pointer vers votre API Laravel
```

## 🚦 Démarrage du Projet

1. **Démarrer le serveur Laravel**
```bash
cd backend
php artisan serve
```

2. **Démarrer l'application React**
```bash
cd frontend
npm run dev
```

L'application sera disponible à l'adresse : [http://localhost:5173](http://localhost:5173)

## 🔧 Technologies Utilisées

- **Backend**
  - Laravel 10.x
  - Laravel Sanctum (Authentification API)
  - Eloquent ORM
  - Validation des données
  - Gestion des fichiers

- **Frontend**
  - React 18
  - React Router v6
  - Axios pour les requêtes API
  - Tailwind CSS pour le style
  - Lucide Icons
  - Context API pour la gestion d'état

- **Base de Données**
  - SQLite (par défaut)
  - Support pour MySQL/PostgreSQL

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📞 Contact

Pour toute question ou suggestion, veuillez contacter l'équipe de développement.