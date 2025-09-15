<?php

require __DIR__.'/../vendor/autoload.php';

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

// Charger les variables d'environnement
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

try {
    // Tester la connexion à la base de données
    $pdo = DB::connection()->getPdo();
    echo "Connexion à la base de données réussie!\n";
    
    // Tester la récupération des hôtels
    $hotels = DB::table('hotels')->get();
    echo "Nombre d'hôtels récupérés : " . $hotels->count() . "\n";
    
    // Afficher les hôtels
    foreach ($hotels as $hotel) {
        echo "Hôtel : " . $hotel->name . "\n";
    }
    
} catch (\Exception $e) {
    echo "Erreur : " . $e->getMessage() . "\n";
    echo "Fichier : " . $e->getFile() . "\n";
    echo "Ligne : " . $e->getLine() . "\n";
    echo "Trace : " . $e->getTraceAsString() . "\n";
}
