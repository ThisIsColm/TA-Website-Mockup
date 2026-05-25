"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useHeaderContrast } from "@/hooks/useHeaderContrast";
import { typeClass } from "@/lib/typographyStyles";

// "Home" is reached via the logo; menu lists Work / About / Insights to match the design.
const navLinks = [
    /** Project grid lives on the homepage — menu scrolls to this anchor */
    { href: "/#work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/insights", label: "Insights" },
    { href: "/contact", label: "Contact" },
];

const LOGO_WHITE = "/images/TA_Logo_2026.png";
const LOGO_ORANGE = "/images/TA_Logo_2026_Orange.png";

const CHROME_CROSSFADE =
    "transition-opacity duration-300 ease-out motion-reduce:transition-none";

/** Scroll up this far (px) while the bar is off-screen before it fades back in. */
const SHOW_SCROLL_ACCUM = 14;
/** Ignore tiny trackpad noise. */
const MIN_SCROLL_DELTA = 2;

type ChromeMode = "visible" | "tracking" | "fade-in";

function LogoLink({
    isOverWhiteBg,
    className = "",
    onClick,
}: {
    isOverWhiteBg: boolean;
    className?: string;
    onClick?: () => void;
}) {
    return (
        <Link
            href="/"
            onClick={onClick}
            className={`group relative z-10 inline-flex items-center ${className}`}
            aria-label="Tiny Ark home"
        >
            <span className="relative block w-[120px]">
                {/* Default: white on dark surfaces */}
                <img
                    src={LOGO_WHITE}
                    alt=""
                    className={`block h-auto w-full ${CHROME_CROSSFADE} ${
                        isOverWhiteBg
                            ? "opacity-0"
                            : "opacity-100 group-hover:opacity-0"
                    }`}
                />
                {/* Default: orange on white surfaces */}
                <img
                    src={LOGO_ORANGE}
                    alt=""
                    className={`absolute inset-0 block h-auto w-full ${CHROME_CROSSFADE} ${
                        isOverWhiteBg
                            ? "opacity-100 group-hover:opacity-0"
                            : "opacity-0"
                    }`}
                />
                {/* Hover: black on white surfaces */}
                <img
                    src={LOGO_WHITE}
                    alt=""
                    className={`absolute inset-0 block h-auto w-full brightness-0 ${CHROME_CROSSFADE} ${
                        isOverWhiteBg
                            ? "opacity-0 group-hover:opacity-100"
                            : "opacity-0"
                    }`}
                />
                {/* Hover: orange on dark surfaces */}
                <img
                    src={LOGO_ORANGE}
                    alt="Tiny Ark"
                    className={`absolute inset-0 block h-auto w-full ${CHROME_CROSSFADE} ${
                        isOverWhiteBg
                            ? "opacity-0"
                            : "opacity-0 group-hover:opacity-100"
                    }`}
                />
            </span>
        </Link>
    );
}

function ChromeBar({
    isOverWhiteBg,
    className = "",
}: {
    isOverWhiteBg: boolean;
    className?: string;
}) {
    return (
        <span className={`absolute block w-6 h-[2px] ${className}`}>
            <span
                className={`absolute inset-0 bg-white ${CHROME_CROSSFADE} ${
                    isOverWhiteBg ? "opacity-0" : "opacity-100"
                }`}
            />
            <span
                className={`absolute inset-0 bg-black ${CHROME_CROSSFADE} ${
                    isOverWhiteBg ? "opacity-100" : "opacity-0"
                }`}
            />
        </span>
    );
}

