"use client";

import { useState, useEffect, useRef } from "react";
import Lightbox from "./Lightbox";

interface GhostContentProps {
    html: string;
}

export default function GhostContent({ html }: GhostContentProps) {
    const [images, setImages] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!contentRef.current) return;

        // Find all images in the content
        const imgElements = contentRef.current.querySelectorAll("img");
        const urls = Array.from(imgElements).map((img) => img.src);
        setImages(urls);

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

        const currentRef = contentRef.current;
        currentRef.addEventListener("click", handleImageClick);

        return () => {
            currentRef.removeEventListener("click", handleImageClick);
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
                className="ghost-content space-y-6 text-text-secondary text-[17px] leading-[1.8]"
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
