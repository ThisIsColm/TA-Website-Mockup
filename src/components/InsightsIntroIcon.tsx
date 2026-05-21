"use client";

import type { CSSProperties } from "react";
import LottieFromUrl from "@/components/LottieFromUrl";
import { INSIGHTS_COG_LOTTIE } from "@/lib/insightsLottie";

interface InsightsIntroIconProps {
    className?: string;
    style?: CSSProperties;
}

/** Figma: 204×204px cog/head mark — loops via Lottie. */
export default function InsightsIntroIcon({
    className,
    style,
}: InsightsIntroIconProps) {
    return (
        <div aria-hidden className={className} style={style}>
            <LottieFromUrl
                src={INSIGHTS_COG_LOTTIE}
                loop
                autoplay
                className="h-full w-full"
                style={{ width: "100%", height: "100%" }}
            />
        </div>
    );
}
