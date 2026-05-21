"use client";

import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type MutableRefObject,
} from "react";

interface LottieFromUrlProps {
    src: string;
    loop?: boolean;
    autoplay?: boolean;
    className?: string;
    style?: CSSProperties;
    lottieRef?: MutableRefObject<LottieRefCurrentProps | null>;
}

export default function LottieFromUrl({
    src,
    loop = true,
    autoplay = true,
    className,
    style,
    lottieRef,
}: LottieFromUrlProps) {
    const [animationData, setAnimationData] = useState<object | null>(null);
    const internalRef = useRef<LottieRefCurrentProps>(null);
    const ref = lottieRef ?? internalRef;

    useEffect(() => {
        let cancelled = false;

        fetch(src)
            .then((response) => response.json())
            .then((json) => {
                if (!cancelled) setAnimationData(json);
            })
            .catch((err) => {
                console.error(`[LottieFromUrl] Failed to load ${src}:`, err);
            });

        return () => {
            cancelled = true;
        };
    }, [src]);

    if (!animationData) {
        return (
            <div
                aria-hidden
                className={className}
                style={style}
            />
        );
    }

    return (
        <Lottie
            lottieRef={ref}
            animationData={animationData}
            loop={loop}
            autoplay={autoplay}
            className={className}
            style={style}
        />
    );
}
