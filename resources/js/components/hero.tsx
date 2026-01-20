import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Calendar, Coffee, Lamp, Monitor, Users, Wifi } from 'lucide-react';
import { useRef } from 'react';

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const iconsRef = useRef<HTMLDivElement[]>([]);

    useGSAP(() => {
        // Entrance animations
        gsap.from([titleRef.current, subtitleRef.current], {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.3,
            ease: 'expo.out',
        });

        // Floating animations for icons
        iconsRef.current.forEach((icon, i) => {
            gsap.set(icon, {
                x: gsap.utils.random(50, containerRef.current?.offsetWidth || 500) - 100,
                y: gsap.utils.random(50, containerRef.current?.offsetHeight || 300) - 50,
                opacity: 0.2,
            });

            gsap.to(icon, {
                y: '+=20',
                x: '+=10',
                rotation: gsap.utils.random(-15, 15),
                duration: gsap.utils.random(2, 4),
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: i * 0.2,
            });
        });
    }, { scope: containerRef });

    const floatingIcons = [
        { Icon: Coffee, size: 24 },
        { Icon: Monitor, size: 32 },
        { Icon: Users, size: 28 },
        { Icon: Calendar, size: 30 },
        { Icon: Lamp, size: 26 },
        { Icon: Wifi, size: 22 },
    ];

    return (
        <section 
            ref={containerRef}
            className="relative h-[40vh] w-full overflow-hidden bg-linear-to-br from-primary/5 via-background to-primary/5 flex items-center justify-center border-b"
        >
            {/* Floating Background Icons */}
            {floatingIcons.map(({ Icon, size }, i) => (
                <div
                    key={i}
                    ref={(el) => { if (el) iconsRef.current[i] = el; }}
                    className="absolute text-primary pointer-events-none"
                    style={{ zIndex: 0 }}
                >
                    <Icon size={size} strokeWidth={1.5} />
                </div>
            ))}
            
            <div className="container relative z-10 px-4 text-center">
                <h1 
                    ref={titleRef}
                    className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-4"
                >
                    Réservez votre <span className="text-primary">Espace de Travail</span>
                </h1>
                <p 
                    ref={subtitleRef}
                    className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
                >
                    La plateforme collaborative de réservation de salles pour Forvis Mazars. 
                    Simple, rapide et efficace.
                </p>
            </div>

            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />
        </section>
    );
}
