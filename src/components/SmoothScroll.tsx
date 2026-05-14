"use client";

import { ReactLenis, useLenis } from 'lenis/react';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const lenis = useLenis();

    useEffect(() => {
        if (!lenis) return;

        const scrollToHashId = (hashId: string) => {
            if (!hashId) return;
            const el = document.getElementById(hashId);
            if (el) {
                lenis.scrollTo(el, { offset: -24, immediate: false });
            }
        };

        const onHashChange = () => {
            scrollToHashId(window.location.hash.slice(1));
        };

        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, [lenis]);

    useEffect(() => {
        if (!lenis) return;

        const hash = typeof window !== "undefined" ? window.location.hash.slice(1) : "";
        if (hash) {
            const t = window.setTimeout(() => {
                const el = document.getElementById(hash);
                if (el) {
                    lenis.scrollTo(el, { offset: -24, immediate: false });
                } else {
                    lenis.scrollTo(0, { immediate: true });
                }
            }, 0);
            return () => window.clearTimeout(t);
        }

        lenis.scrollTo(0, { immediate: true });
    }, [pathname, lenis]);

    return (
        <ReactLenis root options={{ lerp: 0.05, duration: 1.2 }}>
            {children}
        </ReactLenis>
    );
}
