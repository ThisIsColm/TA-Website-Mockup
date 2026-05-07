"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import { getFeaturedProjects } from "@/lib/data";
import { Project } from "@/types";

// ── Types for curated API response ───────────────────────────────

interface CuratedPost {
    id: string;
    title: string;
    slug: string;
    url: string;
    feature_image: string | null;
    excerpt: string;
    published_at: string;
    tags: string[];
    director?: string;
    client?: string;
    vimeoId?: string;
}

function ghostToProject(post: CuratedPost): Project {
    return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || "",
        coverImage: post.feature_image || "",
        tags: post.tags,
        date: post.published_at,
        year: new Date(post.published_at).getFullYear().toString(),
        role: "",
        services: [],
        tools: [],
        content: "",
        galleryImages: [],
        vimeoId: post.vimeoId,
    };
}

const HERO_VIMEO_ID = "1169321210";
const HERO_VIMEO_HASH = "64a496fc25";

// Outer page padding (matches the design system: 40px on desktop, smaller on mobile).
const OUTER = "px-[20px] md:px-[40px]";

export default function HomePage() {
    const fallbackProjects = getFeaturedProjects(8);
    const [projects, setProjects] = useState<Project[]>(fallbackProjects);

    useEffect(() => {
        async function fetchCurated() {
            try {
                const res = await fetch("/api/curation/all");
                if (!res.ok) return;
                const data = await res.json();
                if (data["home.selectedWork"]?.length > 0) {
                    setProjects(
                        data["home.selectedWork"]
                            .slice(0, 8)
                            .map((p: CuratedPost) => ghostToProject(p))
                    );
                }
            } catch (err) {
                console.warn("[home] Could not fetch curated data, using fallback:", err);
            }
        }
        fetchCurated();
    }, []);

    const grid = projects.slice(0, 8);

    return (
        <div className="bg-white text-black">
            {/* ── Hero (Full-screen Vimeo video) ───────────────────── */}
            <section className="relative h-screen w-full overflow-hidden bg-black">
                <iframe
                    src={`https://player.vimeo.com/video/${HERO_VIMEO_ID}?h=${HERO_VIMEO_HASH}&background=1&autoplay=1&loop=1&muted=1&api=1`}
                    className="absolute top-1/2 left-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2"
                    allow="autoplay; fullscreen; picture-in-picture"
                    title="Tiny Ark showreel"
                />
            </section>

            {/* ── About / "We are." ───────────────────────────────── */}
            <section className={`pt-[100px] pb-[100px] ${OUTER}`}>
                <div className="grid grid-cols-6 gap-[5px]">
                    <div className="col-span-6 md:col-span-1">
                        <p className="text-[14px] md:text-[15px] tracking-tight text-black">
                            We are.
                        </p>
                    </div>
                    <div className="col-span-6 md:col-span-4 md:col-start-3">
                        <p className="text-[max(1.125rem,3vw)] font-bold mb-[50px] leading-[1.18] tracking-[-0.01em] text-black">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua.
                        </p>
                        <Link
                            href="/about"
                            className="inline-block text-[28px] md:text-[28px] text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                        >
                            More about us.
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── 2x4 Thumbnail Grid (full-bleed, Vimeo on hover, title on hover) ── */}
            <section className="pb-[50px]">
                <div className="grid grid-cols-2 gap-[2.5px]">
                    {grid.map((project, i) => (
                        <ProjectCard
                            key={project.slug || i}
                            project={project}
                            index={i}
                            aspectRatio="aspect-[16/9]"
                            enablePreview={true}
                            overlayTitleOnThumbnail={true}
                            titleVisibility="hover"
                            hideExcerpt={true}
                        />
                    ))}
                </div>
            </section>

            {/* ── "Let's work together." CTA ──────────────────────── */}
            <section className={`pt-[50px] pb-[100px] ${OUTER}`}>
                <h2 className="text-[clamp(2.5rem,2.5vw,4rem)] font-black tracking-[-0.02em] text-black leading-[1.1]">
                    Let&rsquo;s work together.
                </h2>
                <ul className="mt-[20px] md:mt-[24px] space-y-[2px]">
                    <li>
                        <a
                            href="mailto:nathan@tinyark.com"
                            className="text-[clamp(1.5rem,1.5vw,2.5rem)] leading-[1.5] text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                        >
                            nathan@tinyark.com
                        </a>
                    </li>
                    <li>
                        <a
                            href="mailto:gabi@tinyark.com"
                            className="text-[clamp(1.5rem,1.5vw,2.5rem)] leading-[1.5] text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                        >
                            gabi@tinyark.com
                        </a>
                    </li>
                </ul>
            </section>
        </div>
    );
}
