"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/*
 * LogoAnimation — High-Fidelity Intro
 */

// ── Animation Configuration ──────────────────────────────────
// Adjust these values manually to fine-tune the intro motion
const ANIM_CONFIG = {
  // Phase 1: Reveal
  revealDuration: 0.5,
  revealEase: "expo.out",
  revealStaggerBase: 0.05,

  // Phase 2: Squeeze & Scale
  squeezeDelay: 0.35,
  squeezeDuration: 0.3,
  logoScale: 2,
  scaleDuration: 0.3,
  pivotEase: "expo.inOut",

  // Color Invert (Middle of Phase 2)
  invertDelayOffset: 0.15,
  invertDuration: 0.12,

  // Phase 3: Final Wipe
  preWipeDelay: 0.5,
  wipeDuration: 0.7,
  wipeEase: "expo.inOut",
};

const CHARS = [
  { char: "T", keep: true, id: "T" },
  { char: "I", keep: false, id: "I" },
  { char: "N", keep: false, id: "N" },
  { char: "Y", keep: false, id: "Y" },
  { char: "\u2004", keep: false, isSpace: true, id: "SPC" },
  { char: "A", keep: true, id: "A" },
  { char: "R", keep: false, id: "R" },
  { char: "K", keep: false, id: "K" },
  { char: ".", keep: true, id: "DOT" },
];

export default function LogoAnimation({ onComplete }: { onComplete?: () => void }) {
  const [done, setDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRowRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    document.documentElement.classList.add("in-home");

    const container = containerRef.current;
    const textRow = textRowRef.current;
    if (!container || !textRow) return;

    const spans = charRefs.current;
    const visibleSpans = spans.filter(s => s !== null) as HTMLSpanElement[];
    const keepers = visibleSpans.filter((_, i) => CHARS[i].keep);
    const removable = visibleSpans.filter((_, i) => !CHARS[i].keep);

    // Initial state: letters below baseline
    gsap.set(visibleSpans, { yPercent: 120, opacity: 0 });

    // ── Timeline ─────────────────────────────────────────────────
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.classList.add("start-home");
        setDone(true);
        onComplete?.();
      }
    });

    // ── Phase 1: Reveal ──────────────────────────────────────────
    tl.addLabel("reveal");
    visibleSpans.forEach((s, i) => {
      tl.to(s, {
        yPercent: 0,
        opacity: 1,
        duration: ANIM_CONFIG.revealDuration,
        delay: i * ANIM_CONFIG.revealStaggerBase,
        ease: ANIM_CONFIG.revealEase,
      }, "reveal");
    });

    // ── Phase 2: Squeeze, Scale, and Invert ─────────────────────
    tl.addLabel("squeeze", `+=${ANIM_CONFIG.squeezeDelay}`);

    removable.forEach((s) => {
      tl.to(s, {
        width: 0,
        opacity: 0,
        margin: 0,
        padding: 0,
        duration: ANIM_CONFIG.squeezeDuration,
        ease: ANIM_CONFIG.pivotEase
      }, "squeeze");
    });

    tl.to(textRow, {
      scale: ANIM_CONFIG.logoScale,
      duration: ANIM_CONFIG.scaleDuration,
      ease: ANIM_CONFIG.pivotEase
    }, "squeeze");

    // Color Invert
    tl.to(container, {
      backgroundColor: "#fff",
      duration: ANIM_CONFIG.invertDuration,
      ease: "none"
    }, `squeeze+=${ANIM_CONFIG.invertDelayOffset}`);

    tl.to(keepers, {
      color: "#000",
      duration: ANIM_CONFIG.invertDuration,
      ease: "none"
    }, `squeeze+=${ANIM_CONFIG.invertDelayOffset}`);

    // ── Phase 3: The Single Wipe Reveal ──────────────────────────
    tl.addLabel("wipe", `+=${ANIM_CONFIG.preWipeDelay}`);

    tl.to(container, {
      clipPath: "inset(100% 0% 0% 0%)",
      duration: ANIM_CONFIG.wipeDuration,
      ease: ANIM_CONFIG.wipeEase
    }, "wipe");

    return () => { tl.kill(); };
  }, [onComplete]);

  if (done) return null;

  const maskStyle: React.CSSProperties = {
    display: "inline-block",
    overflow: "hidden",
    verticalAlign: "baseline",
  };

  const letterStyle: React.CSSProperties = {
    display: "inline-block",
    fontFamily: '"tenon", "Inter", sans-serif',
    fontWeight: 800,
    fontSize: "clamp(8rem, 20vw, 20rem)",
    lineHeight: 1,
    color: "#fff",
    willChange: "transform, opacity, width",
    letterSpacing: "0.04em",
    WebkitFontSmoothing: "antialiased",
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        clipPath: "inset(0% 0% 0% 0%)",
      }}
    >
      <div
        ref={textRowRef}
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          position: "relative",
          pointerEvents: "none",
        }}
      >
        {CHARS.map((c, i) => (
          <div key={`mask-${i}`} style={maskStyle}>
            <span
              ref={(el) => { charRefs.current[i] = el; }}
              style={letterStyle}
            >
              {c.char}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
