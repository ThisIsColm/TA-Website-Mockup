"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import Link from "next/link";
import { Post } from "@/types";
import Container from "./Container";
import ScrollReveal from "./ScrollReveal";

// --- SPEED CONFIGURATION ---
const AUTO_SCROLL_SPEED = 1.0;
const INTERACTIVE_SPEED_LIMIT = 10; // Max speed at container edges
const INTERACTIVE_DEADZONE = 0.15;  // Center area (0-1) where scroll is zero

// Local mapping for client logos based on post slug
const CLIENT_LOGOS: Record<string, string> = {
    "the-guinness-storehouse": "/logos/guinness-white.svg",
};

interface ClientCarouselProps {
    caseStudies: Post[];
}

export default function ClientCarousel({ caseStudies }: ClientCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, dragFree: true },
        [AutoScroll({ playOnInit: true, speed: AUTO_SCROLL_SPEED, stopOnInteraction: false })]
    );

    const [isHovered, setIsHovered] = useState(false);
    const mouseFactorRef = React.useRef(0); // -1 to 1 (left to right)

    // Track mouse position relative to container
    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!emblaApi) return;
        const root = emblaApi.rootNode();
        if (!root) return;

        const rect = root.getBoundingClientRect();
        const x = e.clientX - rect.left;
        mouseFactorRef.current = (x / rect.width) * 2 - 1; // Convert to -1...1
    }, [emblaApi]);

    // Interactive Scroll Engine
    useEffect(() => {
        if (!emblaApi) return;

        let requestRef: number;

        const animate = () => {
            if (isHovered) {
                const factor = mouseFactorRef.current;

                // Threshold to prevent minor movements in center
                let speed = 0;

                if (Math.abs(factor) > INTERACTIVE_DEADZONE) {
                    const normalized = (Math.abs(factor) - INTERACTIVE_DEADZONE) / (1 - INTERACTIVE_DEADZONE);
                    // mouse right (factor > 0) -> move left (negative speed)
                    speed = normalized * INTERACTIVE_SPEED_LIMIT * (factor > 0 ? -1 : 1);
                }

                if (speed !== 0) {
                    const engine = emblaApi.internalEngine();
                    engine.location.add(speed);
                    engine.target.set(engine.location);
                    engine.scrollLooper.loop(speed);
                    emblaApi.emit("scroll");
                }
            }
            requestRef = requestAnimationFrame(animate);
        };

        requestRef = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef);
    }, [emblaApi, isHovered]);

    // Handle AutoScroll play/stop for transitions
    useEffect(() => {
        if (!emblaApi) return;
        const autoScroll = emblaApi.plugins().autoScroll;
        if (!autoScroll) return;

        if (isHovered) {
            autoScroll.stop();
        } else {
            autoScroll.play();
        }
    }, [emblaApi, isHovered]);

    // Format display client name safely
    const getClientNameFallback = (slug: string) => {
        const parts = slug.split("-");
        if (parts.length > 0) {
            // Check for common prefixes to strip or just capitalize
            const name = parts[0] === "the" && parts[1] ? parts[1] : parts[0];
            return name.charAt(0).toUpperCase() + name.slice(1);
        }
        return "Client";
    }

    // Ensure exactly 16 thumbnails by picking unique items if possible
    const displayPosts = React.useMemo(() => {
        if (!caseStudies || caseStudies.length === 0) return [];

        let result: Post[] = [];
        const pool = [...caseStudies];

        // Shuffle the pool to ensure variety
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        // Fill up to 16 items
        while (result.length < 16) {
            // Append the shuffled pool (or a chunk of it)
            const remaining = 16 - result.length;
            const chunk = pool.slice(0, remaining);
            result = [...result, ...chunk];
        }

        // Map with unique index-based slugs for React keys
        return result.slice(0, 16).map((post, i) => ({
            ...post,
            slug: `${post.slug}-idx-${i}`
        }));
    }, [caseStudies]);

    if (!displayPosts || displayPosts.length === 0) {
        return null;
    }

    return (
        <section className="py-24 lg:py-32 bg-white overflow-hidden border-y border-black/5">
            <Container className="mb-12 lg:mb-16">
                <ScrollReveal>
                    <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tight text-black leading-none max-w-4xl">
                        Great work grows from great partnerships.
                    </h2>
                </ScrollReveal>
            </Container>

            {/* Carousel Container */}
            <div
                className="overflow-hidden cursor-grab active:cursor-grabbing w-full"
                ref={emblaRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    mouseFactorRef.current = 0;
                }}
            >
                {/* Carousel Flex Track */}
                <div className="flex touch-pan-y gap-8 pl-6 md:pl-10 lg:pl-16">
                    {displayPosts.map((post) => {
                        const baseSlug = post.slug.split("-idx-")[0]; // handle repeated slugs
                        const logoSrc = CLIENT_LOGOS[baseSlug];

                        // Use director or client as the display name if curated
                        // In Admin, we mapped "Display Title" to director for home.clients
                        const displayName = post.director || post.client || getClientNameFallback(baseSlug);

                        return (
                            <Link
                                key={post.slug}
                                href={`/case-studies/${baseSlug}`}
                                className="group relative border border-black/5 overflow-hidden flex-[0_0_45%] sm:flex-[0_0_30%] md:flex-[0_0_22%] lg:flex-[0_0_15%] aspect-[11/16] min-w-0 shrink-0 bg-gray-50 shadow-sm"
                            >
                                {/* Background Image with Hover Scale */}
                                <img
                                    src={post.coverImage || "/placeholder-image.jpg"}
                                    alt={post.title}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.08]"
                                />

                                {/* Subtitle Gradient Overlay - Adjusted for visibility on light bg */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent transition-opacity duration-500 group-hover:opacity-70" />

                                {/* Overlay / Logo Centered Container */}
                                <div className="absolute inset-0 flex items-center justify-center p-4 text-center select-none pointer-events-none">
                                    {logoSrc ? (
                                        <img
                                            src={logoSrc}
                                            alt={`${post.title} Logo`}
                                            className="w-auto h-12 md:h-16 lg:h-20 object-contain text-white text-[0px]"
                                            style={{ filter: "brightness(0) invert(1)" }}
                                        />
                                    ) : (
                                        <h3 className="text-white text-lg md:text-xl lg:text-2xl font-bold tracking-tight opacity-90 drop-shadow-md leading-tight px-2">
                                            {displayName}
                                        </h3>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
