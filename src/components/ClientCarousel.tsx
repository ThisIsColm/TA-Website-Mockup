"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { Post } from "@/types";
import Container from "./Container";
import ScrollReveal from "./ScrollReveal";

// --- SPEED CONFIGURATION ---
const AUTO_SCROLL_SPEED = 1.0;

// Local mapping for client logos based on post slug
const CLIENT_LOGOS: Record<string, string> = {
    "the-guinness-storehouse": "/logos/guinness-white.svg",
};

interface ClientCarouselProps {
    caseStudies: Post[];
}

export default function ClientCarousel({ caseStudies }: ClientCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel(
        { loop: true, watchDrag: false },
        [AutoScroll({ playOnInit: true, speed: AUTO_SCROLL_SPEED, stopOnInteraction: false })]
    );



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

    // Ensure a sufficient number of thumbnails for a smooth loop by repeating the ordered list if necessary
    const displayPosts = React.useMemo(() => {
        if (!caseStudies || caseStudies.length === 0) return [];

        let result: Post[] = [...caseStudies];

        // If we have very few items, repeat the list to ensure Embla can loop gaplessly
        // Typically we want at least 12-16 items for a smooth continuous scroll
        while (result.length > 0 && result.length < 16) {
            result = [...result, ...caseStudies];
        }

        // Map with unique index-based slugs for React keys
        return result.map((post, i) => ({
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
                className="overflow-hidden w-full"
                ref={emblaRef}
            >
                {/* Carousel Flex Track */}
                <div className="flex touch-pan-y -ml-8">
                    {displayPosts.map((post) => {
                        const baseSlug = post.slug.split("-idx-")[0]; // handle repeated slugs
                        const logoSrc = CLIENT_LOGOS[baseSlug];

                        // Use director or client as the display name if curated
                        // In Admin, we mapped "Display Title" to director for home.clients
                        const displayName = post.director || post.client || getClientNameFallback(baseSlug);

                        return (
                            <div
                                key={post.slug}
                                className="pl-8 flex-[0_0_45%] sm:flex-[0_0_30%] md:flex-[0_0_22%] lg:flex-[0_0_15%] min-w-0 shrink-0"
                            >
                                <div className="relative border border-black/5 overflow-hidden w-full h-full aspect-[11/16] bg-gray-50 shadow-sm">
                                    {/* Background Image */}
                                    <img
                                        src={post.coverImage || "/placeholder-image.jpg"}
                                        alt={post.title}
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />

                                    {/* Subtitle Gradient Overlay - Adjusted for visibility on light bg */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

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
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