export default function Header() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [hash, setHash] = useState("");
    const headerRef = useRef<HTMLElement>(null);
    const chromeWrapRef = useRef<HTMLDivElement>(null);
    const menuWrapRef = useRef<HTMLDivElement>(null);
    const lastScrollY = useRef(0);
    const scrollAccumRef = useRef(0);
    const chromeOffsetRef = useRef(0);
    const chromeModeRef = useRef<ChromeMode>("visible");
    const scrollRafRef = useRef(0);
    const isOverWhiteBg = useHeaderContrast(headerRef);
    const [chromeOffset, setChromeOffset] = useState(0);
    const [chromeMode, setChromeMode] = useState<ChromeMode>("visible");

    const setChromeModeSafe = (mode: ChromeMode) => {
        chromeModeRef.current = mode;
        setChromeMode(mode);
    };

    useEffect(() => {
        setHash(typeof window !== "undefined" ? window.location.hash : "");
    }, [pathname]);

    useEffect(() => {
        chromeOffsetRef.current = 0;
        setChromeOffset(0);
        setChromeModeSafe("visible");
        scrollAccumRef.current = 0;
        lastScrollY.current = window.scrollY;
    }, [pathname]);

    // fade-in → visible: one frame at opacity 0, then ease in (no slide).
    useEffect(() => {
        if (chromeMode !== "fade-in") return;
        const id = requestAnimationFrame(() => setChromeModeSafe("visible"));
        return () => cancelAnimationFrame(id);
    }, [chromeMode]);

    // Scroll down: move with the page (1:1). Scroll up: fade in at the top (unchanged).
    useEffect(() => {
        const clampOffset = (offset: number) => {
            const maxHide = chromeWrapRef.current?.offsetHeight ?? 100;
            return Math.min(0, Math.max(-maxHide, offset));
        };

        const showChrome = () => {
            scrollAccumRef.current = 0;
            chromeOffsetRef.current = 0;
            setChromeOffset(0);
            setChromeModeSafe("visible");
        };

        lastScrollY.current = window.scrollY;
        if (menuOpen || window.scrollY <= 16) {
            showChrome();
        }

        const updateChrome = () => {
            const y = window.scrollY;
            const delta = y - lastScrollY.current;
            lastScrollY.current = y;

            if (menuOpen || y <= 16) {
                showChrome();
                return;
            }

            if (chromeModeRef.current === "fade-in") return;

            if (Math.abs(delta) < MIN_SCROLL_DELTA) return;

            if (delta > 0) {
                scrollAccumRef.current = 0;
                setChromeModeSafe("tracking");
                const next = clampOffset(chromeOffsetRef.current - delta);
                chromeOffsetRef.current = next;
                setChromeOffset(next);
                return;
            }

            if (delta < 0 && chromeOffsetRef.current < 0) {
                const maxHide = chromeWrapRef.current?.offsetHeight ?? 100;
                const fullyHidden = chromeOffsetRef.current <= -maxHide + 2;

                if (!fullyHidden) {
                    scrollAccumRef.current = 0;
                    setChromeModeSafe("tracking");
                    const next = clampOffset(chromeOffsetRef.current - delta);
                    chromeOffsetRef.current = next;
                    setChromeOffset(next);
                    if (next >= 0) {
                        setChromeModeSafe("visible");
                    }
                    return;
                }

                if (
                    (delta > 0 && scrollAccumRef.current < 0) ||
                    (delta < 0 && scrollAccumRef.current > 0)
                ) {
                    scrollAccumRef.current = delta;
                } else {
                    scrollAccumRef.current += delta;
                }

                if (scrollAccumRef.current <= -SHOW_SCROLL_ACCUM) {
                    scrollAccumRef.current = 0;
                    chromeOffsetRef.current = 0;
                    setChromeOffset(0);
                    setChromeModeSafe("fade-in");
                }
            }
        };

        const onScroll = () => {
            if (scrollRafRef.current) return;
            scrollRafRef.current = requestAnimationFrame(() => {
                scrollRafRef.current = 0;
                updateChrome();
            });
        };

        const onResize = () => {
            if (chromeModeRef.current !== "tracking") return;
            const next = clampOffset(chromeOffsetRef.current);
            chromeOffsetRef.current = next;
            setChromeOffset(next);
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            if (scrollRafRef.current) {
                cancelAnimationFrame(scrollRafRef.current);
            }
        };
    }, [menuOpen, pathname]);

    useEffect(() => {
        const onHashChange = () => setHash(window.location.hash);
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Close on Escape; on desktop, close when clicking outside the menu control
    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        const onPointer = (e: PointerEvent) => {
            const isMobile = window.matchMedia("(max-width: 767px)").matches;
            if (isMobile) return;
            if (!menuWrapRef.current) return;
            if (!menuWrapRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        window.addEventListener("keydown", onKey);
        window.addEventListener("pointerdown", onPointer);
        return () => {
            window.removeEventListener("keydown", onKey);
            window.removeEventListener("pointerdown", onPointer);
        };
    }, [menuOpen]);

    // Lock scroll while the mobile full-screen menu is open
    useEffect(() => {
        if (!menuOpen) return;
        const mq = window.matchMedia("(max-width: 767px)");
        if (!mq.matches) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = prev;
        };
    }, [menuOpen]);

    // White background: orange logo, black burger + menu text.
    // Dark/image/video: white logo + white burger. Beige preserves current theme.
    // Mobile menu open uses a white full-screen panel — match chrome to that.
    const menuTextColor = isOverWhiteBg ? "text-black" : "text-white";
    const chromeOverWhite = isOverWhiteBg || menuOpen;

    const chromeMotionClass =
        chromeMode === "fade-in"
            ? "opacity-0 transition-none"
            : chromeMode === "visible"
              ? "opacity-100 transition-opacity duration-[1000ms] ease-out motion-reduce:transition-none"
              : "opacity-100";

    const chromeTranslateY = chromeMode === "tracking" ? chromeOffset : 0;

    const chromeInteractive =
        chromeMode === "visible" ||
        chromeMode === "fade-in" ||
        chromeOffset > -40;

    return (
        <header
            ref={headerRef}
            className="fixed top-0 left-0 right-0 z-50 bg-transparent pointer-events-none"
        >
            <div
                ref={chromeWrapRef}
                className={`w-full px-[5.625vw] pt-[20px] md:pt-[25px] will-change-[transform,opacity] ${chromeMotionClass} ${
                    chromeInteractive ? "pointer-events-auto" : "pointer-events-none"
                } ${menuOpen ? "max-md:relative max-md:z-[60]" : ""}`}
                style={{
                    transform: `translate3d(0, ${chromeTranslateY}px, 0)`,
                }}
            >
                <nav
                    className="relative flex items-start justify-between"
                    aria-label="Main navigation"
                >
                    <LogoLink
                        isOverWhiteBg={chromeOverWhite}
                        onClick={() => setMenuOpen(false)}
                    />

                    <div ref={menuWrapRef} className="relative">
                        {/* Hamburger ↔ X toggle */}
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            className="relative z-[61] w-8 h-8 flex items-center justify-center cursor-pointer ml-auto"
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                        >
                            <ChromeBar
                                isOverWhiteBg={chromeOverWhite}
                                className={`transition-transform duration-300 ease-out motion-reduce:transition-none ${
                                    menuOpen
                                        ? "rotate-45"
                                        : "-translate-y-[7px]"
                                }`}
                            />
                            <ChromeBar
                                isOverWhiteBg={chromeOverWhite}
                                className={`transition-[transform,opacity] duration-300 ease-out motion-reduce:transition-none ${
                                    menuOpen ? "opacity-0" : "opacity-100"
                                }`}
                            />
                            <ChromeBar
                                isOverWhiteBg={chromeOverWhite}
                                className={`transition-transform duration-300 ease-out motion-reduce:transition-none ${
                                    menuOpen
                                        ? "-rotate-45"
                                        : "translate-y-[7px]"
                                }`}
                            />
                        </button>

                        <AnimatePresence>
                            {menuOpen && (
                                <motion.ul
                                    key="desktop-menu"
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{
                                        duration: 0.22,
                                        ease: [0.25, 0.4, 0.25, 1],
                                    }}
                                    className="absolute right-0 mt-[18px] hidden md:flex flex-col items-end gap-1 py-2"
                                >
                                    {navLinks.map((link, i) => {
                                        const active =
                                            link.href === "/#work"
                                                ? pathname === "/" && hash === "#work"
                                                : pathname === link.href ||
                                                  pathname?.startsWith(link.href + "/");
                                        return (
                                            <motion.li
                                                key={link.href}
                                                initial={{ opacity: 0, y: -6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{
                                                    duration: 0.28,
                                                    delay: 0.04 + i * 0.05,
                                                    ease: [0.25, 0.4, 0.25, 1],
                                                }}
                                            >
                                                <Link
                                                    href={link.href}
                                                    onClick={() => setMenuOpen(false)}
                                                    /* Transform on nested span keeps the Link hit box fixed so the
                                                       cursor stays “over” the item after the slide (no hover jitter). */
                                                    className={`group block py-1 leading-[1.15] tracking-[-0.01em] transition-colors duration-300 ease-out motion-reduce:transition-none hover:text-accent ${typeClass("shared.headerNavLink")} ${
                                                        active ? "text-accent" : menuTextColor
                                                    }`}
                                                >
                                                    <span className="inline-block origin-right transition-transform duration-300 ease-out motion-reduce:transition-none motion-safe:group-hover:-translate-x-[30px]">
                                                        {link.label}.
                                                    </span>
                                                </Link>
                                            </motion.li>
                                        );
                                    })}
                                </motion.ul>
                            )}
                        </AnimatePresence>
                    </div>
                </nav>
            </div>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.25,
                            ease: [0.25, 0.4, 0.25, 1],
                        }}
                        className="md:hidden fixed inset-0 z-[55] bg-white pointer-events-auto"
                        aria-hidden={false}
                    >
                        <nav
                            className="flex h-full flex-col items-end justify-center px-[5.625vw] pb-[10vh]"
                            aria-label="Mobile navigation"
                        >
                            <ul className="flex flex-col items-end gap-8">
                                {navLinks.map((link, i) => {
                                    const active =
                                        link.href === "/#work"
                                            ? pathname === "/" && hash === "#work"
                                            : pathname === link.href ||
                                              pathname?.startsWith(link.href + "/");
                                    return (
                                        <motion.li
                                            key={link.href}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.28,
                                                delay: 0.04 + i * 0.05,
                                                ease: [0.25, 0.4, 0.25, 1],
                                            }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setMenuOpen(false)}
                                                className={`block py-1 leading-[1.05] tracking-[-0.02em] transition-colors duration-300 ease-out motion-reduce:transition-none hover:text-accent ${typeClass("shared.headerMobileMenuLink")} ${
                                                    active
                                                        ? "text-accent"
                                                        : "text-black"
                                                }`}
                                            >
                                                {link.label}.
                                            </Link>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
