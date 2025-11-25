import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { Users } from 'lucide-react';

interface Room {
    id: number;
    name: string;
    description: string | null;
    capacity: number;
    reservations_count: number;
    available_spots: number;
    is_full: boolean;
}

interface RoomCardProps {
    room: Room;
    hasReservation: boolean;
    isAuthenticated: boolean;
}

export function RoomCard({ room, hasReservation, isAuthenticated }: RoomCardProps) {
    const reserveForm = useForm({});
    const cancelForm = useForm({});

    const handleReserve = () => {
        reserveForm.post(`/rooms/${room.id}/reserve`);
    };

    const handleCancel = () => {
        cancelForm.delete(`/rooms/${room.id}/cancel`);
    };

    const spotsArray = Array.from({ length: room.capacity }, (_, i) => i);
    const filledSpots = room.reservations_count;

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{room.name}</span>
                    <span className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {room.available_spots}/{room.capacity}
                    </span>
                </CardTitle>
                {room.description && (
                    <p className="text-sm text-muted-foreground">{room.description}</p>
                )}
            </CardHeader>

            <CardContent>
                <div className="flex justify-center gap-2">
                    {spotsArray.map((index) => (
                        <div
                            key={index}
                            className={cn(
                                'h-10 w-10 rounded-full border-2 flex items-center justify-center transition-colors',
                                index < filledSpots
                                    ? 'bg-primary border-primary text-primary-foreground'
                                    : 'border-muted-foreground/30 bg-muted/30'
                            )}
                        >
                            <Users className="h-5 w-5" />
                        </div>
                    ))}
                </div>
                {room.is_full && (
                    <p className="mt-3 text-center text-sm text-destructive font-medium">
                        Salle complète
                    </p>
                )}
            </CardContent>

            <CardFooter className="justify-center">
                {!isAuthenticated ? (
                    <Button variant="outline" asChild>
                        <a href="/login">Connectez-vous pour réserver</a>
                    </Button>
                ) : hasReservation ? (
                    <Button
                        variant="destructive"
                        onClick={handleCancel}
                        disabled={cancelForm.processing}
                    >
                        {cancelForm.processing ? 'Annulation...' : 'Annuler ma réservation'}
                    </Button>
                ) : (
                    <Button
                        onClick={handleReserve}
                        disabled={room.is_full || reserveForm.processing}
                    >
                        {reserveForm.processing ? 'Réservation...' : 'Réserver une place'}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
