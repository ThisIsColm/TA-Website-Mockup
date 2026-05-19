import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import RotatingTagline from "./RotatingTagline";
import TeamCard, { type TeamCardProps } from "./TeamCard";

export const metadata: Metadata = {
    title: "About",
    description:
        "Tiny Ark is an independent creative production company based in Dublin, collaborating globally with brands and cultural institutions.",
    openGraph: {
        title: "About — Tiny Ark",
        description:
            "An independent creative production company based in Dublin, collaborating globally with brands and cultural institutions.",
    },
};

const SERVICES = [
    "Concept Development",
    "Research",
    "Production MGMT",
    "Travel Coordination",
    "Remote & Live Editing",
    "Motion Design",
];

/**
 * Team grid:
 * - Each member can supply `photoPrefix` (auto-builds `${prefix}_001/002/003.jpg`)
 *   or `photos` for explicit overrides. Photos are 2:3 portrait (4000×6000).
 * - Members without photos render an empty placeholder slot.
 */
const TEAM: TeamCardProps[] = [
    { nameLabel: "Nathan Reilly", role: "CEO" },
    { nameLabel: "Gabi Chrobak", role: "Head of Production" },
    { nameLabel: "Mark O'Brien", role: "Creative Director", photoPrefix: "Mark" },
    { nameLabel: "Eilis Doherty", role: "Creative Director", photoPrefix: "Eilis" },
    {
        nameLabel: "Leon Forristal",
        role: "Director of Photography",
        photoPrefix: "Leon",
    },
    { nameLabel: "Blaine Tennick", role: "Technical Director" },
    {
        nameLabel: "Colm Moore",
        role: "Head of Post Production",
        photoPrefix: "Colm",
    },
    { nameLabel: "Rory Bradley", role: "Senior Editor", photoPrefix: "Rory" },
    {
        nameLabel: "Beatriz Gonçalves",
        role: "Senior Motion Designer",
        photoPrefix: "Bea",
    },
    { nameLabel: "Kate Brady", role: "Producer", photoPrefix: "Kate" },
    {
        nameLabel: "Rosie Spearing",
        role: "Assistant Producer",
        photoPrefix: "Rosie",
    },
    {
        // Note: third frame file is `AJ_003.jpg` (uppercase) — use explicit list.
        nameLabel: "Alex James",
        role: "CTO",
        photos: [
            "/images/team/Aj_001.jpg",
            "/images/team/Aj_002.jpg",
            "/images/team/AJ_003.jpg",
        ],
    },
];

const BEIGE = "#EAE4DD";

