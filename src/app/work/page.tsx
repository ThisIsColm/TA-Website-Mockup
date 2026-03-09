import type { Metadata } from "next";
import Link from "next/link";
import WorkPageClient from "./WorkPageClient";
import Container from "@/components/Container";
import ProjectGrid from "@/components/ProjectGrid";
import SectionHeading from "@/components/SectionHeading";
import { getAllProjects } from "@/lib/data";
import { fetchGhostPosts, fetchPostsByIds, GhostPost } from "@/lib/ghost";
import { getSelections } from "@/lib/db";
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

        let filteredProjects: Project[] = [];

        try {
            if (matchingCategory) {
                const sectionKey = `work.${matchingCategory.slug}`;
                const selection = getSelections(sectionKey);
                const posts = await fetchPostsByIds(selection.ghostPostIds);

                if (posts && posts.length > 0) {
                    filteredProjects = posts.map(ghostToProject);
                } else {
                    // Fallback to local data if nothing curated
                    const allProjects = getAllProjects();
                    filteredProjects = allProjects.filter(
                        (p) => p.category === matchingCategory.title
                    );
                }
            } else {
                // Default fallback
                const allProjects = getAllProjects();
                filteredProjects = allProjects;
            }
        } catch (err) {
            console.error(`[work category error] Failed to fetch curated Ghost posts:`, err);
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
                        titleClassName="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tight text-white leading-none"
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
                    titleClassName="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tight text-white leading-none"
                />

                <WorkPageClient categories={categories} />
            </Container>
        </section>
    );
}
