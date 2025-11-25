import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ComponentProps } from 'react';

export const NavMenu = (props: ComponentProps<typeof NavigationMenu>) => {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user?.role === 'admin';

    return (
        <NavigationMenu {...props}>
            <NavigationMenuList className="data-[orientation=vertical]:-ms-2 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start data-[orientation=vertical]:justify-start">
                <NavigationMenuItem>
                    <NavigationMenuLink
                        asChild
                        className={navigationMenuTriggerStyle()}
                    >
                        <Link href="/">Accueil</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                {auth.user && (
                    <>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={navigationMenuTriggerStyle()}
                            >
                                <Link href="/dashboard/reservations">Mes réservations</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        {isAdmin && (
                            <>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <Link href="/admin/rooms">Gestion salles</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        asChild
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        <Link href="/admin/users">Gestion utilisateurs</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </>
                        )}
                    </>
                )}
            </NavigationMenuList>
        </NavigationMenu>
    );
};
