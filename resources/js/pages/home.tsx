import LayoutPublic from '@/components/layouts/layout.public';
import { Hero } from '@/components/hero';
import { RoomCard } from '@/components/room-card';
import { type SharedData } from '@/types';
import { useGSAP } from '@gsap/react';
import { Head, usePage } from '@inertiajs/react';
import gsap from 'gsap';
import { useRef } from 'react';

interface Reservation {
    id: number;
    user: {
        name: string;
        email: string;
    };
}

interface Room {
    id: number;
    name: string;
    description: string | null;
    capacity: number;
    reservations_count: number;
    available_spots: number;
    is_full: boolean;
    reservations: Reservation[];
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
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const tl = gsap.timeline();

            tl.from('.header-animate', {
                y: -30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
            }).from(
                '.room-card-animate',
                {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: 'power2.out',
                },
                '-=0.4',
            );
        },
        { scope: containerRef },
    );

    return (
        <LayoutPublic>
            <Head title="Salles disponibles" />
            <div className="min-h-screen bg-background">
                <Hero />
                <main className="container mx-auto px-4 py-8" ref={containerRef}>
                    <div className="header-animate mb-8 text-center">
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
                                <div key={room.id} className="room-card-animate">
                                    <RoomCard
                                        room={room}
                                        hasReservation={userReservations.includes(
                                            room.id,
                                        )}
                                        isAuthenticated={!!auth.user}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </LayoutPublic>
    );
}
