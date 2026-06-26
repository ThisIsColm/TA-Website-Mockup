import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import WorkTogetherCta from "@/components/WorkTogetherCta";
import WorkWithUsCards from "./WorkWithUsCards";
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

/**
 * Team grid:
 * - `photoPrefix` → `_001.webp` (default) + `_002` (hover) via `getTeamPhotoPair`.
 * - `photos` for explicit [default, hover] paths when filenames differ.
 * - `tapeKey` maps to `/images/team/tape/{key}_Tape.webp`.
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
                                We&rsquo;re Tiny Ark &mdash; an independent creative
                                production company.
                            </h1>
                            <div
                                className={`mt-[28px] md:mt-[80px] w-full space-y-[20px] md:space-y-[24px] text-black ${typeClass("about.heroBody")}`}
                            >
                                <p>
                                    We bring together directors, producers,
                                    cinematographers, editors, designers and VFX artists
                                    to create work that moves people. Whether it&rsquo;s
                                    for livestream, commercial campaigns or socials, from
                                    brief to final delivery, we get it done. We mobilise
                                    productions across the globe, and are no strangers to a
                                    tight timeline.
                                </p>
                                <p>
                                    No ego. No unnecessary layers. When you work with us,
                                    you deal directly with experienced people and
                                    transparent budgets. We build creative partnerships
                                    that last.
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ── Services / Capabilities (beige band, interactive cards) ─ */}
            <WorkWithUsCards />

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
                            src="/images/Client%20Logos%203x4.png"
                            alt="Brands and clients Tiny Ark has worked with"
                            width={850}
                            height={429}
                            className="w-full h-auto md:hidden"
                            sizes="100vw"
                        />
                        <Image
                            src="/images/Client_Logos.png"
                            alt="Brands and clients Tiny Ark has worked with"
                            width={3322}
                            height={502}
                            className="hidden w-full h-auto md:block"
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

