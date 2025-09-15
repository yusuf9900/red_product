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
