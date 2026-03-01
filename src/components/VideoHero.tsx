"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Container from "@/components/Container";
import Link from "next/link";

export default function VideoHero() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Track scroll position of this section
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // Fade out and translate the overlay content as we scroll down
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const y = useTransform(scrollYProgress, [0, 0.5], [0, -40]);

    // Subtle parallax for the video itself
    const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden"
        >
            {/* Video Background Container */}
            <motion.div
                style={{ y: videoY }}
                className="absolute inset-0 w-full h-full pointer-events-none"
            >
                <iframe
                    src="https://player.vimeo.com/video/1169110663?h=64a496fc25&background=1&autoplay=1&loop=1&muted=1"
                    className="absolute top-1/2 left-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover"
                    allow="autoplay; fullscreen; picture-in-picture"
                    title="Background Video"
                />
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black/30" />
            </motion.div>

        </section>
    );
}
