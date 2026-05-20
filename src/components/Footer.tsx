"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./Container";

export default function Footer() {
    const pathname = usePathname();
    const path = (pathname ?? "").replace(/\/$/, "") || "/";

    const useSlimBar =
        path === "/" ||
        path === "/about" ||
        path.startsWith("/about/") ||
        path.endsWith("/about") ||
        path.startsWith("/work/") ||
        path === "/contact";

    const slimBarBg = path === "/contact" ? "bg-white" : "bg-[#EAE4DD]";
    const slimBarSurface = path === "/contact" ? "white" : "neutral";

    // Slim footer bar — beige on home/about/work; white on contact
    if (useSlimBar) {
        return (
            <footer
                data-header-surface={slimBarSurface}
                className={`${slimBarBg} text-black`}
            >
                <div className="w-full px-[5.625vw]">
                    <div className="grid grid-cols-3 items-center py-[14px] md:py-[18px]">
                        {/* Social icons (left) */}
                        <div className="flex items-center gap-[10px] justify-self-start">
                            <a
                                href="https://www.instagram.com/tinyark/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                                className="text-black hover:text-accent transition-colors"
                            >
                                <InstagramIcon />
                            </a>
                            <a
                                href="https://www.linkedin.com/company/tiny-ark/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="text-black hover:text-accent transition-colors"
                            >
                                <LinkedInIcon />
                            </a>
                        </div>

                        {/* Copyright (centered) */}
                        <p className="justify-self-center text-[11px] md:text-[12px] tracking-[0.04em] text-black/70">
                            © {new Date().getFullYear()} TINY ARK.
                        </p>

                        <div className="justify-self-end" aria-hidden="true" />
                    </div>
                </div>
            </footer>
        );
    }

    // Default (dark) footer used on inner pages
    return (
        <footer className="mt-16 lg:mt-24 bg-bg text-text-secondary">
            <Container>
                <div className="border-t border-border py-10 lg:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <a
                            href="https://www.instagram.com/tinyark/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="text-white hover:text-accent transition-colors"
                        >
                            <InstagramIcon />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/tiny-ark/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="text-white hover:text-accent transition-colors"
                        >
                            <LinkedInIcon />
                        </a>
                    </div>
                    <nav className="flex flex-wrap items-center gap-6 text-[15px]">
                        <Link href="/#work" className="hover:text-white transition-colors">
                            Work
                        </Link>
                        <Link href="/about" className="hover:text-white transition-colors">
                            About
                        </Link>
                        <Link href="/insights" className="hover:text-white transition-colors">
                            Insights
                        </Link>
                    </nav>
                    <p className="text-[12px] tracking-[0.06em] text-text-tertiary">
                        © {new Date().getFullYear()} TINY ARK.
                    </p>
                </div>
            </Container>
        </footer>
    );
}

function InstagramIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    );
}

function LinkedInIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    );
}
