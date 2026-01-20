import LayoutPublic from '@/components/layouts/layout.public';
import { Hero } from '@/components/hero';
import { RoomCard } from '@/components/room-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type SharedData } from '@/types';
import { useGSAP } from '@gsap/react';
import { Head, usePage } from '@inertiajs/react';
import gsap from 'gsap';
import { Search } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

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
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, available, full

    const filteredRooms = useMemo(() => {
        return rooms.filter((room) => {
            const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                (room.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
            
            if (filterStatus === 'available') return matchesSearch && !room.is_full;
            if (filterStatus === 'full') return matchesSearch && room.is_full;
            return matchesSearch;
        });
    }, [rooms, searchQuery, filterStatus]);

    // Re-run animation when filtered rooms change
    useGSAP(
        () => {
            gsap.fromTo(
                '.room-card-animate',
                { opacity: 0, scale: 0.95 },
                { opacity: 1, scale: 1, duration: 0.4, stagger: 0.05, ease: 'power2.out' }
            );
        },
        { scope: containerRef, dependencies: [filteredRooms] }
    );

    useGSAP(
        () => {
            const tl = gsap.timeline();
            tl.from('.header-animate', {
                y: -30,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
            });
        },
        { scope: containerRef },
    );

    return (
        <LayoutPublic>
            <Head title="Salles disponibles" />
            <div className="min-h-screen bg-background">
                <Hero />
                <main className="container mx-auto px-4 py-8" ref={containerRef}>
                    <div className="header-animate mb-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="text-left">
                            <h2 className="text-3xl font-bold tracking-tight">
                                Salles disponibles
                            </h2>
                            <p className="mt-2 text-muted-foreground">
                                Trouvez l'espace idéal pour vos réunions.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input 
                                    placeholder="Rechercher une salle..." 
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Filtrer" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes les salles</SelectItem>
                                    <SelectItem value="available">Disponibles</SelectItem>
                                    <SelectItem value="full">Complètes</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {filteredRooms.length === 0 ? (
                        <div className="py-20 text-center">
                            <div className="mb-4 flex justify-center">
                                <Search className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-medium">Aucun résultat</h3>
                            <p className="text-muted-foreground">
                                Essayez d'ajuster vos filtres ou votre recherche.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredRooms.map((room) => (
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
