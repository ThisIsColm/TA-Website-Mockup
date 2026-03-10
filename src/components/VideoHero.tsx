"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Container from "@/components/Container";
import Link from "next/link";
import Image from "next/image";

export default function VideoHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [videoReady, setVideoReady] = useState(false);

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

    // Listen for the "play" event from the Vimeo iframe to ensure we only show it when it's actually running
    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== "https://player.vimeo.com") return;
            try {
                const data = JSON.parse(event.data);
                if (data.event === "play" || data.event === "ready") {
                    // Small delay to ensure the first frame is rendered
                    setTimeout(() => setVideoReady(true), 500);
                }
            } catch (e) {
                // Ignore non-json messages
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);

    return (
        <section
            ref={containerRef}
            className="relative h-screen w-full overflow-hidden bg-black"
        >
            {/* ── Loading State / Placeholder ───────────────────────────── */}
            <AnimatePresence>
                {!videoReady && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden"
                    >
                        <Image
                            src="/images/Hero-Loading_V1.png"
                            alt="Loading"
                            fill
                            priority
                            className="object-cover"
                            sizes="100vw"
                        />
                        {/* Darker overlay during load for the loader contrast */}
                        <div className="absolute inset-0 bg-black/40" />

                        {/* Satisfying Loading Animation */}
                        <div className="relative z-30 flex flex-col items-center gap-6">
                            <motion.div
                                animate={{
                                    rotate: 360,
                                    borderRadius: ["20%", "50%", "20%"]
                                }}
                                transition={{
                                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                                    borderRadius: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                                }}
                                className="w-12 h-12 border-2 border-white/30 border-t-white"
                            />
                            <motion.span
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="text-white/70 text-sm font-medium tracking-[0.2em] uppercase"
                            >
                                Loading Experience
                            </motion.span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video Background Container */}
            <motion.div
                style={{ y: videoY }}
                className="absolute inset-0 w-full h-full pointer-events-none"
            >
                <iframe
                    src="https://player.vimeo.com/video/1169321210?h=64a496fc25&background=1&autoplay=1&loop=1&muted=1&api=1"
                    className={`absolute top-1/2 left-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-1000 ${videoReady ? "opacity-100" : "opacity-0"
                        }`}
                    allow="autoplay; fullscreen; picture-in-picture"
                    title="Background Video"
                />
                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black/10" />
            </motion.div>
        </section>
    );
}
