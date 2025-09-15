#!/bin/bash
set -e

# Préparer répertoires runtime
mkdir -p /var/run/php /var/log/nginx

# Permissions pour www-data (utilisateur par défaut sur Debian pour PHP/Nginx)
chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache /var/run/php /var/log/nginx || true
chmod -R 775 /var/www/storage /var/www/bootstrap/cache || true

# Démarrer PHP-FPM en arrière-plan
echo "[start.sh] Starting PHP-FPM on 0.0.0.0:9000..."
php-fpm -D

# Attendre que PHP-FPM soit prêt
sleep 2

# Vérifier que PHP-FPM est en cours d'exécution
if ! pgrep -x "php-fpm" >/dev/null; then
  echo "[start.sh] ERROR: PHP-FPM failed to start" >&2
  exit 1
fi

# Démarrer Nginx au premier plan
echo "[start.sh] Starting Nginx on :10000..."
nginx -g 'daemon off;'
