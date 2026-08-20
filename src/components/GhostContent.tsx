"use client";

import { useState, useEffect, useRef } from "react";
import Lightbox from "./Lightbox";
import { HEADER_SURFACE_UPDATE } from "@/hooks/useHeaderContrast";

interface GhostContentProps {
    html: string;
    /**
     * Optional className override for the wrapper. Defaults to the dark editorial
     * styling (used on the legacy insights/post pages). Pass a custom className
     * (e.g. "case-study-prose") to opt into a different layout/theme.
     */
    className?: string;
}

const DEFAULT_CLASSNAME = "ghost-content space-y-6 text-text-secondary text-[17px] leading-[1.8]";

const MEDIA_MARKERS =
    "figure, .kg-image-card, .kg-gallery-card, .kg-embed-card, .kg-video-card";

/** Skip tiny icons/decorative images — inset article imagery is usually much taller. */
const MIN_MEDIA_HEIGHT = 80;

function notifyHeaderSurfaceUpdate() {
    window.dispatchEvent(new Event(HEADER_SURFACE_UPDATE));
}

function tagMediaForHeaderContrast(root: HTMLElement) {
    root.querySelectorAll("[data-ghost-media]").forEach((el) => {
        el.removeAttribute("data-header-surface");
        el.removeAttribute("data-ghost-media");
    });

    const tagIfLarge = (el: Element) => {
        const node = el as HTMLElement;
        const rect = node.getBoundingClientRect();
        const img = node.tagName === "IMG" ? (node as HTMLImageElement) : null;
        const height = Math.max(rect.height, img?.naturalHeight ?? 0);

        if (height >= MIN_MEDIA_HEIGHT) {
            node.setAttribute("data-header-surface", "dark");
            node.setAttribute("data-ghost-media", "true");
        }
    };

    const marked = new Set<Element>();

    root.querySelectorAll(MEDIA_MARKERS).forEach((el) => {
        if (marked.has(el)) return;
        marked.add(el);
        tagIfLarge(el);
    });

    root.querySelectorAll(":scope > img, :scope > video, :scope > iframe").forEach(
        (el) => {
            if (el.closest("figure, .kg-image-card, .kg-gallery-card")) return;
            tagIfLarge(el);
        }
    );
}

function joinSectionLabelsWithBody(scope: ParentNode) {
    scope.querySelectorAll("p").forEach((labelP) => {
        if (!labelP.classList.contains("case-section-label")) return;

        const next = labelP.nextElementSibling;
        if (
            !next ||
            next.tagName !== "P" ||
            next.classList.contains("case-section-label")
        ) {
            return;
        }

        const strong = labelP.querySelector(":scope > strong");
        if (!strong) {
            labelP.remove();
            return;
        }

        next.insertBefore(strong, next.firstChild);
        next.classList.add("case-section-lead");
        labelP.remove();
    });
}

function tagSectionLeadParagraphs(scope: ParentNode) {
    scope.querySelectorAll("p").forEach((p) => {
        p.classList.remove("case-section-label", "case-section-lead");

        const meaningful = [...p.childNodes].filter(
            (node) =>
                node.nodeType !== Node.TEXT_NODE ||
                (node.textContent?.trim().length ?? 0) > 0
        );

        const onlyStrong =
            meaningful.length === 1 &&
            meaningful[0] instanceof HTMLElement &&
            meaningful[0].tagName === "STRONG";

        if (onlyStrong) {
            p.classList.add("case-section-label");
            return;
        }

        const first = meaningful[0];
        if (
            first instanceof HTMLElement &&
            first.tagName === "STRONG" &&
            meaningful.length > 1
        ) {
            p.classList.add("case-section-lead");
        }
    });
}

function processSectionLabels(root: HTMLElement) {
    const scope = root.querySelector(".case-study-body") ?? root;
    tagSectionLeadParagraphs(scope);
    joinSectionLabelsWithBody(scope);
}

export default function GhostContent({ html, className = DEFAULT_CLASSNAME }: GhostContentProps) {
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;

        const root = contentRef.current;

        // Find all images in the content
        const imgElements = root.querySelectorAll("img");
        const urls = Array.from(imgElements).map((img) => img.src);
        setImages(urls);

        const runMediaMarking = () => {
            processSectionLabels(root);
            tagMediaForHeaderContrast(root);
            notifyHeaderSurfaceUpdate();
        };

        runMediaMarking();

        imgElements.forEach((img) => {
            if (img.complete) return;
            img.addEventListener("load", runMediaMarking, { once: true });
        });

        const ro = typeof ResizeObserver !== "undefined"
            ? new ResizeObserver(runMediaMarking)
            : null;
        ro?.observe(root);

        // Initial click handler setup
        const handleImageClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === "IMG") {
                const src = (target as HTMLImageElement).src;
                const index = urls.indexOf(src);
                if (index !== -1) {
                    setCurrentIndex(index);
                    setIsOpen(true);
                }
            }
        };

        root.addEventListener("click", handleImageClick);

        return () => {
            root.removeEventListener("click", handleImageClick);
            ro?.disconnect();
            root.querySelectorAll("[data-ghost-media]").forEach((el) => {
                el.removeAttribute("data-header-surface");
                el.removeAttribute("data-ghost-media");
            });
        };
    }, [html]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <>
            <div
                ref={contentRef}
                className={className}
                dangerouslySetInnerHTML={{ __html: html }}
            />

            <Lightbox
                images={images}
                currentIndex={currentIndex}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                onNext={handleNext}
                onPrev={handlePrev}
            />
        </>
    );
}
