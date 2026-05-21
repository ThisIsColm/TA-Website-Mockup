"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { INSIGHTS_EYE_LOTTIE } from "@/lib/insightsLottie";

interface InsightsPostThumbnailProps {
    coverImage: string;
    title: string;
}

export default function InsightsPostThumbnail({
    coverImage,
    title,
}: InsightsPostThumbnailProps) {
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const [animationData, setAnimationData] = useState<object | null>(null);
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        let cancelled = false;

        fetch(INSIGHTS_EYE_LOTTIE)
            .then((response) => response.json())
            .then((json) => {
                if (!cancelled) setAnimationData(json);
            })
            .catch((err) => {
                console.error("[InsightsPostThumbnail] Failed to load eye Lottie:", err);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const handleEnter = () => {
        setHovering(true);
        lottieRef.current?.goToAndPlay(0, true);
    };

    const handleLeave = () => {
        setHovering(false);
        lottieRef.current?.stop();
        lottieRef.current?.goToAndStop(0, true);
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

            {animationData ? (
                <div
                    className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 ease-out ${
                        hovering ? "opacity-100" : "opacity-0"
                    }`}
                    aria-hidden
                >
                    <div className="absolute inset-0 bg-white/85" />
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <Lottie
                            lottieRef={lottieRef}
                            animationData={animationData}
                            loop
                            autoplay={false}
                            className="h-1/2 w-1/2"
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}
