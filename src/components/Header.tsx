"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Container from "./Container";

const navLinks = [
    { href: "/work", label: "Work" },
    { href: "/case-studies", label: "Case Studies" },
    { href: "/about", label: "About" },
];

export default function Header() {
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const { scrollY } = useScroll();

    // Smooth resize from large to smaller
    const [winSize, setWinSize] = useState({ w: 0, h: 0 });

    useEffect(() => {
        setWinSize({ w: window.innerWidth, h: window.innerHeight });
        const handleResize = () => setWinSize({ w: window.innerWidth, h: window.innerHeight });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isHome = pathname === "/";
    // For SSR and initial mount, we need a stable state. 
    // We'll use the resolved window size if available, otherwise default to a 1440p desktop size to minimize jump.
    const activeW = winSize.w || 1440;
    const activeH = winSize.h || 900;
    const canAnimate = isHome; // We can animate based on scroll regardless of winSize being fully stable, using defaults.

    // 1. Calculate Target Scale (30% bigger than previous maxScale of 4)
    const maxScale = activeW > 768 ? 7.3 : 2.6;
    const endScale = 1;

    // 2. Calculate Distances
    const logoBaseWidth = activeW >= 768 ? 240 : 180;

    // Header offset: header is 72px, logo has mt-6(24px). Approx target center is ~48px.
    const headerOffset = 48;

    // startY: place it so it sits naturally at the bottom
    // Scaled height is logoBaseHeight * maxScale. We want the bottom of that to be near activeH.
    const logoBaseHeight = winSize.w >= 768 ? 50 : 40;
    const startY = activeH - headerOffset - (logoBaseHeight * maxScale / 2) - 40;

    // Define the scroll range to be exactly startY to achieve 1:1 speed
    const scrollEnd = startY;

    // 3. Create Transforms
    // y moves from startY to 0 over scrollEnd scroll (1:1 speed)
    const y = useTransform(scrollY, [0, scrollEnd], [startY, 0]);
    // x is 0 because we are left-aligned and originX is 0
    const x = useTransform(scrollY, [0, scrollEnd], [0, 0]);

    // Scale: only start shrinking after 2/3 of the way up 
    const scale = useTransform(scrollY, [0, scrollEnd * 0.66, scrollEnd], [maxScale, maxScale, endScale]);

    // Opacity: Outline stays 100% visible till it starts to fade out near the top
    // Solid fades in to take over the look
    const outlineOpacity = useTransform(scrollY, [scrollEnd * 0.6, scrollEnd * 0.9], [1, 0]);
    const solidOpacity = useTransform(scrollY, [scrollEnd * 0.7, scrollEnd], [0, 1]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [pathname]);

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300"
        >
            <Container>
                <nav
                    className="relative flex items-center justify-between h-[72px]"
                    aria-label="Main navigation"
                >
                    {/* Logo Wrapper */}
                    <div className="relative z-10 flex items-center mt-6 group">
                        <Link href="/" className="outline-none" aria-label="Home">
                            <motion.div
                                style={{
                                    scale: isHome ? scale : endScale,
                                    x: isHome ? x : 0,
                                    y: isHome ? y : 0,
                                    originX: 0,
                                    originY: 0.5,
                                }}
                                className="relative w-[180px] md:w-[240px] h-[40px] md:h-[50px]"
                            >
                                {/* Outline Logo - Visible at bottom-center start */}
                                {isHome && (
                                    <motion.div
                                        style={{ opacity: outlineOpacity }}
                                        className="absolute inset-0 w-full h-full"
                                    >
                                        <img
                                            src="/images/logo/Tiny_Ark_Logo_Outline_White_2.png"
                                            alt="Tiny Ark Outline Logo"
                                            className="w-full h-full object-contain object-left"
                                        />
                                    </motion.div>
                                )}

                                {/* Solid Logo - Fades in as it moves to header */}
                                <motion.div
                                    className="absolute inset-0 w-full h-full"
                                    style={{ opacity: isHome ? solidOpacity : 1 }}
                                >
                                    <div
                                        className="w-full h-full bg-white group-hover:bg-accent transition-colors duration-300"
                                        style={{
                                            WebkitMaskImage: 'url("https://freight.cargo.site/t/original/i/6a564d8a7a90efebfd12324f6804cfd6346e525d965fa323e5e0dba24e71b8cf/Tiny_Ark_Logo_White.png")',
                                            WebkitMaskSize: 'contain',
                                            WebkitMaskRepeat: 'no-repeat',
                                            WebkitMaskPosition: 'left center',
                                            maskImage: 'url("https://freight.cargo.site/t/original/i/6a564d8a7a90efebfd12324f6804cfd6346e525d965fa323e5e0dba24e71b8cf/Tiny_Ark_Logo_White.png")',
                                            maskSize: 'contain',
                                            maskRepeat: 'no-repeat',
                                            maskPosition: 'left center',
                                        }}
                                    />
                                </motion.div>
                            </motion.div>
                        </Link>
                    </div>

                    {/* Center Nav - Desktop */}
                    <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-0 items-center gap-6 group/nav">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={`text-[18px] font-bold tracking-wide transition-colors hover:text-accent ${pathname === link.href || pathname.startsWith(link.href + "/")
                                    ? "text-accent"
                                    : "text-white"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Contact - Desktop */}
                    <Link
                        href="/contact"
                        className="hidden md:block text-[18px] font-bold tracking-wide text-white hover:text-accent transition-colors"
                    >
                        Contact
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5"
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                    >
                        <span
                            className={`w-6 h-[2px] bg-text-primary transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[5px]" : ""
                                }`}
                        />
                        <span
                            className={`w-6 h-[2px] bg-text-primary transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""
                                }`}
                        />
                        <span
                            className={`w-6 h-[2px] bg-text-primary transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[5px]" : ""
                                }`}
                        />
                    </button>
                </nav>
            </Container>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.4, 0.25, 1] }}
                        className="md:hidden bg-bg/95 backdrop-blur-xl border-b border-border overflow-hidden"
                    >
                        <Container className="py-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`text-2xl font-medium transition-colors ${pathname === link.href
                                        ? "text-text-primary"
                                        : "text-text-secondary"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href="/contact"
                                className="text-2xl font-medium text-text-secondary hover:text-text-primary transition-colors"
                            >
                                Contact
                            </Link>
                        </Container>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
