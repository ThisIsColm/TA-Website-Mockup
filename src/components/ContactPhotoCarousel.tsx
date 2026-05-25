"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/** Two photos per second — instant hard cuts, no crossfade. */
const MS_PER_PHOTO = 500;

interface ContactPhotoCarouselProps {
    images: string[];
    alt?: string;
    sizes?: string;
}

export default function ContactPhotoCarousel({
    images,
    alt = "Tiny Ark production still",
    sizes = "(max-width: 768px) 100vw, 58vw",
}: ContactPhotoCarouselProps) {
    const [index, setIndex] = useState(0);
    const active = images[index] ?? images[0];

    useEffect(() => {
        images.forEach((src) => {
            const img = new window.Image();
            img.src = src;
        });
    }, [images]);

    useEffect(() => {
        if (images.length <= 1) return;
        const id = window.setInterval(() => {
            setIndex((current) => (current + 1) % images.length);
        }, MS_PER_PHOTO);
        return () => window.clearInterval(id);
    }, [images.length]);

    if (!active) return null;

    return (
        <Image
            src={active}
            alt={alt}
            fill
            className="object-cover"
            sizes={sizes}
            priority
            unoptimized
        />
    );
}
