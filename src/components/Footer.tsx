import Link from "next/link";
import Container from "./Container";

const footerLinks = {
    sitemap: [
        { href: "/", label: "Home" },
        { href: "/work", label: "Work" },
        { href: "/about", label: "About" },
        { href: "/blog", label: "Case Studies" },
    ],
    studio: [
        { href: "/about#contact", label: "Contact" },
        { href: "/about", label: "Studio" },
    ],
    social: [
        { href: "https://twitter.com", label: "Twitter / X" },
        { href: "https://dribbble.com", label: "Dribbble" },
        { href: "https://instagram.com", label: "Instagram" },
        { href: "https://linkedin.com", label: "LinkedIn" },
    ],
};

export default function Footer() {
    return (
        <footer className="border-t border-border mt-section-sm lg:mt-section">
            <Container className="py-16 lg:py-24">
                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-20">
                    {/* Sitemap */}
                    <div>
                        <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-5">
                            Sitemap
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.sitemap.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-[15px] text-text-secondary hover:text-accent transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Studio */}
                    <div>
                        <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-5">
                            Studio
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.studio.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-[15px] text-text-secondary hover:text-accent transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Social */}
                    <div className="col-span-2 md:col-span-1">
                        <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-5">
                            Social
                        </h3>
                        <ul className="space-y-3">
                            {footerLinks.social.map((link) => (
                                <li key={link.label}>
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[15px] text-text-secondary hover:text-accent transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Large Footer Logo */}
                <div className="border-t border-border pt-12">
                    <p className="text-[clamp(3rem,10vw,8rem)] font-semibold tracking-[-0.04em] leading-none text-text-primary/10">
                        Tiny Ark
                    </p>
                    <p className="text-xs text-text-tertiary mt-6">
                        © {new Date().getFullYear()} Tiny Ark. All rights reserved.
                    </p>
                </div>
            </Container>
        </footer>
    );
}
