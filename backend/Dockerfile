# Étape 1 : Utiliser une image Nginx avec PHP-FPM
FROM php:8.2-fpm as php

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

# Étape 2 : Utiliser Nginx comme serveur web
FROM nginx:alpine

# Installer les dépendances nécessaires pour Nginx
RUN apk add --no-cache bash

# Copier les fichiers de l'application
COPY --from=php /var/www /var/www

# Configurer Nginx pour écouter sur le port 10000
RUN echo 'user www-data;' > /etc/nginx/nginx.conf && \
    echo 'worker_processes auto;' >> /etc/nginx/nginx.conf && \
    echo 'error_log /var/log/nginx/error.log warn;' >> /etc/nginx/nginx.conf && \
    echo 'pid /var/run/nginx.pid;' >> /etc/nginx/nginx.conf && \
    echo 'events {' >> /etc/nginx/nginx.conf && \
    echo '    worker_connections 1024;' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf && \
    echo 'http {' >> /etc/nginx/nginx.conf && \
    echo '    include /etc/nginx/mime.types;' >> /etc/nginx/nginx.conf && \
    echo '    default_type application/octet-stream;' >> /etc/nginx/nginx.conf && \
    echo '    sendfile on;' >> /etc/nginx/nginx.conf && \
    echo '    keepalive_timeout 65;' >> /etc/nginx/nginx.conf && \
    echo '    include /etc/nginx/conf.d/*.conf;' >> /etc/nginx/nginx.conf && \
    echo '}' >> /etc/nginx/nginx.conf

# Copier la configuration Nginx personnalisée
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Définir les permissions
RUN chown -R www-data:www-data /var/www/storage \
    && chmod -R 775 /var/www/storage \
    && chmod -R 775 /var/www/bootstrap/cache \
    && mkdir -p /var/run/php/ \
    && touch /var/run/php/php-fpm.sock \
    && chown -R www-data:www-data /var/run/php/

# Exposer le port 10000 pour Nginx (port par défaut de Render)
EXPOSE 10000

# Copier le script de démarrage
COPY start.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/start.sh

# Définir le répertoire de travail
WORKDIR /var/www

# Commande de démarrage
CMD ["/usr/local/bin/start.sh"]
