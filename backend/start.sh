#!/bin/sh

# Démarrer PHP-FPM en arrière-plan
php-fpm -D

# Configurer les permissions
chown -R www-data:www-data /var/www/storage
chmod -R 775 /var/www/storage
chmod -R 775 /var/www/bootstrap/cache

# Démarrer Nginx en premier plan
nginx -g 'daemon off;'
