import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import InsightsIntroIcon from "@/components/InsightsIntroIcon";
import InsightsPostThumbnail from "@/components/InsightsPostThumbnail";
import { fetchPostsByIds, GhostPost } from "@/lib/ghost";
import { getPostMetadata, getSelections } from "@/lib/db";
import { getTeamAuthor } from "@/lib/team";

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
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverImage: string;
    date: string;
    authorName?: string;
}

const DM_MONO = '"DM Mono", ui-monospace, monospace';

function ghostToInsight(post: GhostPost): InsightPost {
    const meta = getPostMetadata(post.id);
    const author = getTeamAuthor(meta?.insightAuthorId);

    return {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.custom_excerpt || post.excerpt || "",
        coverImage: post.feature_image || "",
        date: post.published_at,
        authorName: author?.name,
    };
}

function estimateReadTime(text: string) {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(2, Math.ceil(words / 180));
}

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
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

    return (
        <section
            data-header-surface="white"
            className="bg-white pt-[100px] md:pt-[110px] pb-[100px] md:pb-[140px]"
        >
            <Container>
                <header className="flex flex-col items-center text-center">
                    <InsightsIntroIcon className="h-[clamp(4rem,10.625vw,204px)] w-[clamp(4rem,10.625vw,204px)] text-accent" />
                    <p
                        className="text-black"
                        style={{
                            fontFamily: DM_MONO,
                            fontSize: "clamp(0.875rem, 1.5625vw, 30px)",
                            fontWeight: 300,
                            lineHeight: "clamp(28px, 2.03125vw, 39px)",
                            letterSpacing: 0,
                        }}
                    >
                        The thinking
                        <br />
                        behind the work
                    </p>
                </header>

                <div className="mt-[clamp(48px,8.594vw,165px)] flex flex-col gap-[clamp(48px,5.365vw,103px)]">
                    {posts.map((post) => {
                        const dateLabel = formatDate(post.date);
                        const readTime = estimateReadTime(post.excerpt);
                        const title = post.title.endsWith(".")
                            ? post.title
                            : `${post.title}.`;

                        return (
                            <article key={post.slug}>
                                <Link
                                    href={`/insights/${post.slug}`}
                                    className="group grid grid-cols-6 gap-x-[5px] items-start"
                                >
                                    <div className="col-span-2 flex flex-col gap-[5px]">
                                        <InsightsPostThumbnail
                                            coverImage={post.coverImage}
                                            title={post.title}
                                        />
                                        <p
                                            className="text-black"
                                            style={{
                                                fontFamily: DM_MONO,
                                                fontSize: "clamp(0.6875rem, 0.9375vw, 18px)",
                                                fontWeight: 400,
                                                lineHeight: "clamp(18px, 1.197917vw, 23px)",
                                                letterSpacing: "-0.02em",
                                            }}
                                        >
                                            {dateLabel} &middot; {readTime} min read
                                        </p>
                                    </div>

                                    <div className="col-span-4 col-start-3 min-w-0 pl-[clamp(8px,2.396vw,46px)]">
                                        <h2
                                            className="max-w-[clamp(280px,43.021vw,826px)] text-black transition-colors duration-200 group-hover:text-accent"
                                            style={{
                                                fontFamily: "Tenon, sans-serif",
                                                fontSize: "clamp(1.5rem, 3.958333vw, 76px)",
                                                letterSpacing: "-0.02em",
                                                lineHeight: 1,
                                                fontWeight: 800,
                                                color: "#000000",
                                            }}
                                        >
                                            {title}
                                        </h2>
                                        {post.authorName ? (
                                            <p
                                                className="mt-[clamp(20px,2.604vw,50px)] max-w-[clamp(280px,43.021vw,826px)] text-black"
                                                style={{
                                                    fontFamily: DM_MONO,
                                                    fontSize: "clamp(0.875rem, 1.5625vw, 30px)",
                                                    fontWeight: 400,
                                                    lineHeight: "clamp(28px, 2.03125vw, 39px)",
                                                    letterSpacing: "-0.02em",
                                                }}
                                            >
                                                By {post.authorName}
                                            </p>
                                        ) : null}
                                    </div>
                                </Link>
                            </article>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}
