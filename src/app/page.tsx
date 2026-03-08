"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Container from "@/components/Container";
import ProjectCard from "@/components/ProjectCard";
import PostCard from "@/components/PostCard";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeading from "@/components/SectionHeading";
import VideoHero from "@/components/VideoHero";
import Statement from "@/components/Statement";
import ClientLogos from "@/components/ClientLogos";
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
        category: "Case Study",
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

            {/* ── Main Content ────────────────────────────────────────── */}
            <div className="relative z-[60]">
                <Statement
                    text="Tiny Ark is an independent creative video agency based in Dublin, collaborating globally with brands and cultural institutions."
                />

                {/* ── Rest of Content (slides after stack) ────────────────── */}
                <div className="relative z-[70] bg-bg">
                    {/* ── Featured Projects ─────────────────────────────────────── */}
                    <section className="pt-24 lg:pt-32 pb-section-sm lg:pb-section">
                        <Container>
                            {/* Custom Editorial Header */}
                            <ScrollReveal className="flex justify-between items-start mb-8">
                                <div className="max-w-4xl">
                                    <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tight text-white mb-8 leading-none">
                                        A curated selection of films and campaigns.
                                    </h2>
                                    <p className="text-text-secondary text-lg leading-relaxed max-w-3xl">
                                        Not everything we've made, just the work that earned its place here. A curated collection of projects we're proud to put our name on, every frame deliberate, every outcome intentional.
                                    </p>
                                </div>
                            </ScrollReveal>

                            {/* Standard 2x2 Grid with doubled row gap */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-32">
                                {projects.slice(0, 6).map((project, i) => (
                                    <div key={project.slug}>
                                        <ProjectCard
                                            project={project}
                                            index={i}
                                            aspectRatio="aspect-[16/9]"
                                        />
                                    </div>
                                ))}
                            </div>

                            <ScrollReveal className="mt-32 text-center">
                                <Link
                                    href="/work"
                                    className="group inline-flex flex-col items-center"
                                >
                                    <span className="text-[18px] tracking-wider text-white group-hover:text-accent transition-colors duration-300">
                                        View more work &rarr;
                                    </span>
                                    <div className="h-px w-full bg-white/20 group-hover:bg-accent transition-colors duration-300 mt-1" />
                                </Link>
                            </ScrollReveal>
                        </Container>
                    </section>

                    <ClientLogos />

                    {/* ── Recent Posts ───────────────────────────────────────────── */}
                    <section className="py-section-sm lg:py-section">
                        <Container>
                            <ScrollReveal className="flex justify-between items-start mb-8">
                                <div className="max-w-4xl">
                                    <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tight text-white mb-8 leading-none">
                                        The thinking that drives our work and process.
                                    </h2>
                                    <p className="text-text-secondary text-lg leading-relaxed max-w-3xl">
                                        Not just the finished film. These case studies explore the thinking, process and creative decisions behind the work. A closer look at how ideas become something worth watching.
                                    </p>
                                </div>
                            </ScrollReveal>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
                                {posts.map((post, i) => (
                                    <PostCard key={post.slug} post={post} index={i} />
                                ))}
                            </div>
                            <ScrollReveal className="mt-24 text-center">
                                <Link
                                    href="/case-studies"
                                    className="group inline-flex flex-col items-center"
                                >
                                    <span className="text-[18px] tracking-wider text-white group-hover:text-accent transition-colors duration-300">
                                        View more case studies &rarr;
                                    </span>
                                    <div className="h-px w-full bg-white/20 group-hover:bg-accent transition-colors duration-300 mt-1" />
                                </Link>
                            </ScrollReveal>
                        </Container>
                    </section>

                    {/* ── CTA Section ───────────────────────────────────────────── */}
                    <section className="pb-section-sm lg:pb-section">
                        <Container>
                            <div className="border-t border-border pt-section-sm lg:pt-section">
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
