<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Inertia\Inertia;
use Inertia\Response;

class UserReservationController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();

        $reservations = $user->reservations()->with('room')->get()->map(function ($reservation) {
            return [
                'id' => $reservation->id,
                'room' => [
                    'id' => $reservation->room->id,
                    'name' => $reservation->room->name,
                    'description' => $reservation->room->description,
                ],
                'created_at' => $reservation->created_at->format('d/m/Y H:i'),
            ];
        });

        $availableRooms = Room::withCount('reservations')
            ->get()
            ->filter(fn($room) => !$user->hasReservationInRoom($room->id))
            ->map(function ($room) {
                return [
                    'id' => $room->id,
                    'name' => $room->name,
                    'description' => $room->description,
                    'capacity' => $room->capacity,
                    'available_spots' => $room->capacity - $room->reservations_count,
                    'is_full' => $room->reservations_count >= $room->capacity,
                ];
            })
            ->values();

        return Inertia::render('dashboard/reservations', [
            'reservations' => $reservations,
            'availableRooms' => $availableRooms,
        ]);
    }
}
