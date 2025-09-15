# Étape 1 : Utiliser une image Nginx avec PHP-FPM
FROM php:8.2-fpm as base

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
    nginx \
    netcat-openbsd \
    procps \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip intl \
    && rm -rf /var/lib/apt/lists/*

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Créer le répertoire de l'application
WORKDIR /var/www

# Copier les fichiers nécessaires pour l'installation des dépendances
COPY --chown=www-data:www-data . .

# Installer les dépendances PHP (sans les dépendances de développement)
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts \
    && composer dump-autoload --optimize

# Configurer les permissions
RUN chown -R www-data:www-data /var/www/storage \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache

# Générer la clé d'application si elle n'existe pas
RUN if [ ! -f ".env" ]; then cp .env.example .env; fi \
    && php artisan key:generate

# Créer le fichier de configuration PHP-FPM
RUN echo '[www]\n\
user = www-data\n\
group = www-data\n\
listen = 9000\n\
listen.owner = www-data\n\
listen.group = www-data\n\
' > /usr/local/etc/php-fpm.d/zz-docker.conf

# Copier la configuration Nginx personnalisée (remplace la conf par défaut)
COPY nginx.conf /etc/nginx/nginx.conf

# Exposer le port 10000 pour Nginx (port par défaut de Render)
EXPOSE 10000

# Copier le script de démarrage
COPY start.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start.sh

# Définir le répertoire de travail
WORKDIR /var/www

# Commande de démarrage
CMD ["/usr/local/bin/start.sh"]
