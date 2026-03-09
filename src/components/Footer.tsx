import Link from "next/link";
import Container from "./Container";

const footerLinks = {
    sitemap: [
        { href: "/", label: "Home" },
        { href: "/work", label: "Work" },
        { href: "/about", label: "About" },
        { href: "/case-studies", label: "Case Studies" },
    ],
    studio: [
        { href: "/contact", label: "Contact" },
        { href: "/about", label: "Studio" },
    ],
    social: [
        { href: "https://instagram.com", label: "Instagram" },
        { href: "https://linkedin.com", label: "LinkedIn" },
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

                    {/* Large Footer Logo & Copyright */}
                    <div className=" border-border pt-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-0 -mb-20">
                        <div
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
                            className="w-[540px] md:w-[500px] h-[120px] md:h-[150px] bg-text-primary/100 -mb-2 max-w-full relative -left-2"
                        />
                        <p className="text-[18px] text-text-tertiary md:pb-3 mb-[9px]">
                            © {new Date().getFullYear()} Tiny Ark. All rights reserved.
                        </p>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
