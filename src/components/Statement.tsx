"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Container from "./Container";

interface StatementProps {
    text: string;
    className?: string;
}

export default function Statement({ text, className = "" }: StatementProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 1", "end 0.75"],
    });

    const words = text.split(" ");

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!textRef.current) return;
        const rect = textRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        textRef.current.style.setProperty("--m-x", `${x}px`);
        textRef.current.style.setProperty("--m-y", `${y}px`);
    };

    const handleMouseLeave = () => {
        if (!textRef.current) return;
        textRef.current.style.setProperty("--m-x", `-1000px`);
        textRef.current.style.setProperty("--m-y", `-1000px`);
    };

    return (
        <section ref={containerRef} className={`relative py-[0vh] bg-bg overflow-hidden ${className}`}>
            <Container>
                <div
                    ref={textRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="flex flex-wrap gap-x-[0.5em] gap-y-[0.3em] mt-40"
                    style={{
                        backgroundImage: `radial-gradient(circle 200px at var(--m-x, -1000px) var(--m-y, -1000px), var(--color-accent) 0%, var(--color-accent) 100%, rgba(255,255,255,1) 100%)`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        // Ensure background area covers the full div for tracking
                        display: "inline-flex"
                    }}
                >
                    {words.map((word, i) => {
                        // Spread the transformation over a larger window for each word to make it feel more fluid
                        const start = (i / words.length) * 0.9; // Start early
                        const end = (i / words.length) * 0.8 + 0.1; // Finish later

                        const opacityValue = useTransform(
                            scrollYProgress,
                            [start, end],
                            [0.15, 1]
                        );

                        // We map the opacity to an rgba string so it can be mixed with the background clip.
                        // However, a simpler CSS trick: If the text is transparent, it ONLY shows the background.
                        // To show BOTH the background (the orange hover) AND the base text (white, fading in),
                        // we can't make the text completely transparent.
                        // Instead, we make the background gradient primarily composed of the fading white,
                        // and the text transparent, so the background "is" the text.

                        // We apply the opacity directly to the span. Since the background is white where the 
                        // mouse IS NOT, the opacity applied to the span will fade the white background in and out.
                        return (
                            <motion.span
                                key={i}
                                style={{ opacity: opacityValue }}
                                className="text-[clamp(2.5rem,6.5vw,6rem)] font-regular leading-[1] text-transparent"
                            >
                                {word}
                            </motion.span>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="mt-8 lg:mt-"
                >
                    <Link
                        href="/about"
                        className="group inline-flex flex-col"
                    >
                        <span className="text-[18px] tracking-wider text-white/80 group-hover:text-accent transition-colors duration-300">
                            More About Us
                        </span>
                        <div className="h-px w-full bg-white/20 group-hover:bg-accent transition-colors duration-300 mt-1 mb-30" />
                    </Link>
                </motion.div>
            </Container>
        </section>
    );
}
