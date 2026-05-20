"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export interface TeamCardProps {
    role: string;
    nameLabel?: string;
    /** Key for `/images/team/tape/Tape_{key}.png` (e.g. "Mark", "Beatriz", "AJ"). */
    tapeKey?: string;
    /** Optional explicit list of photo URLs. Takes precedence over `photoPrefix`. */
    photos?: string[];
    /** Optional prefix in `/images/team/`. Generates `${prefix}_001.jpg` … `_003.jpg`. */
    photoPrefix?: string;
}

const FRAME_MS = 280; // ~3.5fps stop-motion feel (half speed)

const TAPE_W = 280;
const TAPE_H = 320;

export default function TeamCard({
    role,
    nameLabel,
    tapeKey,
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
    const displayName = (nameLabel?.trim() || role).trim();
    /** One description per card; stacked frames 2–3 are hidden from AT to avoid triple announcements. */
    const photoAlt = `Portrait of ${displayName}`;

    const tapeSrc = tapeKey ? `/images/team/tape/Tape_${tapeKey}.png` : null;

    return (
        <div className="flex flex-col">
            <div
                className="group relative aspect-[2/3] bg-[#D7CFC2] overflow-hidden"
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                onFocus={handleEnter}
                onBlur={handleLeave}
                tabIndex={hasPhotos ? 0 : -1}
                role={!hasPhotos ? "img" : undefined}
                aria-label={!hasPhotos ? photoAlt : undefined}
            >
                {hasPhotos
                    ? frames.map((src, idx) => (
                          <Image
                              key={src}
                              src={src}
                              alt={idx === 0 ? photoAlt : ""}
                              aria-hidden={idx !== 0}
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

                {/* Orange tint — photo area only on hover (tape stays above at z-[3]) */}
                {hasPhotos ? (
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 z-[2] bg-accent opacity-0 mix-blend-multiply transition-opacity duration-200 ease-out group-hover:opacity-70"
                    />
                ) : null}

                {tapeSrc ? (
                    <Image
                        src={tapeSrc}
                        alt=""
                        width={TAPE_W}
                        height={TAPE_H}
                        aria-hidden
                        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[3] w-full h-auto"
                        sizes="(max-width: 768px) 50vw, 16vw"
                    />
                ) : null}
            </div>
            <p
                className="mt-[10px] text-black/45"
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