export default function AboutPage() {
    return (
        <div className="bg-white text-black">
            {/* ── Hero statement (right-aligned, cols 3–6) ───────────── */}
            <section
                data-header-surface="white"
                className="pt-[140px] md:pt-[180px] pb-[80px] md:pb-[120px]"
            >
                <Container>
                    <div className="grid grid-cols-6 gap-[5px]">
                        <div className="col-span-6 md:col-start-3 md:col-span-4 @container">
                            <h1
                                className="font-bold text-black"
                                style={{
                                    fontFamily: "Tenon, sans-serif",
                                    fontSize: "max(1.8rem, 3.35cqw)",
                                    letterSpacing: "-0.01em",
                                    lineHeight: 1.18,
                                    fontWeight: 700,
                                }}
                            >
                                We are Tiny Ark &mdash; an independent <br></br>creative production
                                company.
                            </h1>
                            <div
                                className="mt-[28px] md:mt-[80px] w-full space-y-[20px] md:space-y-[24px] text-black"
                                style={{
                                    fontFamily: "Tenon, sans-serif",
                                    fontSize: "max(0.95rem, 3.3cqw)",
                                    lineHeight: 1.5,
                                    fontWeight: 400,
                                }}
                            >
                                <p>
                                    We&rsquo;re a team of directors, producers,
                                    cinematographers, editors, designers, animators and
                                    VFX artists. Whether it&rsquo;s content for live
                                    broadcast, commercial or for socials, we&rsquo;ve got
                                    the creative and production chops you need, all under
                                    one roof.
                                </p>
                                <p>
                                    We&rsquo;ve shot all over the world, and are no
                                    strangers to launching a production on a tight
                                    timeline. We aim to create long-lasting creative
                                    production partnerships and are fully transparent
                                    about where your budget is going.
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ── Services / Capabilities (beige band) ───────────────── */}
            <section
                data-header-surface="neutral"
                style={{ backgroundColor: BEIGE }}
                className="pt-[60px] md:pt-[80px] pb-[60px] md:pb-[100px]"
            >
                <Container>
                    <div className="grid grid-cols-6 gap-[5px] items-start">
                        <div className="col-span-6 md:col-span-3 @container">
                            <RotatingTagline />
                        </div>

                        <div
                            data-header-surface="white"
                            className="col-span-6 md:col-span-3 @container bg-white p-[24px] md:p-[32px] flex flex-col gap-[24px]"
                        >
                            <div className="min-w-0 w-full overflow-x-auto [scrollbar-width:thin]">
                                <p
                                    className="text-black whitespace-nowrap"
                                    style={{
                                        fontFamily: "Tenon, sans-serif",
                                        fontSize: "clamp(0.85rem, 3cqw, 1.875rem)",
                                        lineHeight: 1.5,
                                        fontWeight: 400,
                                    }}
                                >
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                    sed do eiusmod tempor incididunt ut labore et dolore
                                    magna aliqua. Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco.
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-x-[5px] gap-y-[8px]">
                                {SERVICES.map((s) => (
                                    <div key={s} className="min-w-0">
                                        <ServicePill label={s} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ── Our people (team grid) ─────────────────────────────── */}
            <section
                data-header-surface="white"
                className="bg-white pt-[60px] md:pt-[80px] pb-[40px] md:pb-[60px]"
            >
                <Container>
                    <SectionHeading>Our people</SectionHeading>
                    <div
                        data-header-surface="dark"
                        className="mt-[24px] md:mt-[32px] grid grid-cols-2 md:grid-cols-6 gap-x-[5px] gap-y-[50px] md:gap-y-[60px]"
                    >
                        {TEAM.map((m, i) => (
                            <TeamCard key={i} {...m} />
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── People we work with (client logos) ─────────────────── */}
            <section
                data-header-surface="white"
                className="bg-white pt-[40px] md:pt-[60px] pb-[60px] md:pb-[100px]"
            >
                <Container>
                    <SectionHeading>People we work with</SectionHeading>
                    <div className="mt-[24px] md:mt-[32px] relative w-full">
                        <Image
                            src="/images/Client_Logos.png"
                            alt="Brands and clients Tiny Ark has worked with"
                            width={1200}
                            height={300}
                            className="w-full h-auto"
                            sizes="(max-width: 768px) 100vw, 80vw"
                        />
                    </div>
                </Container>
            </section>

            {/* ── Let's work together (image + contact details) ──────── */}
            <section
                id="contact"
                data-header-surface="white"
                className="scroll-mt-[100px] bg-white pt-[40px] md:pt-[60px] pb-[100px] md:pb-[140px]"
            >
                <Container>
                    {/* Use a 12-col grid so the image can span 3.5 of the page's 6 cols (= 7/12). */}
                    <div className="grid grid-cols-6 md:grid-cols-12 gap-[5px] items-start md:items-center">
                        <div className="col-span-6 md:col-span-7">
                            {/* Source image is 5524 × 3107 (~16:9) — preserve native ratio */}
                            <div
                                data-header-surface="dark"
                                className="relative w-full aspect-[5524/3107] overflow-hidden bg-[#D7CFC2]"
                            >
                                <Image
                                    src="/images/contact/fontaines.jpg"
                                    alt="Tiny Ark production still"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 58vw"
                                />
                            </div>
                        </div>

                        <div className="col-span-6 md:col-span-4 md:col-start-9 pt-[40px] md:pt-0">
                            <h2
                                className="text-black"
                                style={{
                                    fontFamily: "Tenon, sans-serif",
                                    fontSize: "clamp(2.5rem, 2.5vw, 4rem)",
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1.1,
                                    fontWeight: 900,
                                }}
                            >
                                Let&rsquo;s work together.
                            </h2>

                            <div className="mt-[32px] md:mt-[40px] space-y-[28px]">
                                <ContactPerson
                                    name="Nathan Reilly"
                                    title="CEO"
                                    email="nathan@tinyark.com"
                                    phone="+353 (87) 993 2195"
                                />
                                <ContactPerson
                                    name="Gabi Chrobak"
                                    title="Head of Production"
                                    email="gabi@tinyark.com"
                                />
                                <address
                                    className="not-italic text-black"
                                    style={{
                                        fontFamily: "Tenon, sans-serif",
                                        fontSize: "clamp(1rem, 1.1vw, 18px)",
                                        lineHeight: 1.55,
                                    }}
                                >
                                    43 Talbot St
                                    <br />
                                    Mountjoy
                                    <br />
                                    Dublin 1
                                    <br />
                                    D01 KOE8
                                </address>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </div>
    );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <h2
            className="text-black"
            style={{
                fontFamily: "Tenon, sans-serif",
                fontSize: "clamp(1.5rem, 1.875vw, 36px)",
                fontWeight: 400,
                fontStyle: "normal",
                lineHeight: "46px",
                letterSpacing: "-0.02em",
            }}
        >
            {children}
        </h2>
    );
}

function ServicePill({ label }: { label: string }) {
    return (
        <div
            className="flex w-full min-w-0 flex-nowrap items-center justify-start gap-[0.35em] overflow-hidden rounded-full border border-accent px-[0.65em] py-[0.32em] text-accent"
            style={{
                fontFamily: "Tenon, sans-serif",
                fontSize: "clamp(0.65rem, 2.75cqw, 1.375rem)",
                fontWeight: 500,
                lineHeight: 1.2,
            }}
        >
            <span
                aria-hidden="true"
                className="inline-block shrink-0 rounded-full bg-accent"
                style={{
                    width: "0.32em",
                    height: "0.32em",
                }}
            />
            {/* Single line — ellipsis only if label is wider than pill */}
            <span className="min-w-0 flex-1 truncate">{label}</span>
        </div>
    );
}

function ContactPerson({
    name,
    title,
    email,
    phone,
}: {
    name: string;
    title: string;
    email: string;
    phone?: string;
}) {
    return (
        <div>
            <p
                style={{
                    fontFamily: "Tenon, sans-serif",
                    fontSize: "clamp(1.1rem, 1.25vw, 22px)",
                    fontWeight: 700,
                    color: "#000",
                    lineHeight: 1.15,
                }}
            >
                {name}
            </p>
            <p
                style={{
                    fontFamily: "Tenon, sans-serif",
                    fontSize: "clamp(0.85rem, 0.95vw, 15px)",
                    color: "rgba(0,0,0,0.55)",
                    marginTop: "4px",
                }}
            >
                {title}
            </p>
            <a
                href={`mailto:${email}`}
                className="block mt-[8px] text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                style={{
                    fontFamily: "Tenon, sans-serif",
                    fontSize: "clamp(1rem, 1.1vw, 18px)",
                }}
            >
                {email}
            </a>
            {phone ? (
                <a
                    href={`tel:${phone.replace(/\s|\(|\)|-/g, "")}`}
                    className="block mt-[4px] text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                    style={{
                        fontFamily: "Tenon, sans-serif",
                        fontSize: "clamp(1rem, 1.1vw, 18px)",
                    }}
                >
                    {phone}
                </a>
            ) : null}
        </div>
    );
}
