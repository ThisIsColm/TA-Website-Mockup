"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";

const VIMEO_ORIGIN = "https://player.vimeo.com";

function vimeoMessage(payload: Record<string, unknown>) {
    return JSON.stringify(payload);
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
    posterSrc = "/images/Hero-Loading_V1.png",
}: VideoHeroProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [videoReady, setVideoReady] = useState(false);
    const revealedRef = useRef(false);

    const revealVideo = useCallback(() => {
        if (revealedRef.current) return;
        revealedRef.current = true;
        setVideoReady(true);
    }, []);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== VIMEO_ORIGIN) return;

            let data: { event?: string; method?: string };
            try {
                data = JSON.parse(event.data);
            } catch {
                return;
            }

            const win = iframeRef.current?.contentWindow;
            if (!win) return;

            if (data.event === "ready") {
                win.postMessage(
                    vimeoMessage({ method: "addEventListener", value: "play" }),
                    VIMEO_ORIGIN
                );
            }

            // Only drop the poster once playback has started (iframe has real frames)
            if (data.event === "play") {
                revealVideo();
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [revealVideo]);

    // Safety net only — should not be the primary path
    useEffect(() => {
        const fallback = window.setTimeout(revealVideo, 4000);
        return () => window.clearTimeout(fallback);
    }, [revealVideo]);

    const hashParam = vimeoHash ? `h=${vimeoHash}&` : "";
    const iframeSrc = `https://player.vimeo.com/video/${vimeoId}?${hashParam}background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0&api=1`;

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

            {/* Poster stays until play — then removed instantly (no fade through black) */}
            {!videoReady && (
                <div className="absolute inset-0 z-20">
                    <Image
                        src={posterSrc}
                        alt=""
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                    />

                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5">
                        <div
                            className="h-10 w-10 animate-spin rounded-full border-2 border-white/25 border-t-white"
                            role="status"
                            aria-label="Loading video"
                        />
                        <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/80">
                            Loading
                        </span>
                    </div>
                </div>
            )}
        </section>
    );
}
