# Configuration
$API_KEY = "votre_api_key_ici"  # Remplacez par votre clé API Render
$SERVICE_NAME = "red-product-backend"

# Vérifier si git est installé
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git n'est pas installé. Veuillez installer Git d'abord."
    exit 1
}

# Vérifier si curl est disponible
$curl = if (Get-Command curl -ErrorAction SilentlyContinue) { "curl" } else { "curl.exe" }

# Fonction pour appeler l'API Render
function Invoke-RenderAPI {
    param (
        [string]$Method,
        [string]$Endpoint,
        [string]$Body = $null
    )
    
    $headers = @{
        "Accept" = "application/vnd.render+json; version=2021-06-01"
        "Authorization" = "Bearer $API_KEY"
        "Content-Type" = "application/json"
    }
    
    $params = @{
        Uri = "https://api.render.com/v1$Endpoint"
        Method = $Method
        Headers = $headers
    }
    
    if ($Body) {
        $params.Add('Body', $Body)
    }
    
    try {
        $response = Invoke-RestMethod @params
        return $response
    } catch {
        Write-Error "Erreur lors de l'appel à l'API: $_"
        exit 1
    }
}

# 1. Vérifier si le service existe déjà
Write-Host "Vérification de l'existence du service..."
$services = Invoke-RenderAPI -Method GET -Endpoint "/services"
$service = $services | Where-Object { $_.service.name -eq $SERVICE_NAME }

# 2. Si le service n'existe pas, le créer
if (-not $service) {
    Write-Host "Création du service..."
    $body = @{
        type = "web_service"
        name = $SERVICE_NAME
        repo = "yusuf9900/red_product"
        autoDeploy = "yes"
        serviceDetails = @{
            env = "docker"
            envSpecificDetails = @{
                dockerContext = "./backend"
                dockerfilePath = "./backend/Dockerfile"
            }
            plan = "free"
            region = "frankfurt"
        }
    } | ConvertTo-Json -Depth 10
    
    $service = Invoke-RenderAPI -Method POST -Endpoint "/services" -Body $body
    Write-Host "Service créé avec succès!"
} else {
    Write-Host "Le service existe déjà. Déclenchement d'un nouveau déploiement..."
    $deploy = Invoke-RenderAPI -Method POST -Endpoint "/services/$($service.service.id)/deploys"
    Write-Host "Déploiement déclenché: $($deploy.deploy.id)"
}

# 3. Afficher les logs du déploiement
Write-Host "Affichage des logs du déploiement en cours..."
Start-Process "https://dashboard.render.com/"

# 4. Suivre les logs (approximation, car l'API ne permet pas de suivre les logs en temps réel)
Write-Host "Pour voir les logs en temps réel, veuillez vous rendre sur le dashboard Render"
Write-Host "URL du service: https://dashboard.render.com/web/$($service.service.id)"
