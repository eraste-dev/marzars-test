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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { CalendarDays, Pencil, ShieldCheck, Trash2, User } from 'lucide-react';
import { useState } from 'react';

interface UserData {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'user';
    reservations_count: number;
    created_at: string;
}

interface Props {
    users: UserData[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Gestion des utilisateurs', href: '/admin/users' },
];

function EditUserDialog({ user }: { user: UserData }) {
    const [open, setOpen] = useState(false);
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.role,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`, {
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
                    <DialogTitle>Modifier l'utilisateur</DialogTitle>
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
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                            id="edit-email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                    <div>
                        <Label htmlFor="edit-role">Rôle</Label>
                        <Select value={data.role} onValueChange={(value: 'admin' | 'user') => setData('role', value)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">Utilisateur</SelectItem>
                                <SelectItem value="admin">Administrateur</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && <p className="text-sm text-destructive">{errors.role}</p>}
                    </div>
                    <Button type="submit" disabled={processing} className="w-full">
                        {processing ? 'Mise à jour...' : 'Mettre à jour'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteUserButton({ user }: { user: UserData }) {
    const { delete: destroy, processing } = useForm({});

    const handleDelete = () => {
        if (confirm(`Êtes-vous sûr de vouloir supprimer "${user.name}" ?`)) {
            destroy(`/admin/users/${user.id}`);
        }
    };

    return (
        <Button variant="destructive" size="icon" onClick={handleDelete} disabled={processing}>
            <Trash2 className="h-4 w-4" />
        </Button>
    );
}

export default function AdminUsersIndex({ users }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des utilisateurs" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
                    <p className="text-muted-foreground">{users.length} utilisateur(s)</p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {users.map((user) => (
                        <Card key={user.id}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    {user.role === 'admin' ? (
                                        <ShieldCheck className="h-5 w-5 text-primary" />
                                    ) : (
                                        <User className="h-5 w-5" />
                                    )}
                                    {user.name}
                                </CardTitle>
                                <div className="flex gap-2">
                                    <EditUserDialog user={user} />
                                    <DeleteUserButton user={user} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                <div className="mt-2 flex items-center gap-4 text-sm">
                                    <span className={`rounded px-2 py-1 text-xs ${
                                        user.role === 'admin'
                                            ? 'bg-primary/10 text-primary'
                                            : 'bg-muted text-muted-foreground'
                                    }`}>
                                        {user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <CalendarDays className="h-3 w-3" />
                                        {user.reservations_count} réservation(s)
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {users.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">Aucun utilisateur.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
