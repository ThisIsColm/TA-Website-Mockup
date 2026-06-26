"use client";

import { useState, useRef, useCallback, useLayoutEffect, useEffect } from "react";
import { motion } from "framer-motion";
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

const EASE_OUT = [0.22, 0.9, 0.2, 1] as const;
const EASE_IN_OUT = [0.45, 0, 0.2, 1] as const;

/** How far each card sits below the one in front (px) — bottom-edge peek. */
const STACK_OFFSET = 12;
/** Scale reduction per step back in the stack (front = 1). */
const STACK_SCALE_STEP = 0.015;

const CARD_STACK_TRANSITION = {
    duration: 0.5,
    ease: EASE_OUT,
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
    const menuRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const [marker, setMarker] = useState({ top: 0, height: 0 });

    /** Measure active item — avoids layoutId shared-element flicker during scroll. */
    const syncMarker = useCallback(() => {
        const menu = menuRef.current;
        const btn = itemRefs.current[active];
        if (!menu || !btn) return;

        const menuTop = menu.getBoundingClientRect().top;
        const btnRect = btn.getBoundingClientRect();
        const fontSize = parseFloat(getComputedStyle(btn).fontSize) || 16;
        const inset = fontSize * 0.3;

        setMarker({
            top: btnRect.top - menuTop + inset,
            height: Math.max(0, btnRect.height - inset * 2),
        });
    }, [active]);

    useLayoutEffect(() => {
        syncMarker();
    }, [syncMarker]);

    useEffect(() => {
        window.addEventListener("resize", syncMarker);
        return () => window.removeEventListener("resize", syncMarker);
    }, [syncMarker]);

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

                        <div
                            ref={menuRef}
                            className="relative mt-[8px] md:mt-[12px] flex flex-col pl-[20px]"
                        >
                            <motion.span
                                aria-hidden
                                className="pointer-events-none absolute left-0 w-[4px] rounded-full bg-accent"
                                initial={false}
                                animate={{
                                    top: marker.top,
                                    height: marker.height,
                                }}
                                transition={ACCENT_MOVE}
                            />
                            {CARDS.map((c, i) => {
                                const isActive = i === active;
                                return (
                                    <button
                                        key={i}
                                        ref={(el) => {
                                            itemRefs.current[i] = el;
                                        }}
                                        type="button"
                                        onMouseEnter={() => setActive(i)}
                                        onFocus={() => setActive(i)}
                                        onClick={() => setActive(i)}
                                        aria-pressed={isActive}
                                        className="group text-left cursor-pointer focus:outline-none"
                                    >
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

                    {/* ── Right: rolodex card stack ─────────────────────── */}
                    <div className="col-span-6 md:col-span-3 mt-[24px] md:mt-0">
                        {/* Sizer reserves the tallest card height; real cards stack on top */}
                        <div className="relative grid">
                            {CARDS.map((c, i) => (
                                <div
                                    key={`sizer-${i}`}
                                    aria-hidden
                                    className="invisible pointer-events-none [grid-area:1/1]"
                                >
                                    <CardBody card={c} />
                                </div>
                            ))}

                            {CARDS.map((c, i) => {
                                const stackPos =
                                    (i - active + CARDS.length) % CARDS.length;
                                const isFront = stackPos === 0;
                                return (
                                    <motion.div
                                        key={`card-${i}`}
                                        aria-hidden={!isFront}
                                        animate={{
                                            y: stackPos * STACK_OFFSET,
                                            scale: 1 - stackPos * STACK_SCALE_STEP,
                                        }}
                                        transition={CARD_STACK_TRANSITION}
                                        style={{
                                            zIndex: CARDS.length - stackPos,
                                            transformOrigin: "top center",
                                            boxShadow: isFront
                                                ? "0 8px 20px -12px rgba(0,0,0,0.12)"
                                                : "0 4px 12px -10px rgba(0,0,0,0.08)",
                                        }}
                                        className="[grid-area:1/1] will-change-transform"
                                    >
                                        <CardBody card={c} fill />
                                    </motion.div>
                                );
                            })}
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
 * Static card body. When `fill` is true, the card stretches to the reserved
 * cell height so every active card matches the tallest sizer (otherwise smaller
 * cards shrink to their intrinsic height).
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
