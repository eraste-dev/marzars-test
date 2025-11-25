<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    protected $fillable = [
        'name',
        'description',
        'capacity',
    ];

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    public function getAvailableSpotsAttribute(): int
    {
        return $this->capacity - $this->reservations()->count();
    }

    public function isFull(): bool
    {
        return $this->available_spots <= 0;
    }
}
