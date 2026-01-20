<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $rooms = [
            ['name' => 'Salle Alpha', 'description' => 'Salle de réunion principale'],
            ['name' => 'Salle Beta', 'description' => 'Espace collaboratif'],
            ['name' => 'Salle Gamma', 'description' => 'Salle de formation'],
            ['name' => 'Salle Delta', 'description' => 'Espace détente'],
            ['name' => 'Salle Epsilon', 'description' => 'Bureau partagé'],
            ['name' => 'Salle Zeta', 'description' => 'Salle de conférence'],
        ];

        foreach ($rooms as $room) {
            Room::firstOrCreate(
                ['name' => $room['name']],
                [
                    'description' => $room['description'],
                    'capacity' => 4,
                ]
            );
        }
    }
}
