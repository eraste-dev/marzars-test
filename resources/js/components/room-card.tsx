import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { Users } from 'lucide-react';

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
        <Card className="group relative overflow-hidden border-sidebar-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-xl font-bold tracking-tight">
                            {room.name}
                        </CardTitle>
                        {room.description && (
                            <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                                {room.description}
                            </p>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pb-6">
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Occupation
                    </span>
                    <span className={cn(
                        "text-sm font-semibold px-3 py-1 rounded-full",
                        room.is_full ? "bg-destructive/15 text-destructive" : "bg-primary/15 text-primary"
                    )}>
                        {room.reservations_count} / {room.capacity}
                    </span>
                </div>

                <TooltipProvider delayDuration={0}>
                    <div className="flex flex-wrap gap-2">
                        {spotsArray.map((index) => {
                            const reservation = room.reservations[index];
                            const isOccupied = index < filledSpots;

                            return (
                                <Tooltip key={index}>
                                    <TooltipTrigger asChild>
                                        <div
                                            className={cn(
                                                'h-9 w-9 rounded-xl border flex items-center justify-center transition-all duration-200',
                                                isOccupied
                                                    ? 'bg-primary border-primary text-primary-foreground shadow-sm'
                                                    : 'border-muted-foreground/40 bg-muted/10 text-muted-foreground/60'
                                            )}
                                        >
                                            <Users className={cn("h-4 w-4", isOccupied ? "opacity-100" : "opacity-70")} />
                                        </div>
                                    </TooltipTrigger>
                                    {isOccupied && reservation && (
                                        <TooltipContent side="top" className="bg-slate-900 text-slate-50 border-none shadow-xl px-3 py-1.5 uppercase tracking-wider">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-slate-400">Réservé par</span>
                                                <span className="text-sm font-semibold">{reservation.user.name}</span>
                                            </div>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            );
                        })}
                    </div>
                </TooltipProvider>
            </CardContent>

            <CardFooter className="pt-0">
                {!isAuthenticated ? (
                    <Button variant="secondary" className="w-full text-white" asChild>
                        <a href="/login">Se connecter</a>
                    </Button>
                ) : hasReservation ? (
                    <Button
                        variant="destructive"
                        className="w-full transition-all hover:bg-destructive/90"
                        onClick={handleCancel}
                        disabled={cancelForm.processing}
                    >
                        {cancelForm.processing ? 'Annulation...' : 'Annuler'}
                    </Button>
                ) : (
                    <Button
                        className="w-full transition-all"
                        onClick={handleReserve}
                        disabled={room.is_full || reserveForm.processing}
                    >
                        {reserveForm.processing ? 'Réservation...' : 'Réserver'}
                    </Button>
                )}
            </CardFooter>

            {/* Subtle Progress Bar at the absolute bottom */}
            <div className="absolute bottom-0 left-0 h-1 bg-muted w-full">
                <div 
                    className={cn(
                        "h-full transition-all duration-500",
                        room.is_full ? "bg-destructive" : "bg-primary"
                    )}
                    style={{ width: `${(room.reservations_count / room.capacity) * 100}%` }}
                />
            </div>
        </Card>
    );
}
