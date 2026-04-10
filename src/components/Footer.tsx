import Link from "next/link";
import Container from "./Container";

const footerLinks = {
    sitemap: [
        { href: "/", label: "Home" },
        { href: "/work", label: "Work" },
        { href: "/about", label: "About" },
        { href: "/insights", label: "Insights" },
    ],
    studio: [
        { href: "/contact", label: "Contact" },
        { href: "/about", label: "Studio" },
    ],
    social: [
        { href: "https://www.instagram.com/tinyark/", label: "Instagram" },
        { href: "https://www.linkedin.com/company/tiny-ark/", label: "LinkedIn" },
    ],
};

export default function Footer() {
    return (
        <footer className="mt-16 lg:mt-24">
            <Container>
                <div className="border-t border-border py-16 lg:py-24">
                    {/* Links Grid */}
                    <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-4 -mt-20 mb-24">
                        {/* Sitemap (Left) */}
                        <div className="md:w-1/3 flex justify-start">
                            <div className="text-left">
                                <h3 className="text-ss font-bold tracking-[0.15em] text-text-tertiary mb-2 text-white">
                                    Sitemap
                                </h3>
                                <ul className="space-y-0">
                                    {footerLinks.sitemap.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="text-[18px] leading-[0.2] tracking-[-0.02em] text-text-secondary hover:text-accent transition-colors text-white/70"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Studio (Center) */}
                        <div className="md:w-1/3 flex justify-start md:justify-center">
                            <div className="text-left">
                                <h3 className="text-s font-bold tracking-[0.15em] text-text-tertiary mb-2 text-white">
                                    Studio
                                </h3>
                                <ul className="space-y-0">
                                    {footerLinks.studio.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                href={link.href}
                                                className="text-[18px] leading-[0.2] tracking-[-0.02em] text-text-secondary hover:text-accent transition-colors text-white/70"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Social (Right) */}
                        <div className="md:w-1/3 flex justify-start md:justify-end">
                            <div className="text-left">
                                <h3 className="text-s font-bold tracking-[0.15em] text-text-tertiary mb-2 text-white">
                                    Social
                                </h3>
                                <ul className="space-y-0">
                                    {footerLinks.social.map((link) => (
                                        <li key={link.label}>
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[18px] leading-[0.2] tracking-[-0.02em] text-text-secondary hover:text-accent transition-colors text-white/70"
                                            >
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Copyright */}
                    <div className="pt-12 flex justify-start md:justify-end -mb-20">
                        <p className="text-[18px] text-text-tertiary mb-[9px]">
                            © {new Date().getFullYear()} Tiny Ark. All rights reserved.
                        </p>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
