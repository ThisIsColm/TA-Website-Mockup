"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
    DotLottieReact,
    type DotLottie,
} from "@lottiefiles/dotlottie-react";
import { HERO_LOADING_LOTTIE, HERO_LOADING_POSTER } from "@/lib/heroLottie";

const VIMEO_ORIGIN = "https://player.vimeo.com";
/** One frame at 30fps — poster is frame 0, so reveal while still at the start. */
const FRAME_ZERO_SECONDS = 1 / 30;
const POSTER_COLOR_FADE_MS = 1800;

interface VimeoMessage {
    event?: string;
    data?: { seconds?: number };
}

function vimeoMessage(payload: Record<string, unknown>) {
    return JSON.stringify(payload);
}

/** Wait for the browser to paint the iframe before removing the matching poster. */
function afterNextPaint(callback: () => void) {
    requestAnimationFrame(() => {
        requestAnimationFrame(callback);
    });
}

interface VideoHeroProps {
    vimeoId: string;
    vimeoHash?: string;
    title?: string;
    /** Poster image (export first frame of the hero video). */
    posterSrc?: string;
}

export default function VideoHero({
    vimeoId,
    vimeoHash,
    title = "Background Video",
    posterSrc = HERO_LOADING_POSTER,
}: VideoHeroProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [showOverlay, setShowOverlay] = useState(true);
    const [posterInColor, setPosterInColor] = useState(false);
    const [lottieComplete, setLottieComplete] = useState(false);
    const [dotLottie, setDotLottie] = useState<DotLottie | null>(null);

    const vimeoReadyRef = useRef(false);
    const playStartedRef = useRef(false);
    const revealedRef = useRef(false);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setPosterInColor(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    useEffect(() => {
        if (!dotLottie) return;

        const onComplete = () => setLottieComplete(true);
        dotLottie.addEventListener("complete", onComplete);
        return () => dotLottie.removeEventListener("complete", onComplete);
    }, [dotLottie]);

    const revealPoster = useCallback(() => {
        if (revealedRef.current) return;
        revealedRef.current = true;
        afterNextPaint(() => setShowOverlay(false));
    }, []);

    const startVideo = useCallback(() => {
        if (playStartedRef.current) return;
        playStartedRef.current = true;

        const win = iframeRef.current?.contentWindow;
        if (!win) return;

        win.postMessage(
            vimeoMessage({ method: "setCurrentTime", value: 0 }),
            VIMEO_ORIGIN
        );
        win.postMessage(vimeoMessage({ method: "play" }), VIMEO_ORIGIN);
    }, []);

    const tryStartVideo = useCallback(() => {
        if (!lottieComplete || !vimeoReadyRef.current) return;
        startVideo();
    }, [lottieComplete, startVideo]);

    useEffect(() => {
        tryStartVideo();
    }, [tryStartVideo]);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== VIMEO_ORIGIN) return;

            let data: VimeoMessage;
            try {
                data = JSON.parse(event.data);
            } catch {
                return;
            }

            const win = iframeRef.current?.contentWindow;
            if (!win) return;

            if (data.event === "ready") {
                vimeoReadyRef.current = true;
                win.postMessage(
                    vimeoMessage({ method: "setCurrentTime", value: 0 }),
                    VIMEO_ORIGIN
                );
                for (const value of ["playing", "timeupdate"] as const) {
                    win.postMessage(
                        vimeoMessage({ method: "addEventListener", value }),
                        VIMEO_ORIGIN
                    );
                }
                tryStartVideo();
            }

            if (!playStartedRef.current) return;

            if (data.event === "playing") {
                revealPoster();
            }

            if (
                data.event === "timeupdate" &&
                typeof data.data?.seconds === "number" &&
                data.data.seconds <= FRAME_ZERO_SECONDS
            ) {
                revealPoster();
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [revealPoster, tryStartVideo]);

    useEffect(() => {
        const fallback = window.setTimeout(() => {
            setLottieComplete(true);
            startVideo();
            revealPoster();
        }, 6000);
        return () => window.clearTimeout(fallback);
    }, [revealPoster, startVideo]);

    const hashParam = vimeoHash ? `h=${vimeoHash}&` : "";
    const iframeSrc = `https://player.vimeo.com/video/${vimeoId}?${hashParam}background=1&autoplay=0&loop=1&muted=1&playsinline=1&autopause=0&api=1`;

    return (
        <section
            data-header-surface="dark"
            className="relative h-screen w-full overflow-hidden bg-black"
        >
            <div className="absolute inset-0 h-full w-full pointer-events-none">
                <iframe
                    ref={iframeRef}
                    src={iframeSrc}
                    className="absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
                    allow="autoplay; fullscreen; picture-in-picture"
                    title={title}
                />
            </div>

            {showOverlay && (
                <div className="absolute inset-0 z-20">
                    <Image
                        src={posterSrc}
                        alt=""
                        fill
                        priority
                        unoptimized
                        className={`object-cover transition-[filter] ease-out motion-reduce:transition-none ${
                            posterInColor
                                ? "grayscale-0 brightness-100"
                                : "grayscale brightness-50"
                        }`}
                        style={{ transitionDuration: `${POSTER_COLOR_FADE_MS}ms` }}
                        sizes="100vw"
                    />

                    <div
                        className="absolute inset-0 z-30 flex items-center justify-center"
                        role="status"
                        aria-label="Loading video"
                    >
                        <DotLottieReact
                            src={HERO_LOADING_LOTTIE}
                            loop={false}
                            autoplay
                            dotLottieRefCallback={setDotLottie}
                            aria-hidden
                            className="h-[clamp(96px,12vw,160px)] w-[clamp(96px,12vw,160px)]"
                        />
                    </div>
                </div>
            )}
        </section>
    );
}
