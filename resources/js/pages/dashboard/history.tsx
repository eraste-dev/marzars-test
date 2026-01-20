import LayoutPublic from '@/components/layouts/layout.public';
import AppLayout from '@/layouts/app-layout';
import { SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

interface Reservation {
    id: number;
    room_name: string;
    room_description: string;
    created_at: string;
    date: string;
    time: string;
}

export default function History({ reservations }: { reservations: Reservation[] }) {
    const { auth } = usePage<SharedData>().props;
    const isSimpleUser = auth.user.role !== 'admin';

    const content = (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-8">Historique des réservations</h1>
            
            <div className="relative border-l-2 border-muted ml-3 pb-4">
                {reservations.length > 0 ? (
                    reservations.map((res) => (
                        <div key={res.id} className="mb-8 ml-6 relative">
                            {/* Dot on the line */}
                            <span className="absolute -left-[31px] mt-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary ring-4 ring-background" />
                            
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                                <div className="p-4 flex flex-col gap-2">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                                        <h3 className="font-semibold text-lg">{res.room_name}</h3>
                                        <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded w-fit">
                                            {res.created_at}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {res.room_description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="ml-6 pt-2">
                        <p className="text-muted-foreground">Aucune réservation pour le moment.</p>
                    </div>
                )}
            </div>
        </div>
    );

    const breadcrumbs = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Historique', href: '/dashboard/history' },
    ];

    if (isSimpleUser) {
        return (
            <LayoutPublic>
                <Head title="Historique" />
                {content}
            </LayoutPublic>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Historique" />
            {content}
        </AppLayout>
    );
}
