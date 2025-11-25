<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoomController extends Controller
{
    public function index(): Response
    {
        $rooms = Room::withCount('reservations')->get();

        return Inertia::render('admin/rooms/index', [
            'rooms' => $rooms,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:rooms',
            'description' => 'nullable|string|max:500',
            'capacity' => 'required|integer|min:1|max:10',
        ]);

        Room::create($validated);

        return back()->with('success', 'Salle créée avec succès.');
    }

    public function update(Request $request, Room $room): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:rooms,name,' . $room->id,
            'description' => 'nullable|string|max:500',
            'capacity' => 'required|integer|min:1|max:10',
        ]);

        $room->update($validated);

        return back()->with('success', 'Salle mise à jour avec succès.');
    }

    public function destroy(Room $room): RedirectResponse
    {
        $room->delete();

        return back()->with('success', 'Salle supprimée avec succès.');
    }
}
