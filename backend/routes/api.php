<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\HotelController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and assigned to the "api"
| middleware group. Make something great!
|
*/

// Simple test route
Route::get('/test', function () {
    return response()->json(['status' => 'success', 'message' => 'API is working']);
});

// Test logging and database connection
Route::get('/test-logging', function () {
    try {
        // Test logging
        \Illuminate\Support\Facades\Log::info('Test log message from /test-logging endpoint');
        
        // Test database connection
        $connection = \Illuminate\Support\Facades\DB::connection();
        $pdo = $connection->getPdo();
        
        // Test query
        $hotels = \App\Models\Hotel::select('id', 'name', 'email', 'price_per_night', 'currency')->get();
        
        return response()->json([
            'status' => 'success',
            'logging' => 'Log message written successfully',
            'database' => [
                'connection' => 'Connected to database: ' . $connection->getDatabaseName(),
                'hotels_count' => $hotels->count(),
                'hotels_sample' => $hotels->take(1)
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

// Test DB Connection
Route::get('/test-db', function () {
    try {
        $connection = DB::connection();
        $pdo = $connection->getPdo();
        
        // Récupérer des informations détaillées sur la connexion
        $connectionInfo = [
            'driver' => $connection->getDriverName(),
            'database' => $connection->getDatabaseName(),
            'host' => $connection->getConfig('host'),
            'port' => $connection->getConfig('port'),
            'username' => $connection->getConfig('username'),
            'charset' => $connection->getConfig('charset'),
            'collation' => $connection->getConfig('collation'),
            'prefix' => $connection->getConfig('prefix'),
            'strict' => $connection->getConfig('strict'),
            'engine' => $connection->getConfig('engine'),
            'sslmode' => $connection->getConfig('sslmode') ?? 'not set',
            'options' => $connection->getConfig('options') ?? [],
            'connection_status' => $pdo->getAttribute(PDO::ATTR_CONNECTION_STATUS),
            'server_version' => $pdo->getAttribute(PDO::ATTR_SERVER_VERSION),
            'client_version' => $pdo->getAttribute(PDO::ATTR_CLIENT_VERSION),
        ];

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully connected to the database!',
            'connection' => $connectionInfo
        ]);
    } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::error('Database connection error: ' . $e->getMessage(), [
            'exception' => $e,
            'config' => [
                'default' => config('database.default'),
                'connections' => array_keys(config('database.connections'))
            ]
        ]);

        return response()->json([
            'status' => 'error',
            'message' => 'Could not connect to the database.',
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => env('APP_DEBUG') ? $e->getTraceAsString() : null
        ], 500);
    }
});

// Route de santé pour Render
Route::get('/health', function () {
    try {
        DB::connection()->getPdo();
        return response()->json([
            'status' => 'ok',
            'database' => 'connected'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'database' => 'not connected',
            'error' => $e->getMessage()
        ], 500);
    }
});

// Routes d'authentification
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    // Current authenticated user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    // Hotel CRUD routes
    Route::apiResource('hotels', HotelController::class);
});

// Route de débogage pour tester la connexion à la base de données
Route::get('/debug-db', function () {
    try {
        // Afficher les informations de connexion (sans les mots de passe)
        $dbConfig = [
            'DB_CONNECTION' => env('DB_CONNECTION'),
            'DB_HOST' => env('DB_HOST'),
            'DB_PORT' => env('DB_PORT'),
            'DB_DATABASE' => env('DB_DATABASE'),
            'DB_USERNAME' => env('DB_USERNAME'),
            'DB_SSL_CA' => env('DB_SSL_CA') ? 'set' : 'not set',
            'MYSQL_ATTR_SSL_VERIFY_SERVER_CERT' => env('MYSQL_ATTR_SSL_VERIFY_SERVER_CERT', 'not set'),
        ];
        
        // Tester la connexion à la base de données
        $pdo = DB::connection()->getPdo();
        $dbVersion = $pdo->getAttribute(PDO::ATTR_SERVER_VERSION);
        
        // Tester la récupération des hôtels
        $hotels = DB::table('hotels')->get();
        
        return response()->json([
            'status' => 'success',
            'db_config' => $dbConfig,
            'db_version' => $dbVersion,
            'hotels_count' => $hotels->count(),
            'hotels' => $hotels,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => explode("\n", $e->getTraceAsString()),
        ], 500);
    }
});
