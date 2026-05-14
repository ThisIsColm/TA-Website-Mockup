import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import RotatingTagline from "./RotatingTagline";

export const metadata: Metadata = {
    title: "About",
    description:
        "Tiny Ark is an independent creative video agency based in Dublin, collaborating globally with brands and cultural institutions.",
    openGraph: {
        title: "About — Tiny Ark",
        description:
            "An independent creative video agency based in Dublin, collaborating globally with brands and cultural institutions.",
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
 * Team grid assets (see `public/images/team/README.md`):
 * - `photoSrc`: portrait, design size **280×320** (or 2× for retina). JPG / WebP / PNG.
 * - `nameAssetSrc`: handwritten name as **transparent PNG** (width scales; keep safe margin).
 * - `nameLabel`: fallback label if `nameAssetSrc` is omitted (orange bar + text).
 */
interface TeamMember {
    role: string;
    nameLabel?: string;
    photoSrc?: string;
    nameAssetSrc?: string;
}

const TEAM: TeamMember[] = [
    { nameLabel: "Nathan Reilly", role: "CEO" },
    { role: "Head of Production" },
    { nameLabel: "Mark O'Brien", role: "Creative Director" },
    { nameLabel: "Elise Doherty", role: "Director" },
    { nameLabel: "Leon Forristal", role: "Director of Photography" },
    { role: "Technical Director" },
    { nameLabel: "Colm Moore", role: "Head of Post Production" },
    { nameLabel: "Rory Bradley", role: "Senior Editor" },
    { nameLabel: "Beatriz Gonçalves", role: "Senior Motion Designer" },
    { role: "Producer" },
    { nameLabel: "Rosie Spearing", role: "Assistant Producer" },
    { nameLabel: "AJ", role: "CTO" },
];

const BEIGE = "#EAE4DD";

export default function AboutPage() {
    return (
        <div className="bg-white text-black">
            {/* ── Hero statement ─────────────────────────────────────── */}
            <section className="pt-[140px] md:pt-[180px] pb-[100px] md:pb-[140px]">
                <Container>
                    <div className="grid grid-cols-6 gap-[5px]">
                        <p
                            className="col-span-6 md:col-span-6 font-bold text-black"
                            style={{
                                fontFamily: "Tenon, sans-serif",
                                fontSize: "clamp(1.8rem, 4vw, 60px)",
                                letterSpacing: "-0.01em",
                                lineHeight: 1.18,
                                fontWeight: 700,
                            }}
                        >
                            Generic &ldquo;About Us&rdquo; statement with references to
                            services, locations, team expertise etc etc lorem ipsum
                            dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                            tempor incididunt ut labore et dolore magna aliqua. Ut enim
                            ad minim veniam, quis nostrud exercitation ullamco.
                        </p>
                    </div>
                </Container>
            </section>

            {/* ── Services / Capabilities ────────────────────────────── */}
            <section style={{ backgroundColor: BEIGE }} className="pt-[60px] md:pt-[80px] pb-[40px] md:pb-[60px]">
                <Container>
                    <div className="grid grid-cols-6 gap-[5px] items-start">
                        <div className="col-span-6 md:col-span-3">
                            <RotatingTagline />
                        </div>

                        <div className="col-span-6 md:col-span-3 bg-white p-[24px] md:p-[32px] flex flex-col gap-[24px]">
                            <p
                                className="text-black"
                                style={{
                                    fontFamily: "Tenon, sans-serif",
                                    fontSize: "clamp(0.95rem, 1.05vw, 18px)",
                                    lineHeight: 1.5,
                                    fontWeight: 400,
                                }}
                            >
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                sed do eiusmod tempor incididunt ut labore et dolore
                                magna aliqua. Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco.
                            </p>
                            <div className="grid grid-cols-2 gap-[8px]">
                                {SERVICES.map((s) => (
                                    <ServicePill key={s} label={s} />
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ── Team grid ──────────────────────────────────────────── */}
            <section style={{ backgroundColor: BEIGE }} className="pb-[60px] md:pb-[100px]">
                <Container>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-[5px]">
                        {TEAM.map((m, i) => (
                            <TeamCard key={i} {...m} />
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── "Let's work together." CTA (white — matches home, then beige footer) ─ */}
            <section className="pt-[40px] md:pt-[60px] pb-[100px] md:pb-[140px] bg-white">
                <Container>
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
                    <ul className="mt-[20px] md:mt-[24px] space-y-[2px]">
                        <li>
                            <a
                                href="mailto:nathan@tinyark.com"
                                className="text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                                style={{
                                    fontSize: "clamp(1.5rem, 1.5vw, 2.5rem)",
                                    lineHeight: 1.5,
                                }}
                            >
                                nathan@tinyark.com
                            </a>
                        </li>
                        <li>
                            <a
                                href="mailto:gabi@tinyark.com"
                                className="text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                                style={{
                                    fontSize: "clamp(1.5rem, 1.5vw, 2.5rem)",
                                    lineHeight: 1.5,
                                }}
                            >
                                gabi@tinyark.com
                            </a>
                        </li>
                    </ul>
                </Container>
            </section>
        </div>
    );
}

function ServicePill({ label }: { label: string }) {
    return (
        <span
            className="inline-flex items-center justify-between gap-[6px] border border-accent rounded-full px-[12px] py-[5px] text-accent"
            style={{
                fontFamily: "Tenon, sans-serif",
                fontSize: "clamp(0.7rem, 0.78vw, 13px)",
                fontWeight: 500,
            }}
        >
            <span className="flex items-center gap-[6px]">
                <span aria-hidden="true" className="inline-block w-[4px] h-[4px] rounded-full bg-accent" />
                <span>{label}</span>
            </span>
            <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
                className="shrink-0"
            >
                <path
                    d="M2 8L8 2M8 2H3M8 2V7"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    );
}

function TeamCard({ nameLabel, nameAssetSrc, role, photoSrc }: TeamMember) {
    const alt = nameLabel || role;

    return (
        <div className="flex flex-col">
            {/* Design spec: portrait 280 × 320 */}
            <div className="relative aspect-[280/320] bg-[#D7CFC2] overflow-hidden">
                {photoSrc ? (
                    <Image
                        src={photoSrc}
                        alt={alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 16vw"
                    />
                ) : null}

                {nameAssetSrc ? (
                    <div className="pointer-events-none absolute left-[8px] bottom-[10px] right-[8px] max-w-[calc(100%-16px)] h-[28%] min-h-[44px]">
                        <Image
                            src={nameAssetSrc}
                            alt=""
                            fill
                            className="object-contain object-left-bottom"
                            sizes="200px"
                        />
                    </div>
                ) : nameLabel ? (
                    <div
                        className="absolute left-[10px] bottom-[12px] bg-accent text-white -rotate-[3deg] px-[10px] py-[4px] shadow-[0_2px_6px_rgba(0,0,0,0.18)]"
                        style={{
                            fontFamily: "Tenon, sans-serif",
                            fontStyle: "italic",
                            fontWeight: 700,
                            fontSize: "clamp(0.85rem, 1vw, 16px)",
                            letterSpacing: "0.02em",
                        }}
                    >
                        {nameLabel}
                    </div>
                ) : null}
            </div>
            <p
                className="text-black mt-[10px] leading-tight"
                style={{
                    fontFamily: "Tenon, sans-serif",
                    fontSize: "clamp(0.75rem, 0.78vw, 14px)",
                    fontWeight: 700,
                }}
            >
                {role}
            </p>
        </div>
    );
}
