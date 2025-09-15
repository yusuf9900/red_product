<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    /** @use HasFactory<\Database\Factories\HotelFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'address',
        'email',
        'phone',
        'price_per_night',
        'currency',
        'photo',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    // Temporarily disabled for debugging
    // protected $appends = ['photo_url'];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price_per_night' => 'decimal:2',
        ];
    }

    /**
     * Get the URL for the hotel photo.
     *
     * @return string|null
     */
    public function getPhotoUrlAttribute()
    {
        return $this->photo ? asset('storage/' . $this->photo) : null;
    }
}
