"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import {
    INSIGHTS_EYE_LOTTIE,
    INSIGHTS_EYE_LOOP_SEGMENT,
    normalizeLottieLoop,
} from "@/lib/insightsLottie";

interface InsightsPostThumbnailProps {
    coverImage: string;
    title: string;
    hovered?: boolean;
}

export default function InsightsPostThumbnail({
    coverImage,
    title,
    hovered = false,
}: InsightsPostThumbnailProps) {
    const lottieRef = useRef<LottieRefCurrentProps>(null);
    const [animationData, setAnimationData] = useState<object | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetch(INSIGHTS_EYE_LOTTIE)
            .then((response) => response.json())
            .then((json) => {
                if (!cancelled) setAnimationData(normalizeLottieLoop(json));
            })
            .catch((err) => {
                console.error("[InsightsPostThumbnail] Failed to load eye Lottie:", err);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (hovered) {
            lottieRef.current?.playSegments(INSIGHTS_EYE_LOOP_SEGMENT, true);
        } else {
            lottieRef.current?.stop();
            lottieRef.current?.goToAndStop(0, true);
        }
    }, [hovered]);

    return (
        <div
            data-header-surface="dark"
            className="relative w-full aspect-[535/325] overflow-hidden bg-[#D7CFC2]"
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
                        hovered ? "opacity-100" : "opacity-0"
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
                            initialSegment={INSIGHTS_EYE_LOOP_SEGMENT}
                            className="h-1/2 w-1/2"
                        />
                    </div>
                </div>
            ) : null}
        </div>
    );
}
