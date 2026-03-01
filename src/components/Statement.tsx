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
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start 1", "end 0.6"],
    });

    const words = text.split(" ");

    return (
        <section ref={containerRef} className={`relative py-[0vh] bg-bg overflow-hidden ${className}`}>
            <Container>
                <div className="flex flex-wrap gap-x-[0.5em] gap-y-[0.3em]">
                    {words.map((word, i) => {
                        // Spread the transformation over a larger window for each word to make it feel more fluid
                        const start = (i / words.length) * 0.8; // Start early
                        const end = (i / words.length) * 0.8 + 0.2; // Finish later

                        const opacity = useTransform(
                            scrollYProgress,
                            [start, end],
                            [0.15, 1]
                        );

                        return (
                            <motion.span
                                key={i}
                                style={{ opacity }}
                                className="text-[clamp(1.7rem,4vw,3.7rem)] font-semibold leading-[1.2] text-white"
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
                    className="mt-8 lg:mt-12"
                >
                    <Link
                        href="/about"
                        className="group inline-flex flex-col"
                    >
                        <span className="text-[18px] tracking-wider text-white/80 group-hover:text-accent transition-colors duration-300">
                            More About Us
                        </span>
                        <div className="h-px w-full bg-white/20 group-hover:bg-accent transition-colors duration-300 mt-1" />
                    </Link>
                </motion.div>
            </Container>
        </section>
    );
}
