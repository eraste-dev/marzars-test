import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CalendarDays, DoorOpen, Users } from 'lucide-react';

interface Reservation {
    id: number;
    room: {
        id: number;
        name: string;
        description: string | null;
    };
    created_at: string;
}

interface AvailableRoom {
    id: number;
    name: string;
    description: string | null;
    capacity: number;
    available_spots: number;
    is_full: boolean;
}

interface Props {
    reservations: Reservation[];
    availableRooms: AvailableRoom[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mes réservations', href: '/dashboard/reservations' },
];

function CancelReservationButton({ roomId }: { roomId: number }) {
    const { delete: destroy, processing } = useForm({});

    const handleCancel = () => {
        if (confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) {
            destroy(`/rooms/${roomId}/cancel`);
        }
    };

    return (
        <Button variant="destructive" onClick={handleCancel} disabled={processing}>
            {processing ? 'Annulation...' : 'Annuler'}
        </Button>
    );
}

function ReserveButton({ room }: { room: AvailableRoom }) {
    const { post, processing } = useForm({});

    const handleReserve = () => {
        post(`/rooms/${room.id}/reserve`);
    };

    return (
        <Button onClick={handleReserve} disabled={room.is_full || processing}>
            {processing ? 'Réservation...' : room.is_full ? 'Complet' : 'Réserver'}
        </Button>
    );
}

export default function UserReservations({ reservations, availableRooms }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mes réservations" />
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">Mes réservations</h1>
                    <p className="text-muted-foreground">
                        Gérez vos réservations de salles
                    </p>
                </div>

                {reservations.length > 0 ? (
                    <div className="mb-8">
                        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                            <CalendarDays className="h-5 w-5" />
                            Réservations en cours ({reservations.length})
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {reservations.map((reservation) => (
                                <Card key={reservation.id}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <DoorOpen className="h-5 w-5" />
                                            {reservation.room.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {reservation.room.description && (
                                            <p className="text-sm text-muted-foreground mb-2">
                                                {reservation.room.description}
                                            </p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Réservé le {reservation.created_at}
                                        </p>
                                    </CardContent>
                                    <CardFooter>
                                        <CancelReservationButton roomId={reservation.room.id} />
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                ) : (
                    <Card className="mb-8">
                        <CardContent className="py-8 text-center">
                            <p className="text-muted-foreground">
                                Vous n'avez aucune réservation en cours.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {availableRooms.length > 0 && (
                    <div>
                        <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                            <DoorOpen className="h-5 w-5" />
                            Salles disponibles
                        </h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {availableRooms.map((room) => (
                                <Card key={room.id}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            <span>{room.name}</span>
                                            <span className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                                                <Users className="h-4 w-4" />
                                                {room.available_spots}/{room.capacity}
                                            </span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {room.description && (
                                            <p className="text-sm text-muted-foreground">
                                                {room.description}
                                            </p>
                                        )}
                                        {room.is_full && (
                                            <p className="mt-2 text-sm text-destructive">
                                                Salle complète
                                            </p>
                                        )}
                                    </CardContent>
                                    <CardFooter>
                                        <ReserveButton room={room} />
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
