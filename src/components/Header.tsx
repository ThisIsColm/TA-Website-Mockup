"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { href: "/", label: "Home" },
    /** Project grid lives on the homepage — menu scrolls to this anchor */
    { href: "/#work", label: "Work" },
    { href: "/about", label: "About" },
    { href: "/insights", label: "Insights" },
    { href: "/contact", label: "Contact" },
];

export default function Header() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [hash, setHash] = useState("");

    useEffect(() => {
        setHash(typeof window !== "undefined" ? window.location.hash : "");
    }, [pathname]);

    useEffect(() => {
        const onHashChange = () => setHash(window.location.hash);
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (menuOpen) {
            const original = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = original;
            };
        }
    }, [menuOpen]);

    // Light pages: orange logo asset. All other pages: white logo on dark/image heroes.
    const lightBgRoutes = ["/about", "/contact"];
    const isOverLightBg = !!pathname && lightBgRoutes.some((r) => pathname === r || pathname.startsWith(r + "/"));
    const bar = isOverLightBg ? "bg-black" : "bg-white";
    const headerLogoSrc = isOverLightBg
        ? "/images/TA_Logo_2026_Orange.png"
        : "/images/TA_Logo_2026.png";

    return (
        <>
            <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
                <div className="w-full px-[5.625vw] pt-[20px] md:pt-[25px]">
                    <nav
                        className="relative flex items-center justify-between"
                        aria-label="Main navigation"
                    >
                        {/* Logo */}
                        <Link
                            href="/"
                            className="relative z-10 inline-flex items-center"
                            aria-label="Tiny Ark home"
                        >
                            <img
                                src={headerLogoSrc}
                                alt="Tiny Ark"
                                style={{ height: "auto", width: "120px" }}
                            />
                        </Link>

                        {/* Hamburger Menu Button */}
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="relative z-10 w-8 h-8 flex flex-col items-center justify-center gap-[5px] cursor-pointer"
                            aria-label="Open menu"
                            aria-expanded={menuOpen}
                        >
                            <span className={`w-6 h-[2px] ${bar} transition-colors`} />
                            <span className={`w-6 h-[2px] ${bar} transition-colors`} />
                            <span className={`w-6 h-[2px] ${bar} transition-colors`} />
                        </button>
                    </nav>
                </div>
            </header>

            {/* Full-screen Menu Overlay */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
                        className="fixed inset-0 z-[100] bg-black text-white"
                    >
                        <div className="w-full px-[5.625vw] pt-[20px] md:pt-[50px]">
                            <div className="flex items-center justify-between">
                                <Link
                                    href="/"
                                    onClick={() => setMenuOpen(false)}
                                    className="inline-flex items-center"
                                    aria-label="Tiny Ark home"
                                >
                                    <img
                                        src="/images/TA_Logo_2026.png"
                                        alt="Tiny Ark"
                                        style={{ height: "auto", width: "120px" }}
                                    />
                                </Link>
                                <button
                                    onClick={() => setMenuOpen(false)}
                                    className="relative w-8 h-8 flex items-center justify-center cursor-pointer"
                                    aria-label="Close menu"
                                >
                                    <span className="absolute w-6 h-[2px] bg-white rotate-45" />
                                    <span className="absolute w-6 h-[2px] bg-white -rotate-45" />
                                </button>
                            </div>
                        </div>

                        <div className="w-full px-[5.625vw] mt-16 md:mt-24">
                            <ul className="flex flex-col gap-3 md:gap-5">
                                {navLinks.map((link, i) => {
                                    const active =
                                        link.href === "/#work"
                                            ? pathname === "/" && hash === "#work"
                                            : link.href === "/"
                                              ? pathname === "/" && hash !== "#work"
                                              : pathname === link.href ||
                                                (link.href !== "/" &&
                                                    link.href !== "/#work" &&
                                                    pathname?.startsWith(link.href + "/"));
                                    return (
                                        <motion.li
                                            key={link.href}
                                            initial={{ opacity: 0, y: 24 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                duration: 0.5,
                                                delay: 0.12 + i * 0.06,
                                                ease: [0.25, 0.4, 0.25, 1],
                                            }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setMenuOpen(false)}
                                                className={`block text-[clamp(2.5rem,7vw,5.5rem)] font-black tracking-[-0.03em] leading-[1.05] uppercase transition-colors ${
                                                    active
                                                        ? "text-accent"
                                                        : "text-white hover:text-accent"
                                                }`}
                                            >
                                                {link.label}
                                            </Link>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
