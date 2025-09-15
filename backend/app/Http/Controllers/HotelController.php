<?php

namespace App\Http\Controllers;

use App\Models\Hotel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class HotelController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            \Log::info('Début de la méthode index() du contrôleur Hotel');
            
            // Tester la connexion à la base de données
            \DB::connection()->getPdo();
            \Log::info('Connexion à la base de données réussie');
            
            // Tester la récupération des hôtels
            $hotels = Hotel::latest()->get();
            \Log::info('Nombre d\'hôtels récupérés : ' . $hotels->count());
            
            // Tester la conversion en JSON
            $jsonResponse = response()->json($hotels);
            \Log::info('Réponse JSON générée avec succès');
            
            return $jsonResponse;
            
        } catch (\Exception $e) {
            \Log::error('Erreur dans HotelController@index: ' . $e->getMessage());
            \Log::error('Fichier : ' . $e->getFile());
            \Log::error('Ligne : ' . $e->getLine());
            \Log::error('Trace : ' . $e->getTraceAsString());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Une erreur est survenue lors de la récupération des hôtels',
                'error' => env('APP_DEBUG') ? $e->getMessage() : null,
                'file' => env('APP_DEBUG') ? $e->getFile() : null,
                'line' => env('APP_DEBUG') ? $e->getLine() : null,
            ], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Not used for API
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:50',
            'price_per_night' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
            'photo' => 'nullable|image|max:2048',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('hotels', 'public');
        }

        $hotel = Hotel::create(array_merge($validated, [
            'photo' => $photoPath,
        ]));

        return response()->json($hotel, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Hotel $hotel)
    {
        return response()->json($hotel);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Hotel $hotel)
    {
        // Not used for API
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Hotel $hotel)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'address' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255',
            'phone' => 'sometimes|required|string|max:50',
            'price_per_night' => 'sometimes|required|numeric|min:0',
            'currency' => 'sometimes|required|string|size:3',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            // delete old photo if exists
            if ($hotel->photo) {
                Storage::disk('public')->delete($hotel->photo);
            }
            $validated['photo'] = $request->file('photo')->store('hotels', 'public');
        }

        $hotel->update($validated);
        return response()->json($hotel);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Hotel $hotel)
    {
        if ($hotel->photo) {
            Storage::disk('public')->delete($hotel->photo);
        }
        $hotel->delete();
        return response()->json([ 'message' => 'Deleted' ]);
    }
}

