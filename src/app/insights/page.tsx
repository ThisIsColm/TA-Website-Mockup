import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/Container";
import InsightsIntroIcon from "@/components/InsightsIntroIcon";
import InsightsPostThumbnail from "@/components/InsightsPostThumbnail";
import { fetchPostsByIds, GhostPost } from "@/lib/ghost";
import { getPostMetadata, getSelections } from "@/lib/db";
import { getTeamAuthor } from "@/lib/team";
import { figmaSpace, typeClass } from "@/lib/typographyStyles";

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
                    <InsightsIntroIcon
                        className="text-accent"
                        style={{
                            height: figmaSpace(204),
                            width: figmaSpace(204),
                        }}
                    />
                    <p className={`text-black ${typeClass("insights.introTagline")}`}>
                        The thinking
                        <br />
                        behind the work
                    </p>
                </header>

                <div
                    className="flex flex-col"
                    style={{
                        marginTop: figmaSpace(165),
                        gap: figmaSpace(103),
                    }}
                >
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
                                            className={`text-black ${typeClass("insights.listDate")}`}
                                        >
                                            {dateLabel} &middot; {readTime} min read
                                        </p>
                                    </div>

                                    <div
                                        className="col-span-4 col-start-3 min-w-0"
                                        style={{ paddingLeft: figmaSpace(46) }}
                                    >
                                        <h2
                                            className={`max-w-[43.021vw] text-black transition-colors duration-200 group-hover:text-accent ${typeClass("insights.listTitle")}`}
                                        >
                                            {title}
                                        </h2>
                                        {post.authorName ? (
                                            <p
                                                className={`max-w-[43.021vw] text-black ${typeClass("insights.listAuthor")}`}
                                                style={{ marginTop: figmaSpace(50) }}
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
