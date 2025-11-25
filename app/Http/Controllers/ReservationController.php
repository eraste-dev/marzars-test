<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function store(Request $request, Room $room): RedirectResponse
    {
        $user = $request->user();

        if ($user->hasReservationInRoom($room->id)) {
            return back()->withErrors(['reservation' => 'Vous avez déjà une réservation dans cette salle.']);
        }

        if ($room->isFull()) {
            return back()->withErrors(['reservation' => 'Cette salle est complète.']);
        }

        Reservation::create([
            'user_id' => $user->id,
            'room_id' => $room->id,
        ]);

        return back()->with('success', 'Réservation effectuée avec succès!');
    }

    public function destroy(Room $room): RedirectResponse
    {
        $user = auth()->user();

        $reservation = Reservation::where('user_id', $user->id)
            ->where('room_id', $room->id)
            ->first();

        if (!$reservation) {
            return back()->withErrors(['reservation' => 'Réservation non trouvée.']);
        }

        $reservation->delete();

        return back()->with('success', 'Réservation annulée avec succès!');
    }
}
