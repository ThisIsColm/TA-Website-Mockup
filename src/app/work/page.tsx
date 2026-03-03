"use client";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/Container";
import ProjectGrid from "@/components/ProjectGrid";
import SectionHeading from "@/components/SectionHeading";
import { getAllProjects } from "@/lib/data";
import { fetchGhostPosts, GhostPost } from "@/lib/ghost";
import { Project } from "@/types";

export const dynamic = "force-dynamic";

function ghostToProject(post: GhostPost): Project {
    return {
        slug: post.slug,
        title: post.title,
        excerpt: post.custom_excerpt || post.excerpt || "",
        coverImage: post.feature_image || "",
        tags: post.tags.map(t => t.name),
        date: post.published_at,
        year: new Date(post.published_at).getFullYear().toString(),
        role: "Production",
        services: post.tags.map(t => t.name),
        tools: [],
        content: post.html || "",
        galleryImages: []
    };
}

export const metadata: Metadata = {
    title: "Work",
    description:
        "Explore our portfolio of branding, web design, and digital experience projects.",
    openGraph: {
        title: "Work — Tiny Ark",
        description:
            "Explore our portfolio of branding, web design, and digital experience projects.",
    },
};

const categories = [
    {
        title: "Commercial",
        slug: "commercial",
        image: "/images/tiny_ark_powers_old_but_gold_basketball_001.png",
    },
    {
        title: "Brand Stories",
        slug: "brand-stories",
        image: "/images/StripeStayCity.png",
    },
    {
        title: "Music",
        slug: "music",
        image: "/images/amble.jpg",
    },
    {
        title: "Live",
        slug: "live",
        image: "/images/live.jpg",
    },
];

export default async function WorkPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string }>;
}) {
    const { category } = await searchParams;

    if (category) {
        const matchingCategory = categories.find((c) => c.slug === category);
        const categoryTitle = matchingCategory ? matchingCategory.title : "Work";

        // Map category slug to Ghost tag
        const ghostTagMap: Record<string, string> = {
            "commercial": "commercial",
            "music": "music",
            "live": "live",
            "brand-stories": "documercial"
        };

        let filteredProjects: Project[] = [];
        const ghostTag = ghostTagMap[category] || category;

        try {
            const { posts } = await fetchGhostPosts(1, 50, `tag:${ghostTag}`);
            if (posts && posts.length > 0) {
                filteredProjects = posts.map(ghostToProject);
            } else {
                // Fallback to local data
                const allProjects = getAllProjects();
                filteredProjects = allProjects.filter(
                    (p) => matchingCategory && p.category === matchingCategory.title
                );
            }
        } catch (err) {
            console.error(`[work category error] Failed to fetch Ghost posts for ${ghostTag}:`, err);
            const allProjects = getAllProjects();
            filteredProjects = allProjects.filter(
                (p) => matchingCategory && p.category === matchingCategory.title
            );
        }

        return (
            <section className="pt-[72px] py-16 lg:py-24">
                <Container>
                    <SectionHeading
                        title={categoryTitle}
                        className="-mb-10 mt-10"
                        titleClassName="text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-tight text-white leading-none"
                    />

                    <div className="mb-12 border-b border-border pb-6 flex items-center justify-between">
                        <Link
                            href="/work"
                            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm font-medium"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path
                                    d="M13 7H1M6 2L1 7l5 5"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Back to Categories
                        </Link>
                    </div>

                    <ProjectGrid projects={filteredProjects} />
                </Container>
            </section>
        );
    }

    return (
        <section className="pt-[72px] py-16 lg:py-24">
            <Container>
                <SectionHeading
                    title="Work"
                    className="-mb-20 mt-10"
                    titleClassName="text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-tight text-white leading-none"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12 mt-16 md:mt-24">
                    {categories.map((c, index) => (
                        <motion.div
                            key={c.slug}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.6,
                                delay: index * 0.1,
                                ease: [0.25, 0.4, 0.25, 1],
                            }}
                            viewport={{ once: true, margin: "-60px" }}
                        >
                            <Link
                                href={`/work?category=${c.slug}`}
                                className="group block"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden rounded-[4px] bg-bg-card mb-4">
                                    <Image
                                        src={c.image}
                                        alt={c.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover group-hover:scale-[var(--zoom-scale)] transition-transform duration-[var(--zoom-duration)] ease-out"
                                    />
                                </div>
                                <h3 className="text-[28px] md:text-[32px] font-medium text-white leading-[1] group-hover:text-accent transition-colors duration-300">
                                    {c.title}
                                </h3>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
