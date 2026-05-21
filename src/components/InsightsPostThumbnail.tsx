"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const SQUIGGLE_FRAMES = [
    "/images/Insights_Hover_001.png",
    "/images/Insights_Hover_002.png",
    "/images/Insights_Hover_003.png",
] as const;

const FRAME_MS = 500; // 2fps stop-motion

interface InsightsPostThumbnailProps {
    coverImage: string;
    title: string;
}

export default function InsightsPostThumbnail({
    coverImage,
    title,
}: InsightsPostThumbnailProps) {
    const [hovering, setHovering] = useState(false);
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (!hovering) return;

        const id = window.setInterval(() => {
            setActive((i) => (i + 1) % SQUIGGLE_FRAMES.length);
        }, FRAME_MS);

        return () => window.clearInterval(id);
    }, [hovering]);

    const handleEnter = () => setHovering(true);
    const handleLeave = () => {
        setHovering(false);
        setActive(0);
    };

    return (
        <div
            data-header-surface="dark"
            className="relative w-full aspect-[535/325] overflow-hidden bg-[#D7CFC2]"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            {coverImage ? (
                <Image
                    src={coverImage}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 33vw, 30vw"
                />
            ) : null}

            <div
                className={`pointer-events-none absolute inset-[1%] z-10 transition-opacity duration-300 ease-out ${
                    hovering ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden
            >
                {SQUIGGLE_FRAMES.map((src, idx) => (
                    <Image
                        key={src}
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 33vw, 30vw"
                        style={{
                            opacity: idx === active ? 1 : 0,
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
