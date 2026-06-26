"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
    DotLottieReact,
    type DotLottie,
} from "@lottiefiles/dotlottie-react";
import { HERO_LOADING_LOTTIE, HERO_LOADING_POSTER } from "@/lib/heroLottie";

// ─── Vimeo / poster constants ────────────────────────────────────────────
const VIMEO_ORIGIN = "https://player.vimeo.com";
/** One frame at 30fps — poster matches frame 0, so reveal while still at the start. */
const FRAME_ZERO_SECONDS = 1 / 30;
const POSTER_COLOR_FADE_MS = 1800;

// ─── Loader progress controller ──────────────────────────────────────────
/** Hard cutoff: force readiness so the loader never stays forever. */
const READINESS_TIMEOUT_MS = 6000;
/** Phase 1 — animate progress from 0 → HOLD_PROGRESS (the "fake progress" ramp). */
const FAKE_PROGRESS_DURATION_MS = 2200;
const FAKE_PROGRESS_DURATION_REDUCED_MS = 600;
/** Where the loader pauses while waiting for real readiness signals (0–1). */
const HOLD_PROGRESS = 0.92;
/** Phase 3 — final ramp from HOLD_PROGRESS → 1.0 once everything is ready. */
const FINISH_DURATION_MS = 480;
const FINISH_DURATION_REDUCED_MS = 200;
/** Cross-fade the loader overlay out after it hits 100%. */
const LOADER_FADE_MS = 420;

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

/** Smooth deceleration — no overshoot, no flat tail. */
function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

interface VideoHeroProps {
    vimeoId: string;
    vimeoHash?: string;
    title?: string;
    /** Poster image (export first frame of the hero video). */
    posterSrc?: string;
}

/**
 * Hero section with a Lottie-driven loader that gates the background Vimeo
 * reveal. The Lottie plays as a controlled progress bar (frame = progress *
 * totalFrames) so its motion stays in sync with real readiness signals:
 *
 *   1. Phase 1 — ease 0 → 92% over ~2.2s (always feels active).
 *   2. Phase 2 — hold at 92% until window load, fonts, and Vimeo are ready.
 *   3. Phase 3 — ramp 92% → 100% over ~480ms.
 *   4. Fade loader out, then cut the poster overlay so the video is revealed.
 *
 * A 6s hard timeout force-completes readiness so a stalled asset can never
 * leave the loader stuck. Respects `prefers-reduced-motion`.
 */
