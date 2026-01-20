<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    public function index(): Response
    {
        $rooms = Room::withCount('reservations')
            ->with('reservations.user')
            ->get()
            ->map(function ($room) {
                return [
                    'id' => $room->id,
                    'name' => $room->name,
                    'description' => $room->description,
                    'capacity' => $room->capacity,
                    'reservations_count' => $room->reservations_count,
                    'available_spots' => $room->capacity - $room->reservations_count,
                    'is_full' => $room->reservations_count >= $room->capacity,
                    'reservations' => $room->reservations->map(function ($res) {
                        return [
                            'id' => $res->id,
                            'user' => [
                                'name' => $res->user->name,
                                'email' => $res->user->email,
                            ],
                        ];
                    }),
                ];
            });

        $userReservations = [];
        if (auth()->check()) {
            $userReservations = auth()->user()->reservations()->pluck('room_id')->toArray();
        }

        return Inertia::render('home', [
            'rooms' => $rooms,
            'userReservations' => $userReservations,
        ]);
    }
}
