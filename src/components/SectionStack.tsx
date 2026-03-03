"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import { useLenis } from "lenis/react";
import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

interface Section {
    title: string;
    slug: string;
    image: string;
}

const sections: Section[] = [
    {
        title: "Commercial",
        slug: "commercial",
        image: "/images/tiny_ark_powers_old_but_gold_basketball_001.png",
    },
    {
        title: "Brand Stories",
        slug: "brand-stories",
        image: "/images/StripeStayCity.png",
    },
    {
        title: "Music",
        slug: "music",
        image: "/images/amble.jpg",
    },
    {
        title: "Live",
        slug: "live",
        image: "/images/live.jpg",
    },
];

const missionLines = [
    "Our philosophy is rooted in creative courage,",
    "cinematic precision, and the relentless",
    "pursuit of work that doesn't just",
    "capture attention. It commands it."
];

// TWEAK THIS: Adjust the timing for each card (0, 1, 2, 3) 
// Values represent multiplier of a scroll slot (e.g., 0.5 = half a slot delay)
const cardDelays = [0, 0.4, 0.8, 1.2];

export default function SectionStack() {
    const containerRef = useRef<HTMLDivElement>(null);
    const lenis = useLenis();

    // Toggle scroll snap on the HTML element while this section is active.
    useEffect(() => {
        const el = document.documentElement;
        el.classList.add("snap-sections");
        return () => {
            el.classList.remove("snap-sections");
        };
    }, []);

    // Total scroll slots needed: One slot for Phil, one per card.
    // Plus the total sum of delays to give the last cards room to breathe.
    // Buffer removed so the section unlocks the moment the last card lands.
    const totalDelay = cardDelays[cardDelays.length - 1];
    const totalSlots = sections.length + 1 + totalDelay;
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // 1 unit = spatial progress of one slot.
    const unit = 1 / (totalSlots - 1);

    // ── MATH FOR CARD-AWARE SNAPPING ──
    // We create snap points exactly where the "settle" animation ends for each card.
    const snapPoints = [
        0, // Start / Philosophy
        ...sections.map((_, i) => {
            const isLive = i === sections.length - 1;
            const delayOffset = cardDelays[i];
            const slideEnd = (i + 1) + delayOffset;
            const settleEnd = isLive ? slideEnd : slideEnd + 0.4;
            return settleEnd * 100; // Convert to vh
        })
    ];

    // Phil text Slot - text moves up exactly 100vh over the first unit.
    const philSlotEnd = unit;
    const philY = useTransform(scrollYProgress, [0, philSlotEnd], ["0vh", "-100vh"]);

    // ── FLICK GUARD (Programmatic Snapping) ──
    const lastScrollTime = useRef(0);
    useEffect(() => {
        if (!lenis) return;

        const handleScroll = (e: any) => {
            const now = Date.now();
            if (now - lastScrollTime.current < 500) return; // Prevent infinite snap loops

            const velocity = e.velocity;
            const threshold = 15; // Tweak this for sensitivity

            if (Math.abs(velocity) > threshold) {
                // Find current scroll position in VH
                const currentVH = (window.scrollY / window.innerHeight) * 100;
                const relativeVH = currentVH - (containerRef.current?.offsetTop || 0) / window.innerHeight * 100;

                // Find the nearest snap point in the direction of travel
                const targetPoints = velocity > 0
                    ? snapPoints.filter(p => p > relativeVH + 10)
                    : snapPoints.filter(p => p < relativeVH - 10).reverse();

                if (targetPoints.length > 0) {
                    lastScrollTime.current = now;
                    const destVH = targetPoints[0];
                    const destPixels = (destVH / 100) * window.innerHeight + (containerRef.current?.offsetTop || 0);

                    lenis.scrollTo(destPixels, {
                        immediate: false,
                        duration: 0.8,
                        easing: (t: number) => 1 - Math.pow(1 - t, 4) // Custom ease-out
                    });
                }
            }
        };

        lenis.on("scroll", handleScroll);
        return () => lenis.off("scroll", handleScroll);
    }, [lenis, snapPoints]);

    // Video fades to black only after Card 0 is fully docked.
    // Progress range [unit, unit * 1.1] ensures it transitions while Card 0 is full screen.
    const bgOverlayOpacity = useTransform(scrollYProgress, [unit, unit * 1.05], [0, 1]);

    return (
        <motion.section
            ref={containerRef}
            className="relative"
            style={{ height: `${totalSlots * 100}vh` }}
        >
            {/* ── Unified Sticky Track ── */}
            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {/* 1. Background Black Fade (Behind cards, Above video) */}
                <motion.div
                    className="absolute inset-0 bg-bg pointer-events-none"
                    style={{ opacity: bgOverlayOpacity, zIndex: 10 }}
                />

                {/* 2. Philosophy Section (z-50) */}
                {/* No background here, just the text sitting on top of the cards */}
                <div className="absolute inset-0 flex flex-col justify-end pointer-events-none z-50">
                    <Container className="pb-[48px] px-6">
                        <motion.div
                            style={{
                                y: philY,
                            }}
                            className="max-w-5xl"
                        >
                            <h2 className="text-[clamp(1.5rem,3.5vw,2.5rem)] font-bold leading-[1.2] tracking-[-0.03em] text-white break-words">
                                {missionLines.map((line, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                                        whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            duration: 0.8,
                                            delay: i * 0.15,
                                            ease: [0.25, 0.4, 0.25, 1]
                                        }}
                                        className="block"
                                    >
                                        {line}
                                    </motion.span>
                                ))}
                            </h2>
                        </motion.div>
                    </Container>

                    {/* Scroll indicator */}
                    <motion.div
                        style={{
                            opacity: useTransform(scrollYProgress, [0, 0.05], [1, 0])
                        }}
                        className="absolute bottom-10 right-10 flex items-center gap-4 text-white/60"
                    >
                        <span className="text-xs font-medium tracking-wide">(Scroll)</span>
                        <div className="w-8 h-px bg-white/40" />
                    </motion.div>
                </div>

                {/* 3. Image Sections (Deck of Cards) */}
                {sections.map((section, index) => (
                    <SectionCard
                        key={section.title}
                        section={section}
                        index={index}
                        progress={scrollYProgress}
                        totalScrollSlots={totalSlots}
                    />
                ))}
            </div>

            {/* ── Scroll Snap Anchors (Card-Aware) ── */}
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
                {snapPoints.map((vh, i) => (
                    <div
                        key={i}
                        className="absolute w-full snap-start snap-always"
                        style={{
                            top: `${vh}vh`,
                            height: "50vh" // Thickened to catch fast flicks
                        }}
                    />
                ))}
            </div>
        </motion.section>
    );
}

