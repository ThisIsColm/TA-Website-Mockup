"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import ProjectCard from "@/components/ProjectCard";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import VideoHero from "@/components/VideoHero";
import Statement from "@/components/Statement";
import { getFeaturedProjects, getRecentPosts } from "@/lib/data";
import { Project, Post } from "@/types";

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
}

// ── Adapters: Ghost data → existing component shapes ─────────────

function ghostToProject(post: CuratedPost, index: number): Project {
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
        vimeoId: (post as any).vimeoId,
    };
}

function ghostToPost(post: CuratedPost): Post {
    return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt || "",
        date: post.published_at,
        author: "Tiny Ark",
        coverImage: post.feature_image || "",
        category: "Case Study",
        content: "",
        director: post.director,
        client: post.client,
    };
}

function estimateReadTime(text: string) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.ceil(words / 180));
}

// ── Component ────────────────────────────────────────────────────

export default function HomePage() {
    // Hardcoded fallback data
    const fallbackProjects = getFeaturedProjects(10);
    const fallbackPosts = getRecentPosts(3);

    const [projects, setProjects] = useState<Project[]>(fallbackProjects);
    const [posts, setPosts] = useState<Post[]>(fallbackPosts);
    const [clientPosts, setClientPosts] = useState<Post[]>([]);
    const [loaded, setLoaded] = useState(false);

    // Fetch curated data on mount
    useEffect(() => {
        async function fetchCurated() {
            try {
                const res = await fetch("/api/curation/all");
                if (!res.ok) return;
                const data = await res.json();

                // Only replace if we got curated content
                if (data["home.selectedWork"]?.length > 0) {
                    setProjects(data["home.selectedWork"].map((p: CuratedPost, i: number) => ghostToProject(p, i)));
                }
                if (data["home.caseStudies"]?.length > 0) {
                    setPosts(data["home.caseStudies"].map((p: CuratedPost) => ghostToPost(p)));
                }
                if (data["home.clients"]?.length > 0) {
                    setClientPosts(data["home.clients"].map((p: CuratedPost) => ghostToPost(p)));
                }
            } catch (err) {
                console.warn("[home] Could not fetch curated data, using fallback:", err);
            } finally {
                setLoaded(true);
            }
        }
        fetchCurated();
    }, []);

    return (
        <div className="relative">
            {/* ── Video Hero (Sticky) ────────────────────────────────────── */}
            <div className="sticky top-0 h-screen w-full z-10">
                <VideoHero />
            </div>

            {/* ── Main Content ────────────────────────────────────────── */}
            <div className="relative z-[60]">
                <Statement
                    text="Tiny Ark is an independent creative video agency based in Dublin, collaborating globally with brands and cultural institutions."
                />

                {/* ── Rest of Content (slides after stack) ────────────────── */}
                <div className="relative z-[70] bg-bg">
                    {/* ── Featured Projects ─────────────────────────────────────── */}
                    <section className="pt-[7rem] lg:pt-[11rem] pb-[7rem] lg:pb-[11rem]">
                        <Container>
                            {/* Custom Editorial Header */}
                            <ScrollReveal className="flex justify-between items-start mb-12">
                                <div className="max-w-4xl">
                                    <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tight text-white leading-none">
                                        A curated selection of films and campaigns.
                                    </h2>
                                </div>
                            </ScrollReveal>

                            {/* Standard 2x2 Grid with doubled row gap */}
                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                {projects.slice(0, 10).map((project, i) => (
                                    <div key={project.slug}>
                                        <ProjectCard
                                            project={project}
                                            index={i}
                                            aspectRatio="aspect-[16/9]"
                                            enablePreview={true}
                                            overlayTitleOnThumbnail={true}
                                        />
                                    </div>
                                ))}
                            </div>

                        </Container>
                    </section>

                    {/* ── Recent Posts ───────────────────────────────────────────── */}
                    <section className="py-[7rem] lg:py-[11rem] bg-white text-black">
                        <Container>
                            <ScrollReveal className="flex justify-between items-start mb-12">
                                <div className="max-w-4xl">
                                    <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tight text-black leading-none">
                                        Insights into the thinking that drives our work and process.
                                    </h2>
                                </div>
                            </ScrollReveal>
                            <div>
                                {posts.slice(0, 3).map((post, index) => {
                                    const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    });
                                    const readTimeMinutes = estimateReadTime(post.excerpt);

                                    return (
                                        <div key={post.slug}>
                                            <Link
                                                href={`/insights/${post.slug}`}
                                                className="group block py-8 lg:py-10"
                                            >
                                            <article className="grid grid-cols-1 md:grid-cols-[minmax(160px,220px)_1fr] gap-5 lg:gap-7 items-start">
                                                    <div className="editorial-image-wrap relative aspect-[16/10] bg-black/5">
                                                        <Image
                                                            src={post.coverImage}
                                                            alt={post.title}
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, 220px"
                                                            className="editorial-image object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-3.5">
                                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] md:text-xs text-black/45 uppercase tracking-[0.14em]">
                                                            <span>{formattedDate}</span>
                                                            <span className="text-black/30">•</span>
                                                            <span>{readTimeMinutes} min read</span>
                                                        </div>
                                                        <div className="flex items-start justify-between gap-4">
                                                            <h3 className="text-[clamp(1.4rem,2.8vw,2.15rem)] font-bold leading-[1.05] tracking-[-0.02em] text-black group-hover:text-accent transition-colors duration-250 [transition-timing-function:var(--ease-signature)]">
                                                                {post.title}
                                                            </h3>
                                                            <span className="text-[11px] md:text-xs font-semibold uppercase tracking-[0.14em] text-accent opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-250 [transition-timing-function:var(--ease-signature)] whitespace-nowrap pointer-events-none">
                                                                Read article →
                                                            </span>
                                                        </div>
                                                        <p className="text-base md:text-lg text-black/62 leading-relaxed w-full line-clamp-2">
                                                            {post.excerpt}
                                                        </p>
                                                    </div>
                                                </article>
                                            </Link>
                                            {index < Math.min(posts.length, 3) - 1 && (
                                                <div
                                                    className="insight-separator text-black/8"
                                                    style={{ animationDelay: `${index * 90 + 80}ms` }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </Container>
                    </section>

                    {/* ── CTA Section ───────────────────────────────────────────── */}
                    <section className="pb-section-sm lg:pb-section">
                        <Container>
                            <div className="border-t border-border pt-[7rem] lg:pt-[11rem]">
                                <ScrollReveal className="text-center max-w-5xl mx-auto">
                                    <Link href="/about#contact" className="group block py-10 cursor-pointer">
                                        <h2 className="text-[clamp(3rem,7vw,6rem)] text-white/85 font-bold group-hover:text-accent group-hover:font-bold leading-[1.05] tracking-[-0.03em] transition-all duration-250 transform translate-y-4 group-hover:-translate-y-2">
                                            Let&apos;s work together.
                                        </h2>
                                        <p className="text-text-secondary text-[18px] mt-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-100 -mb-350">
                                            Have a project in mind? We&apos;d love to hear about it.
                                        </p>
                                    </Link>
                                </ScrollReveal>
                            </div>
                        </Container>
                    </section>
                </div>
            </div>
        </div>
    );
}
