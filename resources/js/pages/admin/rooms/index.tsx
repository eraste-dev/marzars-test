import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useState } from 'react';

interface Room {
    id: number;
    name: string;
    description: string | null;
    capacity: number;
    reservations_count: number;
}

interface Props {
    rooms: Room[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Gestion des salles', href: '/admin/rooms' },
];

function CreateRoomDialog() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        capacity: 4,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/rooms', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouvelle salle
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Créer une salle</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nom</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="capacity">Capacité</Label>
                        <Input
                            id="capacity"
                            type="number"
                            min="1"
                            max="10"
                            value={data.capacity}
                            onChange={(e) => setData('capacity', parseInt(e.target.value))}
                        />
                        {errors.capacity && <p className="text-sm text-destructive">{errors.capacity}</p>}
                    </div>
                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Création...' : 'Créer'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditRoomDialog({ room }: { room: Room }) {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        name: room.name,
        description: room.description || '',
        capacity: room.capacity,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/rooms/${room.id}`, {
            onSuccess: () => setOpen(false),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier la salle</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="edit-name">Nom</Label>
                        <Input
                            id="edit-name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div>
                        <Label htmlFor="edit-description">Description</Label>
                        <Input
                            id="edit-description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                    </div>
                    <div>
                        <Label htmlFor="edit-capacity">Capacité</Label>
                        <Input
                            id="edit-capacity"
                            type="number"
                            min="1"
                            max="10"
                            value={data.capacity}
                            onChange={(e) => setData('capacity', parseInt(e.target.value))}
                        />
                    </div>
                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Mise à jour...' : 'Mettre à jour'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteRoomButton({ room }: { room: Room }) {
    const { delete: destroy, processing } = useForm({});

    const handleDelete = () => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer "${room.name}" ?`)) {
            destroy(`/admin/rooms/${room.id}`);
        }
    };

    return (
        <Button variant="destructive" size="icon" onClick={handleDelete} disabled={processing}>
            <Trash2 className="h-4 w-4" />
        </Button>
    );
}

export default function AdminRoomsIndex({ rooms }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des salles" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Gestion des salles</h1>
                    <CreateRoomDialog />
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {rooms.map((room) => (
                        <Card key={room.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg">{room.name}</CardTitle>
                                <div className="flex gap-2">
                                    <EditRoomDialog room={room} />
                                    <DeleteRoomButton room={room} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                {room.description && (
                                    <p className="mb-2 text-sm text-muted-foreground">
                                        {room.description}
                                    </p>
                                )}
                                <div className="flex items-center gap-2 text-sm">
                                    <Users className="h-4 w-4" />
                                    <span>
                                        {room.reservations_count}/{room.capacity} places occupées
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {rooms.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Aucune salle créée.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
