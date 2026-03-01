"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import ProjectCard from "@/components/ProjectCard";
import PostCard from "@/components/PostCard";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import VideoHero from "@/components/VideoHero";
import SectionStack from "@/components/SectionStack";
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
        category: post.tags[0] || "General",
        content: "",
    };
}

// ── Component ────────────────────────────────────────────────────

export default function HomePage() {
    // Hardcoded fallback data
    const fallbackProjects = getFeaturedProjects(5);
    const fallbackPosts = getRecentPosts(3);

    const [projects, setProjects] = useState<Project[]>(fallbackProjects);
    const [posts, setPosts] = useState<Post[]>(fallbackPosts);
    const [loaded, setLoaded] = useState(false);

    // Fetch curated data on mount
    useEffect(() => {
        async function fetchCurated() {
            try {
                const res = await fetch("/api/curation/home");
                if (!res.ok) return;
                const data = await res.json();

                // Only replace if we got curated content
                if (data.selectedWork?.length > 0) {
                    setProjects(data.selectedWork.map((p: CuratedPost, i: number) => ghostToProject(p, i)));
                }
                if (data.caseStudies?.length > 0) {
                    setPosts(data.caseStudies.map((p: CuratedPost) => ghostToPost(p)));
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

            {/* ── Main Content (Slides over Video) ────────────────────────── */}
            <div className="relative z-20 mt-[-100vh]">
                {/* ── Section Stack (Includes Philosophy & Cards) ─────────── */}
                <SectionStack />

                <Statement
                    text="Tiny Ark is an independent creative video agency based in Dublin, working globally with brands and cultural institutions."
                />

                {/* ── Rest of Content (slides after stack) ────────────────── */}
                <div className="relative z-50 bg-bg">
                    {/* ── Featured Projects ─────────────────────────────────────── */}
                    <section className="pt-40 lg:pt-[16rem] pb-section-sm lg:pb-section">
                        <Container>
                            {/* Custom Editorial Header */}
                            <ScrollReveal className="flex justify-between items-start mb-16 lg:mb-24">
                                <div className="max-w-3xl">
                                    <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-tight text-white mb-4 leading-none">
                                        Selected Work
                                    </h2>
                                    <p className="text-white/60 text-[20px] leading-6 max-w-3xl">
                                        Not everything we've made, just the work that earned its place here. A curated collection of projects we're proud to put our name on, every frame deliberate, every outcome intentional.
                                    </p>
                                </div>

                            </ScrollReveal>

                            {/* 12-Column Asymmetrical Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-16 lg:gap-6 items-start">
                                {projects.map((project, i) => {
                                    // Editorial Staggered Layout Logic (Desktop)
                                    let gridStyles = "";
                                    if (i === 0) gridStyles = "lg:col-span-6 lg:col-start-1";
                                    else if (i === 1) gridStyles = "lg:col-span-6 lg:col-start-7 lg:mt-0 md:mt-16";
                                    else if (i === 2) gridStyles = "lg:col-span-8 lg:col-start-1 lg:mt-24";
                                    else if (i === 3) gridStyles = "lg:col-span-8 lg:col-start-5 lg:mt-24 md:mt-16";
                                    else if (i === 4) gridStyles = "lg:col-span-10 lg:col-start-2 lg:mt-24 md:mt-20";
                                    // Fallback for more items
                                    else if (i % 2 === 0) gridStyles = "lg:col-span-6 lg:col-start-1 lg:mt-12";
                                    else gridStyles = "lg:col-span-5 lg:col-start-8 lg:mt-32 md:mt-16";

                                    return (
                                        <div key={project.slug} className={gridStyles}>
                                            <ProjectCard
                                                project={project}
                                                index={i}
                                                aspectRatio={i === 4 ? "aspect-[16/9]" : "aspect-[16/9]"}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <ScrollReveal className="mt-12 text-center">
                                <Link
                                    href="/work"
                                    className="group inline-flex flex-col items-center"
                                >
                                    <span className="text-[18px] tracking-wider text-white/80 group-hover:text-accent transition-colors duration-300">
                                        View all projects
                                    </span>
                                    <div className="h-px w-full bg-white/20 group-hover:bg-accent transition-colors duration-300 mt-1" />
                                </Link>
                            </ScrollReveal>
                        </Container>
                    </section>


                    {/* ── Recent Posts ───────────────────────────────────────────── */}
                    <section className="py-section-sm lg:py-section">
                        <Container>
                            <ScrollReveal className="flex justify-between items-start mb-16 lg:mb-24">
                                <div className="max-w-2xl">
                                    <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-tight text-white mb-4 leading-none">
                                        How We Think
                                    </h2>
                                    <p className="text-white/60 text-[18px] leading-relaxed max-w-s">
                                        A deeper look at the ideas, process, and craft behind the results. Because great work doesn't happen by accident.
                                    </p>
                                </div>
                            </ScrollReveal>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 -mt-15 lg:gap-6">
                                {posts.map((post, i) => (
                                    <PostCard key={post.slug} post={post} index={i} />
                                ))}
                            </div>
                        </Container>
                    </section>

                    {/* ── CTA Section ───────────────────────────────────────────── */}
                    <section className="pb-section-sm lg:pb-section">
                        <Container>
                            <div className="border-t border-border pt-section-sm lg:pt-section">
                                <ScrollReveal className="text-center max-w-5xl mx-auto">
                                    <Link href="/about#contact" className="group block py-10 cursor-pointer">
                                        <h2 className="text-[clamp(3rem,7vw,6rem)] text-white/85 font-medium group-hover:text-white group-hover:font-medium leading-[1.05] tracking-[-0.03em] transition-all duration-250 transform translate-y-4 group-hover:-translate-y-2">
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
