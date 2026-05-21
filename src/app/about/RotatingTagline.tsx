"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { typeClass } from "@/lib/typographyStyles";

const PHRASES = [
    "create captivating commercials.",
    "tell compelling brand stories.",
    "produce premium digital content.",
    "craft cinematic experiences.",
    "shape moments that matter.",
];

export default function RotatingTagline() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => {
            setIndex((i) => (i + 1) % PHRASES.length);
        }, 2800);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="text-black">
            <span
                className={`block ${typeClass("about.rotatingTaglineLead")}`}
            >
                People work with us to
            </span>
            <span
                className={`relative block min-h-[1.278em] text-accent ${typeClass("about.rotatingTaglineAccent")}`}
            >
                <AnimatePresence mode="wait">
                    <motion.span
                        key={index}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
                        className="inline-block"
                    >
                        {PHRASES[index]}
                    </motion.span>
                </AnimatePresence>
            </span>
        </div>
    );
}
