"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface TeamCardProps {
    role: string;
    nameLabel?: string;
    /** Optional explicit list of photo URLs. Takes precedence over `photoPrefix`. */
    photos?: string[];
    /** Optional prefix in `/images/team/`. Generates `${prefix}_001.jpg` … `_003.jpg`. */
    photoPrefix?: string;
}

const FRAME_MS = 280; // ~3.5fps stop-motion feel (half speed)

export default function TeamCard({
    role,
    nameLabel,
    photos,
    photoPrefix,
}: TeamCardProps) {
    const frames =
        photos && photos.length > 0
            ? photos
            : photoPrefix
              ? [
                    `/images/team/${photoPrefix}_001.jpg`,
                    `/images/team/${photoPrefix}_002.jpg`,
                    `/images/team/${photoPrefix}_003.jpg`,
                ]
              : [];

    const [active, setActive] = useState(0);
    const [hovering, setHovering] = useState(false);
    const intervalRef = useRef<number | null>(null);
    const directionRef = useRef(1);

    useEffect(() => {
        if (!hovering || frames.length <= 1) return;
        directionRef.current = 1;
        intervalRef.current = window.setInterval(() => {
            setActive((i) => {
                const last = frames.length - 1;
                let next = i + directionRef.current;
                if (next > last) {
                    directionRef.current = -1;
                    next = last - 1;
                } else if (next < 0) {
                    directionRef.current = 1;
                    next = 1;
                }
                return next;
            });
        }, FRAME_MS);
        return () => {
            if (intervalRef.current !== null) {
                window.clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [hovering, frames.length]);

    const handleEnter = () => {
        directionRef.current = 1;
        setHovering(true);
    };
    const handleLeave = () => {
        setHovering(false);
        setActive(0);
        directionRef.current = 1;
    };

    const hasPhotos = frames.length > 0;
    const alt = nameLabel || role;

    return (
        <div className="flex flex-col">
            <div
                className="group relative aspect-[2/3] bg-[#D7CFC2] overflow-hidden"
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                onFocus={handleEnter}
                onBlur={handleLeave}
                tabIndex={hasPhotos ? 0 : -1}
            >
                {hasPhotos
                    ? frames.map((src, idx) => (
                          <Image
                              key={src}
                              src={src}
                              alt={idx === 0 ? alt : ""}
                              fill
                              priority={idx === 0}
                              className="object-cover"
                              sizes="(max-width: 768px) 50vw, 16vw"
                              style={{
                                  opacity: idx === active ? 1 : 0,
                                  zIndex: idx === active ? 1 : 0,
                              }}
                          />
                      ))
                    : null}

                {/* Orange tint overlay — only shows on hover, and only if photos exist */}
                {hasPhotos ? (
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-[2] bg-accent opacity-0 mix-blend-multiply transition-opacity duration-200 ease-out group-hover:opacity-70"
                    />
                ) : null}

                {/* Name label — sits above the tint */}
                {nameLabel ? (
                    <div
                        className="absolute left-[10px] bottom-[12px] z-[3] bg-accent text-white -rotate-[3deg] px-[10px] py-[4px] shadow-[0_2px_6px_rgba(0,0,0,0.18)]"
                        style={{
                            fontFamily: "Tenon, sans-serif",
                            fontStyle: "italic",
                            fontWeight: 700,
                            fontSize: "clamp(0.85rem, 1vw, 16px)",
                            letterSpacing: "0.02em",
                        }}
                    >
                        {nameLabel}
                    </div>
                ) : null}
            </div>
            <p
                className="mt-[10px] text-black"
                style={{
                    fontFamily: "Tenon, sans-serif",
                    fontSize: "clamp(0.875rem, 1.15vw, 22px)",
                    fontWeight: 400,
                    fontStyle: "normal",
                    lineHeight: "30px",
                    letterSpacing: "-0.02em",
                }}
            >
                {role}
            </p>
        </div>
    );
}
