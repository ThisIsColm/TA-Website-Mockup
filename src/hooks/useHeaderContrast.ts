"use client";

import {
    useState,
    useEffect,
    useCallback,
    useRef,
    type RefObject,
} from "react";
import { usePathname } from "next/navigation";

export const HEADER_SURFACE_UPDATE = "header-surface-update";

type HeaderSurface = "white" | "dark" | "neutral";

const SURFACE_PRIORITY: Record<HeaderSurface, number> = {
    dark: 0,
    white: 1,
    neutral: 2,
};

/** Which marked section sits under the fixed header (highest top among intersecting). */
function getSurfaceUnderHeader(headerBottom: number): HeaderSurface | null {
    const candidates: { surface: HeaderSurface; top: number }[] = [];

    document.querySelectorAll("[data-header-surface]").forEach((el) => {
        const surface = el.getAttribute("data-header-surface");
        if (surface !== "white" && surface !== "dark" && surface !== "neutral") {
            return;
        }
        const r = el.getBoundingClientRect();
        if (r.top < headerBottom && r.bottom > 0) {
            candidates.push({ surface, top: r.top });
        }
    });

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => {
        if (b.top !== a.top) return b.top - a.top;
        return SURFACE_PRIORITY[a.surface] - SURFACE_PRIORITY[b.surface];
    });
    return candidates[0].surface;
}

/**
 * True when the header sits over a **white** surface (orange logo, black burger).
 * Dark surfaces (video, photos) force white chrome.
 * Neutral surfaces (site beige #EAE4DD) preserve the current theme.
 */
export function useHeaderContrast(
    headerRef: RefObject<HTMLElement | null>
): boolean {
    const pathname = usePathname();
    const [isOverWhiteBg, setIsOverWhiteBg] = useState(false);
    const lastThemeRef = useRef(false);

    const update = useCallback(() => {
        if (pathname === "/contact") {
            lastThemeRef.current = true;
            setIsOverWhiteBg(true);
            return;
        }

        const headerBottom =
            headerRef.current?.getBoundingClientRect().bottom ?? 72;
        const surface = getSurfaceUnderHeader(headerBottom);

        if (surface === "white") {
            lastThemeRef.current = true;
            setIsOverWhiteBg(true);
        } else if (surface === "dark") {
            lastThemeRef.current = false;
            setIsOverWhiteBg(false);
        } else if (surface === "neutral") {
            setIsOverWhiteBg(lastThemeRef.current);
        } else {
            setIsOverWhiteBg(lastThemeRef.current);
        }
    }, [headerRef, pathname]);

    useEffect(() => {
        lastThemeRef.current = false;
        setIsOverWhiteBg(false);
        update();

        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        window.addEventListener(HEADER_SURFACE_UPDATE, update);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
            window.removeEventListener(HEADER_SURFACE_UPDATE, update);
        };
    }, [pathname, update]);

    return isOverWhiteBg;
}
