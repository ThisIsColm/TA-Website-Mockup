"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// "Home" is reached via the logo; menu lists Work / About / Insights to match the design.
const navLinks = [
    /** Project grid lives on the homepage — menu scrolls to this anchor */
    { href: "/#work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/insights", label: "Insights" },
    { href: "/about#contact", label: "Contact" },
];

const LOGO_WHITE = "/images/TA_Logo_2026.png";
const LOGO_ORANGE = "/images/TA_Logo_2026_Orange.png";

function LogoLink({
    defaultSrc,
    hoverSrc,
    hoverClassName = "",
    className = "",
    onClick,
}: {
    defaultSrc: string;
    hoverSrc: string;
    hoverClassName?: string;
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
                <img
                    src={defaultSrc}
                    alt=""
                    className="block h-auto w-full transition-opacity duration-300 ease-out group-hover:opacity-0"
                />
                <img
                    src={hoverSrc}
                    alt="Tiny Ark"
                    className={`absolute inset-0 block h-auto w-full opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100 ${hoverClassName}`}
                />
            </span>
        </Link>
    );
}

export default function Header() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [hash, setHash] = useState("");
    const menuWrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setHash(typeof window !== "undefined" ? window.location.hash : "");
    }, [pathname]);

    useEffect(() => {
        const onHashChange = () => setHash(window.location.hash);
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    // Close menu on route change
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Close on Escape, and on outside click
    useEffect(() => {
        if (!menuOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setMenuOpen(false);
        };
        const onPointer = (e: PointerEvent) => {
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

    // Light pages: orange logo asset, black icon + black menu text.
    // All other pages: white logo on dark/image heroes, white icon + white menu text.
    const lightBgRoutes = ["/about", "/insights"];
    const isOverLightBg =
        !!pathname &&
        lightBgRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));
    const bar = isOverLightBg ? "bg-black" : "bg-white";
    const headerLogoDefault = isOverLightBg ? LOGO_ORANGE : LOGO_WHITE;
    const headerLogoHover = isOverLightBg ? LOGO_WHITE : LOGO_ORANGE;
    const menuTextColor = isOverLightBg ? "text-black" : "text-white";

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
            <div className="w-full px-[5.625vw] pt-[20px] md:pt-[25px]">
                <nav
                    className="relative flex items-start justify-between"
                    aria-label="Main navigation"
                >
                    <LogoLink
                        defaultSrc={headerLogoDefault}
                        hoverSrc={headerLogoHover}
                        hoverClassName={isOverLightBg ? "brightness-0" : ""}
                    />

                    <div ref={menuWrapRef} className="relative z-10">
                        {/* Hamburger ↔ X toggle */}
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            className="relative w-8 h-8 flex items-center justify-center cursor-pointer ml-auto"
                            aria-label={menuOpen ? "Close menu" : "Open menu"}
                            aria-expanded={menuOpen}
                        >
                            <span
                                className={`absolute block w-6 h-[2px] ${bar} transition-transform duration-300 ease-out ${
                                    menuOpen
                                        ? "rotate-45"
                                        : "-translate-y-[7px]"
                                }`}
                            />
                            <span
                                className={`absolute block w-6 h-[2px] ${bar} transition-opacity duration-200 ease-out ${
                                    menuOpen ? "opacity-0" : "opacity-100"
                                }`}
                            />
                            <span
                                className={`absolute block w-6 h-[2px] ${bar} transition-transform duration-300 ease-out ${
                                    menuOpen
                                        ? "-rotate-45"
                                        : "translate-y-[7px]"
                                }`}
                            />
                        </button>

                        {/* Drop-down menu — right-aligned to the X, no overlay */}
                        <AnimatePresence>
                            {menuOpen && (
                                <motion.ul
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{
                                        duration: 0.22,
                                        ease: [0.25, 0.4, 0.25, 1],
                                    }}
                                    className="absolute right-0 mt-[18px] flex flex-col items-end gap-[2px]"
                                >
                                    {navLinks.map((link, i) => {
                                        const active =
                                            link.href === "/#work"
                                                ? pathname === "/" && hash === "#work"
                                                : link.href === "/about#contact"
                                                  ? pathname === "/about" && hash === "#contact"
                                                  : link.href === "/about"
                                                    ? pathname === "/about" && hash !== "#contact"
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
                                                    className={`block leading-[1.15] tracking-[-0.01em] transition-[color,transform] duration-150 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:-translate-x-[30px] hover:text-accent ${
                                                        active ? "text-accent" : menuTextColor
                                                    }`}
                                                    style={{
                                                        fontFamily: "Tenon, sans-serif",
                                                        fontSize: "clamp(1.25rem, 1.6vw, 30px)",
                                                        fontWeight: 800,
                                                    }}
                                                >
                                                    {link.label}.
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
        </header>
    );
}
