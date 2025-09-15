#!/bin/bash

# Configuration
API_KEY="votre_api_key_ici"  # Remplacez par votre clé API Render
SERVICE_NAME="red-product-backend"

# Vérifier les dépendances
if ! command -v curl &> /dev/null; then
    echo "Erreur: curl n'est pas installé. Veuillez installer curl d'abord."
    exit 1
fi

# Fonction pour appeler l'API Render
call_render_api() {
    local method=$1
    local endpoint=$2
    local data=${3:-}
    
    local curl_cmd=(
        curl -s -X "$method"
        -H "Accept: application/vnd.render+json; version=2021-06-01"
        -H "Authorization: Bearer $API_KEY"
        -H "Content-Type: application/json"
        "https://api.render.com/v1$endpoint"
    )
    
    if [ -n "$data" ]; then
        curl_cmd+=(-d "$data")
    fi
    
    "${curl_cmd[@]}"
}

# 1. Vérifier si le service existe déjà
echo "🔍 Vérification de l'existence du service..."
service_id=$(call_render_api GET "/services" | jq -r ".[] | select(.service.name == \"$SERVICE_NAME\") | .service.id")

# 2. Si le service n'existe pas, le créer
if [ -z "$service_id" ]; then
    echo "🚀 Création du service..."
    service_data='{
        "type": "web_service",
        "name": "'$SERVICE_NAME'",
        "autoDeploy": "yes",
        "serviceDetails": {
            "env": "docker",
            "envSpecificDetails": {
                "dockerContext": "./backend",
                "dockerfilePath": "Dockerfile"
            },
            "plan": "free",
            "region": "frankfurt"
        }
    }'
    
    response=$(call_render_api POST "/services" "$service_data")
    service_id=$(echo "$response" | jq -r '.service.id')
    echo "✅ Service créé avec succès!"
else
    echo "🚀 Le service existe déjà. Déclenchement d'un nouveau déploiement..."
    response=$(call_render_api POST "/services/$service_id/deploys" "{}")
    deploy_id=$(echo "$response" | jq -r '.deploy.id')
    echo "✅ Déploiement déclenché: $deploy_id"
fi

# 3. Afficher les informations du service
echo "\n🌐 URL du service: https://dashboard.render.com/web/$service_id"
echo "📋 Pour voir les logs en temps réel, visitez: https://dashboard.render.com/web/$service_id/events"

# 4. Si jq est installé, attendre la fin du déploiement
if command -v jq &> /dev/null; then
    echo "\n🔄 Attente de la fin du déploiement (appuyez sur Ctrl+C pour arrêter)..."
    while true; do
        status=$(call_render_api GET "/services/$service_id" | jq -r '.service.status')
        echo -n "."
        
        if [ "$status" = "live" ]; then
            echo "\n✅ Déploiement terminé avec succès!"
            break
        elif [ "$status" = "failed" ]; then
            echo "\n❌ Le déploiement a échoué. Vérifiez les logs pour plus de détails."
            exit 1
        fi
        
        sleep 5
    done
fi
