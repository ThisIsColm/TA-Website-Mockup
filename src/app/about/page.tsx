import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import WorkTogetherCta from "@/components/WorkTogetherCta";
import RotatingTagline from "./RotatingTagline";
import TeamCard, { type TeamCardProps } from "./TeamCard";
import { typeClass } from "@/lib/typographyStyles";

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
 * - `photoPrefix` → `_001.webp` (default) + `_002` (hover) via `getTeamPhotoPair`.
 * - `photos` for explicit [default, hover] paths when filenames differ.
 * - `tapeKey` maps to `/images/team/tape/Tape_{key}.png`.
 */
const TEAM: TeamCardProps[] = [
    { nameLabel: "Nathan Reilly", role: "CEO", photoPrefix: "Nathan", tapeKey: "Nathan" },
    { nameLabel: "Gabi Chrobak", role: "Head of Production", photoPrefix: "Gabi", tapeKey: "Gabi" },
    {
        nameLabel: "Mark O'Brien",
        role: "Creative Director",
        photoPrefix: "Mark",
        tapeKey: "Mark",
    },
    {
        nameLabel: "Eilis Doherty",
        role: "Creative Director",
        photoPrefix: "Eilis",
        tapeKey: "Eilis",
    },
    {
        nameLabel: "Leon Forristal",
        role: "Director of Photography",
        photoPrefix: "Leon",
        tapeKey: "Leon",
    },
    {
        nameLabel: "Blaine Rennicks",
        role: "Technical Director",
        photoPrefix: "Blaine",
        tapeKey: "Blaine",
    },
    {
        nameLabel: "Colm Moore",
        role: "Head of Post Production",
        photoPrefix: "Colm",
        tapeKey: "Colm",
    },
    {
        nameLabel: "Rory Bradley",
        role: "Senior Editor",
        photoPrefix: "Rory",
        tapeKey: "Rory",
    },
    {
        nameLabel: "Beatriz Gonçalves",
        role: "Senior Motion Designer",
        photoPrefix: "Beatriz",
        tapeKey: "Beatriz",
    },
    {
        nameLabel: "Kate Brady",
        role: "Producer",
        photoPrefix: "Kate",
        tapeKey: "Kate",
    },
    {
        nameLabel: "Rosie Spearing",
        role: "Assistant Producer",
        photoPrefix: "Rosie",
        tapeKey: "Rosie",
    },
    {
        nameLabel: "Alex James",
        role: "CTO",
        photoPrefix: "AJ",
        tapeKey: "AJ",
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
                        <div className="col-span-6 md:col-start-3 md:col-span-4">
                            <h1
                                className={`font-sans font-extrabold text-[#353535] ${typeClass("about.heroHeading")}`}
                            >
                                We are Tiny Ark &mdash; an independent creative
                                production company.
                            </h1>
                            <div
                                className={`mt-[28px] md:mt-[80px] w-full space-y-[20px] md:space-y-[24px] text-black ${typeClass("about.heroBody")}`}
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
                        <div className="col-span-6 md:col-span-3">
                            <RotatingTagline />
                        </div>

                        <div
                            data-header-surface="white"
                            className="col-span-6 md:col-span-3 bg-white p-[24px] md:p-[32px] flex flex-col gap-[24px]"
                        >
                            <div className="min-w-0 w-full">
                                <p className={`text-black ${typeClass("about.serviceCardBody")}`}>
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

            <WorkTogetherCta />
        </div>
    );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className={`text-black ${typeClass("about.sectionHeading")}`}>
            {children}
        </h2>
    );
}

function ServicePill({ label }: { label: string }) {
    return (
        <div
            className={`flex w-full min-w-0 flex-nowrap items-center justify-start gap-[0.35em] overflow-hidden rounded-full border-2 border-accent px-[0.65em] py-[0.32em] text-accent ${typeClass("about.servicePill")}`}
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

