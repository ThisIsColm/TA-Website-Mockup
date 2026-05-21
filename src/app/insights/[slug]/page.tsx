import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/Container";
import GhostContent from "@/components/GhostContent";
import InsightArticleHeader from "@/components/InsightArticleHeader";
import { fetchGhostPostBySlug, GhostPost } from "@/lib/ghost";
import { getPostMetadata } from "@/lib/db";
import { getInsightsPageNeighbors } from "@/lib/insightsGrid";
import { typeClass } from "@/lib/typographyStyles";

export const dynamic = "force-dynamic";

const OUTER = "px-[5.625vw]";

interface InsightPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({
    params,
}: InsightPageProps): Promise<Metadata> {
    const { slug } = await params;

    const ghostPost = await fetchGhostPostBySlug(slug);
    if (ghostPost) {
        return {
            title: ghostPost.title,
            description: ghostPost.custom_excerpt || ghostPost.excerpt,
            openGraph: {
                title: `${ghostPost.title} — Tiny Ark Insights`,
                description: ghostPost.custom_excerpt || ghostPost.excerpt,
                images: ghostPost.feature_image ? [ghostPost.feature_image] : [],
            },
        };
    }

    return {};
}

interface Insight {
    title: string;
    videoHtml: string | null;
    videoAspectRatio: number | null;
    coverImage: string | null;
    html: string | null;
    subtitle?: string;
    authorId?: string;
}

async function loadInsight(slug: string): Promise<Insight | null> {
    const ghostPost = await fetchGhostPostBySlug(slug);
    if (!ghostPost) return null;
    return ghostToInsight(ghostPost);
}

function ghostToInsight(post: GhostPost): Insight {
    const meta = getPostMetadata(post.id);

    return {
        title: post.title,
        videoHtml: post.video_html || null,
        videoAspectRatio: post.video_aspect_ratio ?? null,
        coverImage: post.feature_image,
        html: post.html || null,
        subtitle: post.custom_excerpt || undefined,
        authorId: meta?.insightAuthorId,
    };
}

export default async function InsightPage({ params }: InsightPageProps) {
    const { slug } = await params;
    const data = await loadInsight(slug);
    if (!data) notFound();

    const { prev, next } = await getInsightsPageNeighbors(slug);
    const heroAspect = data.videoAspectRatio || 16 / 9;

    return (
        <article className="bg-white text-black">
            <div data-header-surface="white">
                <InsightArticleHeader
                    title={data.title}
                    subtitle={data.subtitle}
                    authorId={data.authorId}
                />
            </div>

            {data.videoHtml ? (
                <section data-header-surface="dark" className="w-full">
                    <Container>
                        <div
                            className="relative w-full bg-black"
                            style={{ aspectRatio: heroAspect }}
                        >
                            <div
                                className="absolute inset-0 [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:w-full [&>iframe]:h-full"
                                dangerouslySetInnerHTML={{ __html: data.videoHtml }}
                            />
                        </div>
                    </Container>
                </section>
            ) : data.coverImage ? (
                <section data-header-surface="dark" className="w-full">
                    <Container>
                        <div className="relative w-full aspect-video bg-black">
                            <Image
                                src={data.coverImage}
                                alt={data.title}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 88.75vw, 88.75vw"
                                priority
                                unoptimized
                            />
                        </div>
                    </Container>
                </section>
            ) : null}

            {data.html ? (
                <section
                    data-header-surface="white"
                    className="pt-[48px] md:pt-[64px] pb-[60px] md:pb-[80px]"
                >
                    <GhostContent html={data.html} className="insight-article-prose" />
                </section>
            ) : null}

            {(prev || next) && (
                <section
                    data-header-surface="white"
                    className={`pt-[50px] pb-[100px] ${OUTER}`}
                >
                    <div className="grid grid-cols-6 gap-x-[5px] gap-y-[40px] md:gap-y-0 md:items-end">
                        {prev ? (
                            <div className="col-span-6 md:col-span-1 md:col-start-1">
                                <Link
                                    href={`/insights/${prev.slug}`}
                                    className="group inline-block max-w-full text-left"
                                >
                                    <p className="text-[11px] uppercase tracking-[0.08em] text-black/55 mb-[6px]">
                                        Previous
                                    </p>
                                    <h2 className={`text-[#353535] ${typeClass("insights.nextArticleTitle")}`}>
                                        {prev.title}
                                    </h2>
                                </Link>
                            </div>
                        ) : null}
                        {next ? (
                            <div className="col-span-6 md:col-span-4 flex md:justify-end md:col-start-3">
                                <Link
                                    href={`/insights/${next.slug}`}
                                    className="group inline-block max-w-full text-left md:text-right"
                                >
                                    <p className="text-[11px] uppercase tracking-[0.08em] text-black/55 mb-[6px]">
                                        Next Project
                                    </p>
                                    <h2 className={`text-[#353535] ${typeClass("insights.nextArticleTitle")}`}>
                                        {next.title}
                                    </h2>
                                </Link>
                            </div>
                        ) : null}
                    </div>
                </section>
            )}
        </article>
    );
}
