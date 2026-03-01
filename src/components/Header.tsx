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

    // Smooth resize from large (1) to smaller (0.6)
    // The animation starts when we scroll (e.g., from 400 to 800px)
    const logoScale = useTransform(scrollY, [400, 800], [1.5, 0.6]);
    const logoY = useTransform(scrollY, [400, 800], [0, -15]); // Move it higher when shrunk

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
            <Container className="px-4 md:px-8 lg:px-10">
                <nav
                    className="relative flex items-center justify-between h-[72px]"
                    aria-label="Main navigation"
                >
                    {/* Logo */}
                    <Link
                        href="/"
                        className="relative z-10 flex items-center mt-6 group"
                    >
                        <motion.div
                            style={{
                                scale: pathname === "/" ? logoScale : 0.6,
                                y: pathname === "/" ? logoY : -15,
                                originX: 0,
                                originY: 0.5,
                                WebkitMaskImage: 'url("https://freight.cargo.site/t/original/i/6a564d8a7a90efebfd12324f6804cfd6346e525d965fa323e5e0dba24e71b8cf/Tiny_Ark_Logo_White.png")',
                                WebkitMaskSize: 'contain',
                                WebkitMaskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'left center',
                                maskImage: 'url("https://freight.cargo.site/t/original/i/6a564d8a7a90efebfd12324f6804cfd6346e525d965fa323e5e0dba24e71b8cf/Tiny_Ark_Logo_White.png")',
                                maskSize: 'contain',
                                maskRepeat: 'no-repeat',
                                maskPosition: 'left center',
                            }}
                            className="relative w-[180px] md:w-[240px] h-[40px] md:h-[50px] bg-white group-hover:bg-accent transition-colors duration-300"
                        />
                    </Link>

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
