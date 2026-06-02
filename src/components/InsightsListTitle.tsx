"use client";

import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import {
    INSIGHTS_SQUIGGLE_ASPECT,
    INSIGHTS_TITLE_SQUIGGLE_FRAME_MS,
    INSIGHTS_TITLE_SQUIGGLE_FRAMES,
} from "@/lib/insightsSquiggles";
import { typeClass } from "@/lib/typographyStyles";

interface InsightsListTitleProps {
    title: string;
    hovered?: boolean;
}

interface TitleLine {
    left: number;
    width: number;
    top: number;
    lineHeight: number;
    squiggleHeight: number;
    band: "top" | "bottom";
}

function groupRectsByLine(rects: DOMRect[]): DOMRect[][] {
    const groups: DOMRect[][] = [];

    for (const rect of rects) {
        if (rect.width <= 0) continue;

        const match = groups.find(
            (group) => Math.abs(group[0].top - rect.top) < 2
        );

        if (match) {
            match.push(rect);
        } else {
            groups.push([rect]);
        }
    }

    return groups.sort((a, b) => a[0].top - b[0].top);
}

function measureTitleLines(
    titleEl: HTMLElement,
    containerEl: HTMLElement
): TitleLine[] {
    const containerRect = containerEl.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(titleEl);

    const lineGroups = groupRectsByLine(Array.from(range.getClientRects()));
    const lineCount = lineGroups.length;

    return lineGroups.map((group, index) => {
        const left = Math.min(...group.map((rect) => rect.left));
        const right = Math.max(...group.map((rect) => rect.right));
        const top = Math.min(...group.map((rect) => rect.top));
        const bottom = Math.max(...group.map((rect) => rect.bottom));
        const width = right - left;
        const lineHeight = bottom - top;

        const fullSpriteHeight =
            width * (INSIGHTS_SQUIGGLE_ASPECT.height / INSIGHTS_SQUIGGLE_ASPECT.width);
        const bandHeight = fullSpriteHeight / INSIGHTS_SQUIGGLE_ASPECT.bands;

        const band: TitleLine["band"] =
            lineCount === 2 && index === 1 ? "bottom" : "top";

        return {
            left: left - containerRect.left,
            width,
            top: top - containerRect.top,
            lineHeight,
            squiggleHeight: bandHeight,
            band,
        };
    });
}

export default function InsightsListTitle({
    title,
    hovered = false,
}: InsightsListTitleProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const [lines, setLines] = useState<TitleLine[]>([]);
    const [frame, setFrame] = useState(0);

    const updateLines = useCallback(() => {
        const titleEl = titleRef.current;
        const containerEl = containerRef.current;
        if (!titleEl || !containerEl) return;

        setLines(measureTitleLines(titleEl, containerEl));
    }, []);

    useLayoutEffect(() => {
        updateLines();

        const titleEl = titleRef.current;
        const containerEl = containerRef.current;
        if (!titleEl || !containerEl) return;

        const observer = new ResizeObserver(updateLines);
        observer.observe(containerEl);
        observer.observe(titleEl);

        window.addEventListener("resize", updateLines);
        document.fonts?.ready.then(updateLines);

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateLines);
        };
    }, [title, updateLines]);

    useEffect(() => {
        for (const src of INSIGHTS_TITLE_SQUIGGLE_FRAMES) {
            const img = new window.Image();
            img.src = src;
        }
    }, []);

    useEffect(() => {
        if (!hovered) return;

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        if (reducedMotion) return;

        const id = window.setInterval(() => {
            setFrame((current) => (current + 1) % INSIGHTS_TITLE_SQUIGGLE_FRAMES.length);
        }, INSIGHTS_TITLE_SQUIGGLE_FRAME_MS);

        return () => window.clearInterval(id);
    }, [hovered]);

    useEffect(() => {
        if (!hovered) setFrame(0);
    }, [hovered]);

    return (
        <div
            ref={containerRef}
            className="relative inline-block max-w-full md:max-w-[43.021vw]"
        >
            <h2
                ref={titleRef}
                className={`relative z-10 transition-colors duration-200 ${
                    hovered ? "text-accent" : "text-black"
                } ${typeClass("insights.listTitle")}`}
            >
                {title}
            </h2>

            {lines.map((line, index) => (
                <div
                    key={`${index}-${line.width}-${line.left}`}
                    aria-hidden
                    className={`pointer-events-none absolute z-[1] overflow-hidden transition-opacity duration-200 ${
                        hovered ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                        left: line.left,
                        top: Math.max(
                            line.top,
                            line.top + 16 + line.lineHeight - line.squiggleHeight
                        ),
                        width: line.width,
                        height: line.squiggleHeight,
                    }}
                >
                    <div
                        className="h-full w-full bg-no-repeat"
                        style={{
                            backgroundImage: `url(${INSIGHTS_TITLE_SQUIGGLE_FRAMES[frame]})`,
                            backgroundSize: `${line.width}px auto`,
                            backgroundPosition:
                                line.band === "bottom" ? "left bottom" : "left top",
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
