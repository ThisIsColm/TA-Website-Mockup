import type { Metadata } from "next";
import Container from "@/components/Container";
import InsightsIntroIcon from "@/components/InsightsIntroIcon";
import InsightsListArticle from "@/components/InsightsListArticle";
import { fetchPostsByIds, GhostPost } from "@/lib/ghost";
import { getPostMetadata, getSelections } from "@/lib/db";
import { getInsightDisplayTitle } from "@/lib/insightTitle";
import { getTeamAuthor } from "@/lib/team";
import { typeClass } from "@/lib/typographyStyles";

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
        title: getInsightDisplayTitle(post.id, post.title),
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
            className="insights-page-bg pt-[100px] md:pt-[110px] pb-[100px] md:pb-[140px]"
        >
            <Container>
                <header className="flex flex-col items-center text-center">
                    <InsightsIntroIcon
                        className="text-accent h-[clamp(72px,18vw,204px)] w-[clamp(72px,18vw,204px)]"
                    />
                    <p
                        className={`text-accent uppercase ${typeClass("insights.introTagline")}`}
                    >
                        The thinking
                        <br />
                        behind the work
                    </p>
                </header>

                <div className="mt-12 flex flex-col gap-12 md:mt-[8.594vw] md:gap-[5.365vw]">
                    {posts.map((post) => (
                        <InsightsListArticle
                            key={post.slug}
                            slug={post.slug}
                            title={post.title}
                            coverImage={post.coverImage}
                            dateLabel={formatDate(post.date)}
                            readTime={estimateReadTime(post.excerpt)}
                            authorName={post.authorName}
                        />
                    ))}
                </div>
            </Container>
        </section>
    );
}
