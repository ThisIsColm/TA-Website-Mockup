"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/Container";
import { typeClass } from "@/lib/typographyStyles";

const BEIGE = "#EAE4DD";

interface WorkCard {
    accent: string;
    body: string[];
    pills: string[];
}

const CARDS: WorkCard[] = [
    {
        accent: "Commercials",
        body: [
            "With our talented and diverse roster of directors, we collaborate with agencies to bring their creative to life through cinematic execution.",
        ],
        pills: [
            "Budget & CPA",
            "Creative & Pre-vis",
            "Casting & Research",
            "Crew Management",
            "Location & Logistics",
            "Post-Production",
        ],
    },
    {
        accent: "Brand Stories",
        body: [
            "We create films that help brands connect with people. Whether it's a documentary-led piece, a founder story or a campaign film, we craft authentic narratives that resonate.",
        ],
        pills: [
            "Ideation & Research",
            "Narrative Development",
            "Brand Alignment",
            "Script & Storyboarding",
            "Motion Graphics/VFX",
            "End-to-End Production",
        ],
    },
    {
        accent: "Livestreams",
        body: [
            "We deliver live, multi-camera productions with the same clarity and control as our film work.",
            "From global product launches to livestream concerts, we coordinate every detail.",
        ],
        pills: [
            "Broadcast for TV",
            "Multi-Camera Direction",
            "4K Livestream",
            "Real-Time Graphics",
            "Stable & Secure Feed",
            "Versioned Assets",
        ],
    },
];

// Exit: accelerates away quickly (ease-in).
const EASE_OUT_FAST = [0.4, 0, 1, 1] as const;
// Enter: ramps up then settles (ease-in-out).
const EASE_IN_OUT = [0.45, 0, 0.2, 1] as const;

const CARD_ENTER = {
    opacity: { duration: 0.22, ease: EASE_OUT_FAST },
    y: { duration: 0.3, ease: EASE_IN_OUT },
    scale: { duration: 0.3, ease: EASE_IN_OUT },
} as const;

const CARD_EXIT = {
    duration: 0.18,
    ease: EASE_OUT_FAST,
} as const;

const ACCENT_MOVE = {
    duration: 0.32,
    ease: EASE_IN_OUT,
} as const;

const LABEL_FADE = {
    duration: 0.25,
    ease: EASE_IN_OUT,
} as const;

export default function WorkWithUsCards() {
    const [active, setActive] = useState(0);
    const card = CARDS[active];

    return (
        <section
            data-header-surface="neutral"
            style={{ backgroundColor: BEIGE }}
            className="py-[60px] md:py-[80px]"
        >
            <Container>
                <div className="grid grid-cols-6 gap-[5px] items-start md:items-center">
                    {/* ── Left: lead + the three taglines as a hover/tap menu ── */}
                    <div className="col-span-6 md:col-span-3 text-black">
                        <span
                            className={`block ${typeClass("about.rotatingTaglineLead")}`}
                        >
                            We Produce
                        </span>

                        <div className="mt-[8px] md:mt-[12px] flex flex-col">
                            {CARDS.map((c, i) => {
                                const isActive = i === active;
                                return (
                                    <button
                                        key={i}
                                        type="button"
                                        onMouseEnter={() => setActive(i)}
                                        onFocus={() => setActive(i)}
                                        onClick={() => setActive(i)}
                                        aria-pressed={isActive}
                                        className="group flex items-stretch text-left cursor-pointer focus:outline-none"
                                    >
                                        {/* Sliding accent marker */}
                                        <span
                                            aria-hidden
                                            className="relative mr-[16px] w-[4px] shrink-0 self-stretch"
                                        >
                                            {isActive && (
                                                <motion.span
                                                    layoutId="work-accent-marker"
                                                    className="absolute left-0 top-[0.3em] bottom-[0.3em] w-[4px] rounded-full bg-accent"
                                                    transition={ACCENT_MOVE}
                                                />
                                            )}
                                        </span>
                                        <motion.span
                                            animate={{
                                                opacity: isActive ? 1 : 0.3,
                                            }}
                                            whileHover={{
                                                opacity: isActive ? 1 : 0.6,
                                            }}
                                            transition={LABEL_FADE}
                                            className={`block text-accent ${typeClass("about.rotatingTaglineAccent")}`}
                                        >
                                            {c.accent}
                                        </motion.span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Right: changing card ────────────────────────────── */}
                    <div className="col-span-6 md:col-span-3 mt-[24px] md:mt-0">
                        {/* Sizer stack reserves the tallest card height; card swaps in an absolute overlay */}
                        <div className="relative grid">
                            {CARDS.map((c, i) => (
                                <div
                                    key={i}
                                    aria-hidden
                                    className="invisible pointer-events-none [grid-area:1/1]"
                                >
                                    <CardBody card={c} />
                                </div>
                            ))}

                            <div className="absolute inset-0 overflow-hidden [grid-area:1/1]">
                                <AnimatePresence mode="sync" initial={false}>
                                    <motion.div
                                        key={active}
                                        initial={{
                                            opacity: 0,
                                            y: 18,
                                            scale: 0.99,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                            transition: CARD_ENTER,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            y: -10,
                                            scale: 0.995,
                                            transition: CARD_EXIT,
                                        }}
                                        className="h-full will-change-[opacity,transform]"
                                    >
                                        <CardBody card={card} fill />
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

const CARD_SHELL =
    "bg-white p-[24px] md:p-[32px] flex flex-col gap-[24px] justify-between";
const CARD_BODY_TEXT = (extra = "") =>
    `min-w-0 w-full space-y-[16px] text-black ${typeClass("about.serviceCardBody")} ${extra}`;
const PILL_GRID =
    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-[5px] gap-y-[8px]";

/**
 * Static version used for the invisible height sizers. When `fill` is true,
 * the card stretches to the reserved cell height so every active card matches
 * the tallest sizer (otherwise smaller cards shrink to their intrinsic height).
 */
function CardBody({ card, fill = false }: { card: WorkCard; fill?: boolean }) {
    return (
        <div
            data-header-surface="white"
            className={`${CARD_SHELL}${fill ? " h-full" : ""}`}
        >
            <div className={CARD_BODY_TEXT()}>
                {card.body.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                ))}
            </div>
            <div className={PILL_GRID}>
                {card.pills.map((pill) => (
                    <div key={pill} className="min-w-0">
                        <ServicePill label={pill} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function ServicePill({ label }: { label: string }) {
    return (
        <div
            className={`flex w-full min-w-0 flex-wrap sm:flex-nowrap items-center justify-start gap-[0.35em] overflow-hidden rounded-full border-2 border-accent px-[0.65em] py-[0.32em] text-accent ${typeClass("about.servicePill")}`}
        >
            <span
                aria-hidden="true"
                className="inline-block shrink-0 rounded-full bg-accent"
                style={{ width: "0.32em", height: "0.32em" }}
            />
            <span className="min-w-0 flex-1 sm:truncate">{label}</span>
        </div>
    );
}
