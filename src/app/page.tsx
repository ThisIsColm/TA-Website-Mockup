"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { typeClass } from "@/lib/typographyStyles";
import ProjectCard from "@/components/ProjectCard";
import VideoHero from "@/components/VideoHero";
import { HERO_LOADING_POSTER } from "@/lib/heroLottie";
import WorkTogetherCta from "@/components/WorkTogetherCta";
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
    previewStartTime?: number;
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
        previewStartTime: post.previewStartTime,
    };
}

const HERO_VIMEO_ID = "1169321210";
const HERO_VIMEO_HASH = "64a496fc25";

// Outer page padding: 5.625vw matches the designer's 1920px spec (108px outer)
// and scales proportionally at every viewport width.
const OUTER = "px-[5.625vw]";

/**
 * Typewriter scroll timing — how far through this section's scroll window (0–1)
 * before the last word is revealed.
 *
 * Lower = finishes earlier (less scrolling). Higher = finishes later (more scrolling).
 *
 * Examples (approximate feel):
 *   0.35 → done well before the section centres in the viewport
 *   0.50 → done around when the section top hits the viewport top (old `* 2` behaviour)
 *   0.70 → need to scroll further into the section before the last word appears
 *   1.00 → entire section must pass through before the last word appears
 */
const TYPEWRITER_FINISH_AT = 0.35;

// About copy split into blocks. The typewriter reveal runs across all blocks
// as a single word sequence.
const ABOUT_PARAGRAPHS = [
    "We translate raw ambition",
    "into visual momentum.",
    "No ego. No fluff.",
    "Just stories that resonate.",
];

function TypewriterSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [revealedCount, setRevealedCount] = useState(0);

    const paragraphWords = ABOUT_PARAGRAPHS.map((p) => p.split(" "));
    const totalWords = paragraphWords.reduce((sum, w) => sum + w.length, 0);

    const handleScroll = useCallback(() => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionHeight = rect.height;
        const viewportHeight = window.innerHeight;

        // Progress 0 → 1 as the section travels from below the viewport to above it.
        const totalScrollDistance = viewportHeight + sectionHeight;
        const rawProgress = Math.max(
            0,
            Math.min(1, (viewportHeight - sectionTop) / totalScrollDistance)
        );
        const scrollProgress = Math.max(
            0,
            Math.min(1, rawProgress / TYPEWRITER_FINISH_AT)
        );

        const count = Math.floor(scrollProgress * totalWords);
        setRevealedCount(Math.min(count, totalWords));
    }, [totalWords]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const renderWordWithLigature = (word: string) => {
        const ffIndex = word.toLowerCase().indexOf("ff");
        if (ffIndex === -1) return word;

        const before = word.slice(0, ffIndex);
        const ff = word.slice(ffIndex, ffIndex + 2);
        const after = word.slice(ffIndex + 2);

        return (
            <>
                {before}
                <span
                    className="inline"
                    style={{
                        fontVariantLigatures: "common-ligatures",
                        fontFeatureSettings: '"liga" 1, "clig" 1',
                        // Inherited negative tracking prevents ff ligatures from forming.
                        letterSpacing: 0,
                    }}
                >
                    {ff}
                </span>
                {after}
            </>
        );
    };

    return (
        <section
            ref={sectionRef}
            data-header-surface="white"
            className={`pt-[80px] pb-[60px] md:pt-[100px] md:pb-[100px] ${OUTER}`}
        >
            {/* 6-col grid; full width on mobile, right-shifted from md up */}
            <div className="grid grid-cols-6 gap-[5px]">
                <div className="col-span-6 md:col-start-3 md:col-span-4">
                    {paragraphWords.map((words, pIdx) => {
                        const offset = paragraphWords
                            .slice(0, pIdx)
                            .reduce((sum, w) => sum + w.length, 0);
                        const isLast = pIdx === paragraphWords.length - 1;
                        // Line breaks within a stanza: mb-0; paragraph gap before next stanza: mb-[1.2em]
                        const marginBottom = isLast
                            ? "mb-[50px]"
                            : pIdx === 0 || pIdx === 2
                              ? "mb-0"
                              : "mb-[1em]";
                        return (
                            <p
                                key={pIdx}
                                className={`font-sans font-extrabold text-[#353535] ${marginBottom} ${typeClass("home.typewriterLine")}`}
                            >
                                {words.map((word, i) => {
                                    const globalIdx = offset + i;
                                    const isRevealed = globalIdx < revealedCount;
                                    const isNext = globalIdx === revealedCount;
                                    const opacity = isRevealed ? 1 : isNext ? 0.4 : 0;
                                    return (
                                        <span
                                            key={i}
                                            className="inline mr-[0.3em]"
                                            style={{
                                                opacity,
                                                transition: "opacity 0.1s ease",
                                            }}
                                        >
                                            {renderWordWithLigature(word)}
                                        </span>
                                    );
                                })}
                            </p>
                        );
                    })}
                    <Link
                        href="/about"
                        className={`inline-block text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors ${typeClass("home.moreAboutLink")}`}
                    >
                        Tell me more.
                    </Link>
                </div>
            </div>
        </section>
    );
}

const HOME_WORK_GRID_LIMIT = 16;

export default function HomePage() {
    const fallbackProjects = getFeaturedProjects(HOME_WORK_GRID_LIMIT);
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
                            .slice(0, HOME_WORK_GRID_LIMIT)
                            .map((p: CuratedPost) => ghostToProject(p))
                    );
                }
            } catch (err) {
                console.warn("[home] Could not fetch curated data, using fallback:", err);
            }
        }
        fetchCurated();
    }, []);

    const grid = projects.slice(0, HOME_WORK_GRID_LIMIT);

    return (
        <div className="bg-white text-black">
            <VideoHero
                vimeoId={HERO_VIMEO_ID}
                vimeoHash={HERO_VIMEO_HASH}
                title="Tiny Ark showreel"
                posterSrc={HERO_LOADING_POSTER}
            />

            {/* ── About intro (scroll typewriter) ─────────────────────────── */}
            <TypewriterSection />

            {/* ── 2x4 Thumbnail Grid (full-bleed, Vimeo on hover, title on hover) ── */}
            <section
                id="work"
                data-header-surface="dark"
                className="scroll-mt-[72px] md:scroll-mt-6 pb-[50px]"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[2.5px]">
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

            <WorkTogetherCta />
        </div>
    );
}
