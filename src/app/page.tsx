"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import VideoHero from "@/components/VideoHero";
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

// Outer page padding: 5.625vw matches the designer's 1920px spec (108px outer)
// and scales proportionally at every viewport width.
const OUTER = "px-[5.625vw]";

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

        // sectionTop positive = section below viewport top (scrolled up out of view)
        // sectionTop negative = section above viewport top (scrolled past)
        // When sectionTop = viewportHeight, section top is at viewport bottom (just entering)
        // When sectionTop = -sectionHeight, section bottom is at viewport top (just passed)
        const totalScrollDistance = viewportHeight + sectionHeight;
        const scrollProgress = Math.max(
            0,
            Math.min(1, ((viewportHeight - sectionTop) / totalScrollDistance) * 2)
        );

        const count = Math.floor(scrollProgress * totalWords);
        setRevealedCount(Math.min(count, totalWords));
    }, [totalWords]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <section
            ref={sectionRef}
            data-header-surface="white"
            className={`pt-[100px] pb-[100px] ${OUTER}`}
        >
            {/* 6-col grid, 5px gutter; copy starts at col 3 and spans 4 cols */}
            <div className="grid grid-cols-6 gap-[5px]">
                <div className="col-start-3 col-span-4">
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
                                className={`font-bold text-black ${marginBottom}`}
                                style={{
                                    fontFamily: "Tenon, sans-serif",
                                    fontSize: "clamp(1.8rem, 4vw, 90px)",
                                    letterSpacing: "-0.02em",
                                    lineHeight: 0.95,
                                    fontWeight: 800,
                                }}
                            >
                                {words.map((word, i) => {
                                    const globalIdx = offset + i;
                                    const isRevealed = globalIdx < revealedCount;
                                    const isNext = globalIdx === revealedCount;
                                    return (
                                        <span
                                            key={i}
                                            className="inline-block mr-[0.3em]"
                                            style={{
                                                opacity: isRevealed ? 1 : isNext ? 0.4 : 0,
                                                transition: "opacity 0.1s ease",
                                            }}
                                        >
                                            {word}
                                        </span>
                                    );
                                })}
                            </p>
                        );
                    })}
                    <Link
                        href="/about"
                        className="inline-block text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                        style={{ fontSize: "clamp(1.125rem, 2vw, 38px)" }}
                    >
                        More about us.
                    </Link>
                </div>
            </div>
        </section>
    );
}

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
            <VideoHero
                vimeoId={HERO_VIMEO_ID}
                vimeoHash={HERO_VIMEO_HASH}
                title="Tiny Ark showreel"
            />

            {/* ── About intro (scroll typewriter) ─────────────────────────── */}
            <TypewriterSection />

            {/* ── 2x4 Thumbnail Grid (full-bleed, Vimeo on hover, title on hover) ── */}
            <section
                id="work"
                data-header-surface="dark"
                className="scroll-mt-6 pb-[50px]"
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

            {/* ── "Let's work together." CTA ──────────────────────── */}
            <section
                data-header-surface="white"
                className={`pt-[50px] pb-[100px] ${OUTER}`}
            >
                <h2
                    className="text-[clamp(1.75rem,3.021vw,58px)] font-extrabold tracking-[-0.02em] text-black leading-[0.82]"
                    style={{ fontFamily: "Tenon, sans-serif" }}
                >
                    Let&rsquo;s work together.
                </h2>
                <ul className="mt-[20px] md:mt-[24px] space-y-[2px]">
                    <li>
                        <a
                            href="mailto:nathan@tinyark.com"
                            className="text-[clamp(1rem,1.875vw,36px)] font-normal leading-none tracking-[-0.02em] text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                            style={{ fontFamily: "Tenon, sans-serif" }}
                        >
                            nathan@tinyark.com
                        </a>
                    </li>
                    <li>
                        <a
                            href="mailto:gabi@tinyark.com"
                            className="text-[clamp(1rem,1.875vw,36px)] font-normal leading-none tracking-[-0.02em] text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                            style={{ fontFamily: "Tenon, sans-serif" }}
                        >
                            gabi@tinyark.com
                        </a>
                    </li>
                </ul>
            </section>
        </div>
    );
}
