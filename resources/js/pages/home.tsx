import LayoutPublic from '@/components/layouts/layout.public';
import { RoomCard } from '@/components/room-card';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface Room {
    id: number;
    name: string;
    description: string | null;
    capacity: number;
    reservations_count: number;
    available_spots: number;
    is_full: boolean;
}

interface WelcomeProps {
    rooms: Room[];
    userReservations: number[];
}

export default function Welcome({
    rooms = [],
    userReservations = [],
}: WelcomeProps) {
    const { auth } = usePage<SharedData>().props;

    return (
        <LayoutPublic>
            <Head title="Salles disponibles" />
            <div className="min-h-screen bg-background">
                <main className="container mx-auto px-4 py-8">
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Salles disponibles
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                            Réservez votre place dans l'une de nos salles (max 1
                            place par salle)
                        </p>
                    </div>

                    {rooms.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-muted-foreground">
                                Aucune salle disponible pour le moment.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {rooms.map((room) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    hasReservation={userReservations.includes(
                                        room.id,
                                    )}
                                    isAuthenticated={!!auth.user}
                                />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </LayoutPublic>
    );
}
