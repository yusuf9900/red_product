#!/bin/bash
set -e

# Créer le répertoire de run pour PHP-FPM
mkdir -p /var/run/php

# Configurer les permissions
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/run/php
chmod -R 775 /var/www/storage /var/www/bootstrap/cache

# Créer le fichier de socket PHP-FPM
touch /var/run/php/php-fpm.sock
chown www-data:www-data /var/run/php/php-fpm.sock
chmod 660 /var/run/php/php-fpm.sock

# Démarrer PHP-FPM en arrière-plan
echo "Starting PHP-FPM..."
php-fpm -D

# Attendre que PHP-FPM soit prêt
sleep 2

# Vérifier que PHP-FPM est en cours d'exécution
if ! pgrep -f "php-fpm" > /dev/null; then
    echo "Error: PHP-FPM failed to start"
    exit 1
fi

# Démarrer Nginx en premier plan
echo "Starting Nginx..."
nginx -g 'daemon off;'