function SectionCard({ section, index, progress, totalScrollSlots }: { section: Section; index: number; progress: any; totalScrollSlots: number }) {
    const unit = 1 / (totalScrollSlots - 1);

    // DELAY SHIFT: This moves the entrance/landing window for this specific card.
    const delayOffset = cardDelays[index] * unit;

    const entranceStart = (index * unit) + delayOffset;
    const slideEnd = ((index + 1) * unit) + delayOffset;
    const settleEnd = slideEnd + (unit * 0.4);

    // REDUCED GAP: Card 0 starts at 101vh (text is at ~95vh baseline).
    const yStartValNum = index === 0 ? 101 : 110;

    const isLive = index === sections.length - 1;
    const numericTargetY = isLive ? 9 : (index * 3);

    // The total amount the stack will drift up over the entire scroll
    const driftAmount = -6;

    // Calculate proportional drift at each keyframe
    const driftAt0 = 0;
    const driftAtEntrance = entranceStart * driftAmount;
    const driftAtSlideEnd = slideEnd * driftAmount;
    const driftAtEnd = 1.0 * driftAmount;

    // isLive card hits slideEnd exactly at 1.0
    const yInputRange = isLive ? [0, entranceStart, 1.0] : [0, entranceStart, slideEnd, 1.0];
    const yOutputRange = isLive
        ? [`${yStartValNum + driftAt0}vh`, `${yStartValNum + driftAtEntrance}vh`, `${numericTargetY + driftAtEnd}vh`]
        : [
            `${yStartValNum + driftAt0}vh`,
            `${yStartValNum + driftAtEntrance}vh`,
            `${numericTargetY + driftAtSlideEnd}vh`,
            `${numericTargetY + driftAtEnd}vh`
        ];
    const y = useTransform(progress, yInputRange, yOutputRange);

    const peakScales = [1.0, 0.85, 0.80, 0.8]; // Scale as it slides in
    const settledScales = [0.85, 0.80, 0.75, 0.70]; // Scale immediately after docking
    const finalScales = [0.60, 0.62, 0.64, 0.61]; // Scale at the very end of the scroll

    // For the last card, start at 0.71 and reach finalScale halfway through the slide
    const liveMidPoint = entranceStart + (1.0 - entranceStart) / .7;

    const peakScale = peakScales[index];
    const settledScale = settledScales[index];
    const finalScale = finalScales[index];

    const scaleInputRange = isLive ? [0, entranceStart, liveMidPoint, 1.0] : [0, entranceStart, slideEnd, settleEnd, 1.0];
    const scaleOutputRange = isLive
        ? [0.79, 0.79, finalScale, finalScale]
        : [peakScale, peakScale, peakScale, settledScale, finalScale];
    const scale = useTransform(progress, scaleInputRange, scaleOutputRange);

    const radiusInputRange = isLive ? [0, entranceStart, 1.0] : [0, entranceStart, slideEnd, settleEnd];
    const radiusOutputRange = isLive ? ["0px", "0px", "4px"] : ["0px", "0px", "0px", "4px"];
    const borderRadius = useTransform(progress, radiusInputRange, radiusOutputRange);

    // Parallax removed - image stays static within its container
    const imageY = "0%";

    // Subtle Text Drift: Text "lands" slightly after the card.
    const textY = useTransform(
        progress,
        [entranceStart, slideEnd],
        ["1.5rem", "0rem"]
    );

    const textOpacity = useTransform(progress, [entranceStart, slideEnd], [0, 1]);

    return (
        <motion.div
            style={{
                y,
                scale,
                borderRadius,
                zIndex: 30 + index,
                transformOrigin: "center"
            }}
            className="absolute inset-0 w-full h-screen overflow-hidden pointer-events-auto"
        >
            <Link
                href={`/work?category=${section.slug}`}
                className="group block relative w-full h-full cursor-pointer"
            >
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <motion.div
                        style={{ y: imageY }}
                        className="relative w-full h-full"
                    >
                        <Image
                            src={section.image}
                            alt={section.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            priority={index === 0}
                        />
                        {/* Interactive Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    </motion.div>
                </div>

                <div className="relative z-10 h-full w-full flex items-center px-6">
                    <div className="w-full relative flex items-center">
                        <motion.span
                            style={{
                                opacity: textOpacity,
                                y: textY
                            }}
                            className="text-[clamp(1.8rem,4vw,3.5rem)] font-light text-white/50 pr-6"
                        >
                            {index + 1}
                        </motion.span>

                        <div className="flex-grow" />

                        <motion.h2
                            style={{
                                opacity: textOpacity,
                                y: textY
                            }}
                            className="text-[clamp(2rem,6vw,5.5rem)] font-medium tracking-tight text-white pl-6 pr-4 md:pr-12 lg:pr-24 transition-colors duration-300"
                        >
                            {section.title}
                        </motion.h2>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
