"use client";

import { useRef, useEffect, useMemo, useState } from "react";

interface VimeoPreviewProps {
    vimeoId: string;
    isHovered: boolean;
}

export default function VimeoPreview({ vimeoId, isHovered }: VimeoPreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null);

    // 16:9 cards are the visual target on the homepage.
    // Scale preview to "cover" both narrower and wider source ratios.
    const previewScale = useMemo(() => {
        const CARD_ASPECT = 16 / 9;
        const OVERSCAN = 1.01; // 1% extra to hide edge slivers
        if (!videoAspectRatio) return OVERSCAN;

        // If source is narrower than card, scale by width ratio.
        if (videoAspectRatio < CARD_ASPECT) {
            return (CARD_ASPECT / videoAspectRatio) * OVERSCAN;
        }

        // If source is wider than card, scale by height ratio.
        if (videoAspectRatio > CARD_ASPECT) {
            return (videoAspectRatio / CARD_ASPECT) * OVERSCAN;
        }

        return OVERSCAN;
    }, [videoAspectRatio]);

    // When hover ends, pause and reset so next hover starts fresh
    useEffect(() => {
        const win = iframeRef.current?.contentWindow;
        if (!win) return;

        if (!isHovered) {
            win.postMessage({ method: "pause" }, "*");
            win.postMessage({ method: "setCurrentTime", value: 0 }, "*");
        } else {
            win.postMessage({ method: "play" }, "*");
        }
    }, [isHovered]);

    // Fetch Vimeo oEmbed metadata once so we can infer source aspect ratio.
    useEffect(() => {
        let cancelled = false;

        async function loadAspectRatio() {
            try {
                const res = await fetch(
                    `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(`https://vimeo.com/${vimeoId}`)}`
                );
                if (!res.ok) return;
                const data = await res.json();
                const width = Number(data?.width);
                const height = Number(data?.height);
                if (!cancelled && width > 0 && height > 0) {
                    setVideoAspectRatio(width / height);
                }
            } catch {
                // Ignore metadata failures; default scale=1 keeps existing behavior.
            }
        }

        loadAspectRatio();
        return () => {
            cancelled = true;
        };
    }, [vimeoId]);

    // With background=1&autoplay=1, Vimeo starts playing immediately (muted).
    // We keep the iframe always in the DOM so it preloads while the page loads.
    // On hover we just show it; on mouse leave we hide it.
    const src = `https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&loop=1&muted=1&byline=0&title=0&portrait=0&playsinline=1&api=1&autopause=0&controls=0`;

    return (
        <div
            aria-hidden="true"
            className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-300 ease-in-out ${isHovered ? "opacity-100" : "opacity-0"
                }`}
        >
            <iframe
                ref={iframeRef}
                src={src}
                allow="autoplay; fullscreen; picture-in-picture"
                style={{
                    border: "none",
                    width: "100%",
                    height: "100%",
                    display: "block",
                    transform: `scale(${previewScale})`,
                    transformOrigin: "center center",
                }}
                title="Video preview"
            />
        </div>
    );
}
