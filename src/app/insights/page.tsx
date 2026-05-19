import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import { fetchPostsByIds, GhostPost } from "@/lib/ghost";
import { getSelections } from "@/lib/db";

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

interface InsightPost {
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    date: string;
}

function ghostToInsight(post: GhostPost): InsightPost {
    return {
        slug: post.slug,
        title: post.title,
        excerpt: post.custom_excerpt || post.excerpt || "",
        coverImage: post.feature_image || "",
        date: post.published_at,
    };
}

function estimateReadTime(text: string) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.ceil(words / 180));
}

function formatDate(iso: string) {
    return new Date(iso)
        .toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        .toUpperCase();
}

export default async function InsightsPage() {
    let posts: InsightPost[] = [];

    try {
        const selection = getSelections("case-studies");
        const ghostPosts = await fetchPostsByIds(selection.ghostPostIds);
        if (ghostPosts && ghostPosts.length > 0) {
            posts = ghostPosts.map(ghostToInsight);
        }
    } catch (err) {
        console.error("[insights] Failed to fetch curated Ghost posts:", err);
    }

    // Distribute posts column-first so reading order flows naturally.
    // Posts 0,3,6… in col 0; 1,4,7… in col 1; 2,5,8… in col 2.
    const columns: InsightPost[][] = [[], [], []];
    posts.forEach((post, i) => {
        columns[i % 3].push(post);
    });

    return (
        <section
            data-header-surface="white"
            className="bg-white pt-[100px] md:pt-[110px] pb-[100px] md:pb-[140px]"
        >
            <Container>
                {/* Page title — centred, ~100px space below before the grid */}
                <h1
                    className="text-center text-black"
                    style={{
                        fontFamily: "Tenon, sans-serif",
                        fontSize: "clamp(1.5rem, 1.8vw, 30px)",
                        letterSpacing: "-0.01em",
                        lineHeight: 1.1,
                        fontWeight: 800,
                    }}
                >
                    INSIGHTS.
                </h1>

                {/* 3-column grid; middle column offset by half a thumbnail
                    so its top sits at the vertical centre of the others.
                    Thumbnail is 565 × 370 → half-height = 32.7434% of col width. */}
                <div className="mt-[80px] md:mt-[100px] grid grid-cols-1 md:grid-cols-3 gap-x-[5px]">
                    {columns.map((columnPosts, colIdx) => (
                        <div
                            key={colIdx}
                            className={`flex flex-col gap-[50px] ${
                                colIdx === 1 ? "md:pt-[32.7434%]" : ""
                            }`}
                        >
                            {columnPosts.map((post) => {
                                const dateLabel = formatDate(post.date);
                                const readTime = estimateReadTime(post.excerpt);

                                return (
                                    <article key={post.slug}>
                                        <Link
                                            href={`/insights/${post.slug}`}
                                            className="group block"
                                        >
                                            <div
                                                data-header-surface="dark"
                                                className="relative w-full aspect-[565/370] overflow-hidden bg-[#D7CFC2]"
                                            >
                                                {post.coverImage ? (
                                                    <Image
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                    />
                                                ) : null}
                                                <div
                                                    className="pointer-events-none absolute inset-[1%] z-10 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                                                    aria-hidden="true"
                                                >
                                                    <Image
                                                        src="/images/squiggle-hover.png"
                                                        alt=""
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 768px) 100vw, 33vw"
                                                    />
                                                </div>
                                            </div>

                                            <p
                                                className="mt-[25px] text-black"
                                                style={{
                                                    fontFamily: "Tenon, sans-serif",
                                                    fontSize: "clamp(0.7rem, 0.78vw, 13px)",
                                                    letterSpacing: "0.08em",
                                                    textTransform: "uppercase",
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {dateLabel} &middot; {readTime} MIN READ
                                            </p>

                                            <h2
                                                className="mt-[25px] text-black transition-colors duration-200 group-hover:text-accent"
                                                style={{
                                                    fontFamily: "Tenon, sans-serif",
                                                    fontSize: "clamp(2.8rem, 2.8vw, 2000px)",
                                                    letterSpacing: "-0.01em",
                                                    lineHeight: 1,
                                                    fontWeight: 800,
                                                }}
                                            >
                                                {post.title}
                                                {post.title.endsWith(".") ? "" : "."}
                                            </h2>
                                        </Link>
                                    </article>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
}
