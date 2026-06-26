"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const HASH_SCROLL_OFFSET = -24;

function scrollToHashId(hashId: string, behavior: ScrollBehavior = "smooth") {
    if (!hashId) return;
    const el = document.getElementById(hashId);
    if (!el) return;

    const top =
        el.getBoundingClientRect().top + window.scrollY + HASH_SCROLL_OFFSET;
    window.scrollTo({ top, behavior });
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    useEffect(() => {
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
    }, [pathname]);

    useEffect(() => {
        const hash =
            typeof window !== "undefined" ? window.location.hash.slice(1) : "";
        if (hash) {
            const t = window.setTimeout(() => {
                const el = document.getElementById(hash);
                if (el) {
                    scrollToHashId(hash);
                } else {
                    window.scrollTo({ top: 0, behavior: "auto" });
                }
            }, 0);
            return () => window.clearTimeout(t);
        }

        window.scrollTo({ top: 0, behavior: "auto" });
    }, [pathname]);

    return children;
}
