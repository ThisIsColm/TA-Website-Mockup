import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { fetchPostsByIds, GhostPost } from "@/lib/ghost";
import { getSelections } from "@/lib/db";
import { Post } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Insights",
    description:
        "Insights on design, branding, motion, and the creative process from the Tiny Ark team.",
    openGraph: {
        title: "Insights — Tiny Ark",
        description:
            "Insights on design, branding, motion, and the creative process.",
    },
};

function ghostToPost(post: GhostPost): Post {
    return {
        slug: post.slug,
        title: post.title,
        excerpt: post.custom_excerpt || post.excerpt || "",
        date: post.published_at,
        author: "Tiny Ark",
        coverImage: post.feature_image || "",
        category: "Case Study",
        content: "",
    };
}

function estimateReadTime(text: string) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.ceil(words / 180));
}

export default async function CaseStudiesPage() {
    let posts: Post[] = [];

    try {
        const selection = getSelections("case-studies");
        const ghostPosts = await fetchPostsByIds(selection.ghostPostIds);

        if (ghostPosts && ghostPosts.length > 0) {
            posts = ghostPosts.map(ghostToPost);
        } else {
            // No curated posts found or error pulling
        }
    } catch (err) {
        console.error("[case-studies error] Failed to fetch curated Ghost posts:", err);
    }

    return (
        <section className="pt-[72px] py-16 lg:py-24">
            <Container>
                <SectionHeading
                    title="Insights."
                    className="mt-10"
                    titleClassName="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tight text-white leading-none"
                />
                <div className="mt-10 lg:mt-12">
                    {posts.map((post, index) => {
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
                                    className="group block py-7 lg:py-8"
                                >
                                    <article className="grid grid-cols-1 md:grid-cols-[minmax(170px,230px)_1fr] gap-6 lg:gap-8 items-start">
                                        <div className="relative aspect-[16/11] overflow-hidden bg-bg-card">
                                            <Image
                                                src={post.coverImage}
                                                alt={post.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 230px"
                                                className="object-cover"
                                            />
                                        </div>

                                        <div className="flex flex-col gap-5">
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] md:text-xs text-text-tertiary uppercase tracking-[0.14em]">
                                                <span>{formattedDate}</span>
                                                <span className="text-text-tertiary/50">•</span>
                                                <span>{readTimeMinutes} min read</span>
                                            </div>
                                            <h2 className="text-[clamp(1.4rem,2.8vw,2.15rem)] font-bold leading-[1.05] tracking-[-0.02em] text-white group-hover:text-accent transition-colors duration-250 [transition-timing-function:var(--ease-signature)]">
                                                {post.title}
                                            </h2>
                                            <p className="text-base md:text-lg text-text-secondary leading-relaxed w-full line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        </div>
                                    </article>
                                </Link>
                                {index < posts.length - 1 && (
                                    <div
                                        className="insight-separator text-white/8"
                                        style={{ animationDelay: `${index * 90 + 80}ms` }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