export default function VideoHero({
    vimeoId,
    vimeoHash,
    title = "Background Video",
    posterSrc = HERO_LOADING_POSTER,
}: VideoHeroProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [showOverlay, setShowOverlay] = useState(true);
    const [loaderMounted, setLoaderMounted] = useState(true);
    const [loaderFading, setLoaderFading] = useState(false);
    const [posterInColor, setPosterInColor] = useState(false);

    const revealedRef = useRef(false);

    // Readiness inputs (set by their respective listeners below).
    const videoReadyRef = useRef(false);
    const pageReadyRef = useRef(false);
    const fontsReadyRef = useRef(false);

    // Lottie player + animation state — kept in refs so the rAF loop never
    // needs to re-subscribe; the progress curve runs continuously from mount.
    const dotLottieRef = useRef<DotLottie | null>(null);
    const totalFramesRef = useRef<number | null>(null);
    const progressRef = useRef(0);
    const finishingRef = useRef(false);
    const rafRef = useRef<number | null>(null);
    const reducedMotionRef = useRef(false);

    // Fade the poster from desaturated to colour as soon as the section mounts.
    useEffect(() => {
        const frame = requestAnimationFrame(() => setPosterInColor(true));
        return () => cancelAnimationFrame(frame);
    }, []);

    // Capture user motion preference once; shortens loader timings when set.
    useEffect(() => {
        if (typeof window === "undefined") return;
        const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
        reducedMotionRef.current = mq.matches;
        const onChange = (e: MediaQueryListEvent) => {
            reducedMotionRef.current = e.matches;
        };
        mq.addEventListener("change", onChange);
        return () => mq.removeEventListener("change", onChange);
    }, []);

    /** Push the current `progressRef` (0–1) into the Lottie by setting its frame. */
    const renderLottieFrame = useCallback(() => {
        const player = dotLottieRef.current;
        const total = totalFramesRef.current;
        if (!player || !total) return;
        const frame = Math.max(
            0,
            Math.min(total - 1, progressRef.current * (total - 1))
        );
        player.setFrame(frame);
    }, []);

    /**
     * Pause the Vimeo player and rewind to the first frame. Called at the
     * start of phase 3 so the seek has time to settle before we reveal —
     * otherwise the video shows several seconds in (autoplay starts the moment
     * the iframe mounts, which is well before the loader finishes).
     */
    const seekVideoToStart = useCallback(() => {
        const win = iframeRef.current?.contentWindow;
        if (!win) return;
        win.postMessage(vimeoMessage({ method: "pause" }), VIMEO_ORIGIN);
        win.postMessage(
            vimeoMessage({ method: "setCurrentTime", value: 0 }),
            VIMEO_ORIGIN
        );
    }, []);

    /** Resume Vimeo playback (sent just before the poster overlay lifts). */
    const playVideo = useCallback(() => {
        const win = iframeRef.current?.contentWindow;
        if (!win) return;
        win.postMessage(vimeoMessage({ method: "play" }), VIMEO_ORIGIN);
    }, []);

    /** Fade out the loader overlay, then unmount it and reveal the video. */
    const revealVideo = useCallback(() => {
        if (revealedRef.current) return;
        revealedRef.current = true;

        // Trigger the opacity transition on the Lottie overlay…
        setLoaderFading(true);

        // Kick the video back into motion partway through the fade so the
        // Vimeo player has time to actually resume playback before the
        // poster lifts. Lands the visible video very close to frame 0.
        const playLeadMs = Math.max(0, LOADER_FADE_MS - 150);
        window.setTimeout(playVideo, playLeadMs);

        // …once it has faded, unmount the loader and cut to the video.
        window.setTimeout(() => {
            setLoaderMounted(false);
            afterNextPaint(() => setShowOverlay(false));
        }, LOADER_FADE_MS);
    }, [playVideo]);

    /** Phase 3: animate the final HOLD_PROGRESS → 1.0 ramp, then trigger reveal. */
    const startFinishRamp = useCallback(() => {
        if (finishingRef.current) return;
        finishingRef.current = true;

        // Rewind the background video so it starts at frame 0 when revealed.
        seekVideoToStart();

        const start = progressRef.current;
        const target = 1;
        const duration = reducedMotionRef.current
            ? FINISH_DURATION_REDUCED_MS
            : FINISH_DURATION_MS;
        const t0 = performance.now();

        const tick = (now: number) => {
            const t = Math.min(1, (now - t0) / duration);
            progressRef.current = start + (target - start) * easeOutCubic(t);
            renderLottieFrame();
            if (t < 1) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                revealVideo();
            }
        };

        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(tick);
    }, [renderLottieFrame, revealVideo, seekVideoToStart]);

    /** Snapshot of every readiness flag — true once all three have fired. */
    const checkReadiness = useCallback(() => {
        return (
            videoReadyRef.current &&
            pageReadyRef.current &&
            fontsReadyRef.current
        );
    }, []);

    /**
     * Main progress controller. Single rAF loop that owns phases 1 and 2:
     *   Phase 1 — ease-out 0 → HOLD_PROGRESS over the configured duration.
     *   Phase 2 — hold at HOLD_PROGRESS, polling readiness each frame.
     * Once readiness fires, `startFinishRamp` takes over (phase 3).
     */
    useEffect(() => {
        const duration = reducedMotionRef.current
            ? FAKE_PROGRESS_DURATION_REDUCED_MS
            : FAKE_PROGRESS_DURATION_MS;
        const t0 = performance.now();

        const tick = (now: number) => {
            if (finishingRef.current) return;

            const elapsed = now - t0;
            if (elapsed < duration) {
                // Phase 1 — ease-out toward the hold point.
                const t = elapsed / duration;
                progressRef.current = easeOutCubic(t) * HOLD_PROGRESS;
                renderLottieFrame();
                rafRef.current = requestAnimationFrame(tick);
                return;
            }

            // Phase 2 — pin to the hold point and poll readiness.
            progressRef.current = HOLD_PROGRESS;
            renderLottieFrame();
            if (checkReadiness()) {
                startFinishRamp();
            } else {
                rafRef.current = requestAnimationFrame(tick);
            }
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [renderLottieFrame, checkReadiness, startFinishRamp]);

    /**
     * Capture the Lottie player when it mounts and prepare it for manual
     * control: pause its internal playback, record totalFrames, then let the
     * rAF loop drive the visible frame.
     */
    const handleDotLottieRef = useCallback(
        (player: DotLottie | null) => {
            dotLottieRef.current = player;
            if (!player) return;

            const init = () => {
                const total = player.totalFrames;
                if (!total) return;
                totalFramesRef.current = total;
                player.pause();
                renderLottieFrame();
            };

            // `load` fires when the animation has been parsed and is ready.
            const onLoad = () => init();
            player.addEventListener("load", onLoad);
            // Some builds parse synchronously — try once immediately too.
            init();
        },
        [renderLottieFrame]
    );

    // ─── Readiness inputs ────────────────────────────────────────────────

    const markVideoReady = useCallback(() => {
        videoReadyRef.current = true;
    }, []);

    // window 'load' — document + sub-resources are loaded.
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (document.readyState === "complete") {
            pageReadyRef.current = true;
            return;
        }
        const onLoad = () => {
            pageReadyRef.current = true;
        };
        window.addEventListener("load", onLoad, { once: true });
        return () => window.removeEventListener("load", onLoad);
    }, []);

    // CSS Font Loading API — block until web fonts are usable so text doesn't
    // re-flow into a different font right after the loader leaves.
    useEffect(() => {
        if (typeof document === "undefined" || !("fonts" in document)) {
            fontsReadyRef.current = true;
            return;
        }
        let cancelled = false;
        document.fonts.ready.then(() => {
            if (!cancelled) fontsReadyRef.current = true;
        });
        return () => {
            cancelled = true;
        };
    }, []);

    // Vimeo iframe handshake — mark video ready on `play` or once `timeupdate`
    // reports a position near frame 0 (so the video is actually rendering).
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
                win.postMessage(
                    vimeoMessage({ method: "addEventListener", value: "timeupdate" }),
                    VIMEO_ORIGIN
                );
                win.postMessage(
                    vimeoMessage({ method: "addEventListener", value: "play" }),
                    VIMEO_ORIGIN
                );
                win.postMessage(vimeoMessage({ method: "play" }), VIMEO_ORIGIN);
                return;
            }
            if (data.event === "play") markVideoReady();
            if (
                data.event === "timeupdate" &&
                typeof data.data?.seconds === "number" &&
                data.data.seconds <= FRAME_ZERO_SECONDS
            ) {
                markVideoReady();
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [markVideoReady]);

    // Safety net — force all readiness flags after a timeout so the loader is
    // never stuck waiting on a missing/blocked asset (e.g. Vimeo unreachable).
    useEffect(() => {
        const fallback = window.setTimeout(() => {
            videoReadyRef.current = true;
            pageReadyRef.current = true;
            fontsReadyRef.current = true;
        }, READINESS_TIMEOUT_MS);
        return () => window.clearTimeout(fallback);
    }, []);

    const hashParam = vimeoHash ? `h=${vimeoHash}&` : "";
    const iframeSrc = `https://player.vimeo.com/video/${vimeoId}?${hashParam}background=1&autoplay=1&loop=1&muted=1&playsinline=1&autopause=0&controls=0&api=1`;

    return (
        <section
            data-header-surface="dark"
            className="relative h-screen w-full overflow-hidden bg-black"
        >
            {/* Vimeo mounts immediately so it can buffer while the loader runs.
                The black overlay above hides any thumbnail bleed until reveal. */}
            <div
                className={`absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-0 ${
                    showOverlay ? "opacity-0" : "opacity-100"
                }`}
                aria-hidden={showOverlay}
            >
                <iframe
                    ref={iframeRef}
                    src={iframeSrc}
                    className="absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
                    allow="autoplay; fullscreen; picture-in-picture"
                    title={title}
                    tabIndex={showOverlay ? -1 : undefined}
                />
            </div>

            {showOverlay && (
                <div
                    className="absolute inset-0 z-20 bg-black"
                    aria-busy={!revealedRef.current}
                >
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

                    {loaderMounted ? (
                        <div
                            className="absolute inset-0 z-30 flex items-center justify-center transition-opacity ease-out motion-reduce:transition-none"
                            style={{
                                opacity: loaderFading ? 0 : 1,
                                transitionDuration: `${LOADER_FADE_MS}ms`,
                            }}
                            role="status"
                            aria-live="polite"
                            aria-label="Loading"
                        >
                            <DotLottieReact
                                src={HERO_LOADING_LOTTIE}
                                loop={false}
                                autoplay={false}
                                dotLottieRefCallback={handleDotLottieRef}
                                aria-hidden
                                className="h-[clamp(96px,12vw,160px)] w-[clamp(96px,12vw,160px)]"
                            />
                        </div>
                    ) : null}
                </div>
            )}
        </section>
    );
}
