"use client";

import { useState } from "react";
import Image from "next/image";
import { getTeamPhotoPair } from "@/lib/teamPhotos";
import { typeClass } from "@/lib/typographyStyles";

export interface TeamCardProps {
    role: string;
    nameLabel?: string;
    /** Key for `/images/team/tape/{key}_Tape.webp` (e.g. "Mark", "Beatriz", "AJ"). */
    tapeKey?: string;
    /** [default, hover] — takes precedence over `photoPrefix`. */
    photos?: [string, string] | string[];
    /** Builds `_001` (default) + `_002` (hover) from `/images/team/`. */
    photoPrefix?: string;
}

const TAPE_W = 800;
const TAPE_H = 1200;

export default function TeamCard({
    role,
    nameLabel,
    tapeKey,
    photos,
    photoPrefix,
}: TeamCardProps) {
    const frames: string[] =
        photos && photos.length > 0
            ? photos.slice(0, 2)
            : photoPrefix
              ? [...getTeamPhotoPair(photoPrefix)]
              : [];

    const [hovering, setHovering] = useState(false);
    const active = hovering && frames.length > 1 ? 1 : 0;

    const hasPhotos = frames.length > 0;
    const displayName = (nameLabel?.trim() || role).trim();
    const photoAlt = `Portrait of ${displayName}`;

    const tapeSrc = tapeKey ? `/images/team/tape/${tapeKey}_Tape.webp` : null;

    return (
        <div className="flex flex-col">
            <div
                className="group relative aspect-[2/3] bg-[#D7CFC2] overflow-hidden"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                onFocus={() => setHovering(true)}
                onBlur={() => setHovering(false)}
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
                              className="object-cover transition-opacity duration-200 ease-out motion-reduce:transition-none"
                              sizes="(max-width: 768px) 50vw, 16vw"
                              style={{
                                  opacity: idx === active ? 1 : 0,
                                  zIndex: idx === active ? 1 : 0,
                              }}
                          />
                      ))
                    : null}

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
            <p className={`mt-[10px] text-[#353535] ${typeClass("about.teamRole")}`}>
                {role}
            </p>
        </div>
    );
}
