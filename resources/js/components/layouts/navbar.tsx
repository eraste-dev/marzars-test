import { Button } from '@/components/ui/button';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import AppLogo from '../app-logo';
import { NavMenu } from './nav-menu';
import { NavigationSheet } from './navigation-sheet';

const Navbar = () => {
    const { auth } = usePage<SharedData>().props;

    return (
        <nav className="sticky top-0 z-50 h-16 border-b bg-background/95 backdrop-blur-sm shadow-sm">
            <div className="mx-auto flex h-full max-w-(--breakpoint-xl) items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-12">
                    <Link href="/">
                        <AppLogo />
                    </Link>

                    {/* Desktop Menu */}
                    <NavMenu className="hidden md:block" />
                </div>

                <div className="flex items-center gap-3">
                    {auth.user ? (
                        <>
                            <span className="hidden text-sm text-muted-foreground sm:inline">
                                {auth.user.name}
                            </span>
                            <Button asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                            <Button variant="ghost" asChild>
                                <Link href="/logout" method="post" as="button">
                                    Déconnexion
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="outline" asChild className="hidden sm:inline-flex">
                                <Link href="/login">Connexion</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Inscription</Link>
                            </Button>
                        </>
                    )}

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <NavigationSheet />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
