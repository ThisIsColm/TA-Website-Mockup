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

        /** Re-scroll when #work is clicked again while hash is already #work. */
        const onWorkAnchorClick = (e: MouseEvent) => {
            if (pathname !== "/") return;

            const anchor = (e.target as Element).closest("a");
            if (!anchor) return;

            const href = anchor.getAttribute("href");
            if (href !== "/#work" && href !== "#work") return;

            const el = document.getElementById("work");
            if (!el) return;

            e.preventDefault();

            if (window.location.hash !== "#work") {
                window.location.hash = "#work";
                return;
            }

            scrollToHashId("work");
        };

        window.addEventListener("hashchange", onHashChange);
        document.addEventListener("click", onWorkAnchorClick, true);
        return () => {
            window.removeEventListener("hashchange", onHashChange);
            document.removeEventListener("click", onWorkAnchorClick, true);
        };
    }, [lenis, pathname]);

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
