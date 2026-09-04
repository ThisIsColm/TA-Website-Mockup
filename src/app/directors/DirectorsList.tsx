"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DIRECTOR_PAGES_ENABLED, type Director } from "@/lib/directorsShared";
import { typeClass } from "@/lib/typographyStyles";

/** Stills fill the left column top-to-bottom, then the right column. */
const LEFT_SLOTS = [0, 1];
const RIGHT_SLOTS = [2, 3];

/**
 * The design puts the stills in columns 1–2 and 5–6 of the 6-col grid with a
 * 48px gutter at the 1920 reference (2.5vw), leaving columns 3–4 plus both
 * flanking gutters for the names. Stills are 16:9 and stacked 11.5px apart
 * (0.6vw), and the pair is centred against the full height of the name list.
 */
const COLUMN_GUTTER = "gap-x-[2.5vw]";
const STILL_GAP = "gap-y-[0.6vw]";

/** Stills are 536px wide at 1920 — 27.9vw. */
const STILL_SIZES = "28vw";

const NAME_CLASS = typeClass("directors.name");

interface StillColumnProps {
    slots: number[];
    directors: Director[];
    activeIndex: number | null;
    /** Stills stay unmounted until preloading starts, keeping the first paint light. */
    warm: boolean;
}

function StillColumn({ slots, directors, activeIndex, warm }: StillColumnProps) {
    return (
        <div
            aria-hidden="true"
            className={`hidden md:col-span-2 md:flex md:flex-col ${STILL_GAP}`}
        >
            {slots.map((slot) => (
                <div key={slot} className="relative aspect-video overflow-hidden">
                    {warm
                        ? directors.map((director, index) => {
                              const src = director.stills[slot];
                              if (!src) return null;

                              return (
                                  <Image
                                      key={director.id}
                                      src={src}
                                      alt=""
                                      fill
                                      sizes={STILL_SIZES}
                                      loading="eager"
                                      fetchPriority="low"
                                      className="object-cover transition-opacity duration-200 ease-out motion-reduce:transition-none"
                                      style={{
                                          opacity: index === activeIndex ? 1 : 0,
                                          zIndex: index === activeIndex ? 1 : 0,
                                      }}
                                  />
                              );
                          })
                        : null}
                </div>
            ))}
        </div>
    );
}

/**
 * Mounts the stills once the browser goes idle after first paint, so every image
 * is downloaded and decoded before the pointer ever reaches a name. Hovering
 * earlier than that starts the preload immediately.
 */
function useStillPreload() {
    const [warm, setWarm] = useState(false);
    const warmStills = useCallback(() => setWarm(true), []);

    useEffect(() => {
        if (warm) return;

        if (typeof window.requestIdleCallback === "function") {
            const handle = window.requestIdleCallback(warmStills, { timeout: 2000 });
            return () => window.cancelIdleCallback?.(handle);
        }

        const timer = window.setTimeout(warmStills, 500);
        return () => window.clearTimeout(timer);
    }, [warm, warmStills]);

    return { warm, warmStills };
}

export default function DirectorsList({ directors }: { directors: Director[] }) {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const { warm, warmStills } = useStillPreload();

    return (
        <div className={`grid grid-cols-6 ${COLUMN_GUTTER} md:items-center`}>
            <StillColumn
                slots={LEFT_SLOTS}
                directors={directors}
                activeIndex={activeIndex}
                warm={warm}
            />

            <ul
                className={`col-span-6 text-center md:col-span-2 ${NAME_CLASS}`}
                onMouseEnter={warmStills}
                onFocus={warmStills}
                onMouseLeave={() => setActiveIndex(null)}
            >
                {directors.map((director, index) => {
                    const active = index === activeIndex;
                    const colorClass = `transition-colors duration-200 ease-out motion-reduce:transition-none ${
                        active ? "text-accent" : ""
                    }`;
                    const linked =
                        DIRECTOR_PAGES_ENABLED && !director.isPlaceholder && director.slug;

                    return (
                        <li
                            key={director.id}
                            onMouseEnter={() => setActiveIndex(index)}
                            className={linked ? "" : colorClass}
                        >
                            {linked ? (
                                <Link
                                    href={`/directors/${director.slug}`}
                                    className={`block ${colorClass}`}
                                    onFocus={() => setActiveIndex(index)}
                                    onBlur={() => setActiveIndex(null)}
                                >
                                    {director.name}
                                </Link>
                            ) : (
                                director.name
                            )}
                        </li>
                    );
                })}
            </ul>

            <StillColumn
                slots={RIGHT_SLOTS}
                directors={directors}
                activeIndex={activeIndex}
                warm={warm}
            />
        </div>
    );
}
