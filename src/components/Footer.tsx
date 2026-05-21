"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Container from "./Container";

const INSTAGRAM_ICON = "/images/Social Icons/Instagram/Negative.png";
const LINKEDIN_ICON = "/images/Social Icons/LinkedIn/Vector.png";

const ICON_W = 62;
const ICON_H = 59;

/** Figma @ 1920px */
const FOOTER_TEXT_CLASS =
    "text-[clamp(0.75rem,0.833vw,16px)] tracking-[0.04em]";
const FOOTER_ICON_CLASS = "h-[clamp(20px,1.5625vw,30px)] w-auto";
const FOOTER_ICON_GAP_CLASS = "gap-[clamp(14px,1.302vw,25px)]";

export default function Footer() {
    const pathname = usePathname();
    const path = (pathname ?? "").replace(/\/$/, "") || "/";

    const useSlimBar =
        path === "/" ||
        path === "/about" ||
        path.startsWith("/about/") ||
        path.endsWith("/about") ||
        path.startsWith("/work/") ||
        path === "/contact" ||
        path === "/insights" ||
        path.startsWith("/insights/");

    const slimBarBg = "bg-[#EAE4DD]";
    const slimBarSurface = "neutral";

    // Slim footer bar — beige on home/about/work/insights/contact
    if (useSlimBar) {
        return (
            <footer
                data-header-surface={slimBarSurface}
                className={`${slimBarBg} text-black`}
            >
                <div className="w-full px-[5.625vw]">
                    <div className="grid grid-cols-3 items-center py-[14px] md:py-[18px]">
                        <div
                            className={`flex items-center ${FOOTER_ICON_GAP_CLASS} justify-self-start`}
                        >
                            <SocialLink
                                href="https://www.instagram.com/tinyark/"
                                label="Instagram"
                                src={INSTAGRAM_ICON}
                            />
                            <SocialLink
                                href="https://www.linkedin.com/company/tiny-ark/"
                                label="LinkedIn"
                                src={LINKEDIN_ICON}
                            />
                        </div>

                        <p
                            className={`justify-self-center ${FOOTER_TEXT_CLASS} text-black/70`}
                        >
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
                    <div className={`flex items-center ${FOOTER_ICON_GAP_CLASS}`}>
                        <SocialLink
                            href="https://www.instagram.com/tinyark/"
                            label="Instagram"
                            src={INSTAGRAM_ICON}
                            light
                        />
                        <SocialLink
                            href="https://www.linkedin.com/company/tiny-ark/"
                            label="LinkedIn"
                            src={LINKEDIN_ICON}
                            light
                        />
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
                    <p className={`${FOOTER_TEXT_CLASS} text-text-tertiary`}>
                        © {new Date().getFullYear()} TINY ARK.
                    </p>
                </div>
            </Container>
        </footer>
    );
}

function SocialLink({
    href,
    label,
    src,
    light = false,
}: {
    href: string;
    label: string;
    src: string;
    /** Invert for dark footer backgrounds */
    light?: boolean;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="inline-flex opacity-100 hover:opacity-60 transition-opacity duration-200"
        >
            <Image
                src={src}
                alt=""
                width={ICON_W}
                height={ICON_H}
                className={`${FOOTER_ICON_CLASS} ${light ? "brightness-0 invert" : ""}`}
                aria-hidden
            />
        </a>
    );
}
