# Étape 1 : Utiliser une image PHP 8.2 avec FPM
FROM php:8.2-fpm

# Mettre à jour et installer les dépendances système
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    libicu-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Créer le répertoire de l'application
WORKDIR /var/www

# Copier les fichiers de dépendances
COPY composer.json composer.lock ./

# Installer les dépendances PHP (sans les dépendances de développement)
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copier le reste des fichiers de l'application
COPY . .

# Configurer les permissions
RUN chown -R www-data:www-data /var/www/storage
RUN chmod -R 775 /var/www/storage

# Générer la clé d'application
RUN php artisan key:generate

# Exposer le port 9000 pour PHP-FPM
EXPOSE 9000

# Commande pour démarrer PHP-FPM
CMD ["php-fpm"]
