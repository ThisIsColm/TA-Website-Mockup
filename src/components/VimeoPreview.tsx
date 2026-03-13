"use client";

import { useRef, useEffect } from "react";

interface VimeoPreviewProps {
    vimeoId: string;
    isHovered: boolean;
}

export default function VimeoPreview({ vimeoId, isHovered }: VimeoPreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

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
                style={{ border: "none", width: "100%", height: "100%", display: "block" }}
                title="Video preview"
            />
        </div>
    );
}
