"use client";

import React from "react";

/**
 * A subtle, animated film grain overlay to add tactile texture.
 * Uses a highly-optimized SVG feTurbulence filter.
 */
export default function FilmGrain() {
    return (
        <div
            className="fixed inset-[-200%] z-1 pointer-events-none opacity-[1] mix-blend-overlay"
            aria-hidden="true"
        >
            <div className="absolute inset-0 animate-grain bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNDAiIGhlaWdodD0iMjQwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9InRyYW5zdmVyc2UiIGJhc2VGcmVxdWVuY3k9IjAuODAiIG51bU9jdGF2ZXM9IjQiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgjbikiLz48L3N2Zz4=')] bg-[length:120px_120px] will-change-transform" />
        </div>
    );
}
