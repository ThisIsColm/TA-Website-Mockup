import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import GhostContent from "@/components/GhostContent";
import { fetchGhostPostBySlug, GhostPost } from "@/lib/ghost";
import { getInsightsPageNeighbors } from "@/lib/insightsGrid";

// Make this page dynamic so it can fetch from Ghost on request
export const dynamic = "force-dynamic";

const OUTER = "px-[5.625vw]";

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function buildMetaHtml(title: string, subtitle?: string): string {
    const subtitleHtml = subtitle
        ? `<p>${escapeHtml(subtitle)}</p>`
        : "";
    return `<div class="case-meta"><h1>${escapeHtml(title)}</h1>${subtitleHtml}</div>`;
}

interface InsightPageProps {
    params: Promise<{ slug: string }>;
}

// ──────────────────────────────────────────────────────────────────
// Metadata
// ──────────────────────────────────────────────────────────────────

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

// ──────────────────────────────────────────────────────────────────
// Unified insight shape (mirrors the work case-study shape)
// ──────────────────────────────────────────────────────────────────

interface Credit {
    label: string;
    value: string;
}

interface Insight {
    title: string;
    videoHtml: string | null;
    videoAspectRatio: number | null;
    coverImage: string | null;
    html: string | null;
    subtitle?: string;
    credits: Credit[];
}

async function loadInsight(slug: string): Promise<Insight | null> {
    const ghostPost = await fetchGhostPostBySlug(slug);
    if (!ghostPost) return null;
    return ghostToInsight(ghostPost);
}

function ghostToInsight(post: GhostPost): Insight {
    const credits: Credit[] = [];

    if (post.published_at) {
        credits.push({
            label: "Published",
            value: new Date(post.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
        });
    }
    credits.push({ label: "Author", value: "Tiny Ark" });
    if (post.primary_tag?.name) {
        credits.push({ label: "Category", value: post.primary_tag.name });
    }
    const otherTags = post.tags
        .filter((t) => t.id !== post.primary_tag?.id)
        .map((t) => t.name);
    if (otherTags.length) {
        credits.push({ label: "Tags", value: otherTags.join(", ") });
    }

    return {
        title: post.title,
        videoHtml: post.video_html || null,
        videoAspectRatio: post.video_aspect_ratio ?? null,
        coverImage: post.feature_image,
        html: post.html || null,
        subtitle: post.custom_excerpt || undefined,
        credits,
    };
}

// ──────────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────────

export default async function InsightPage({ params }: InsightPageProps) {
    const { slug } = await params;
    const data = await loadInsight(slug);
    if (!data) notFound();

    const { prev, next } = await getInsightsPageNeighbors(slug);
    const heroAspect = data.videoAspectRatio || 16 / 9;

    return (
        <article className="bg-white text-black">
            {/* ── Hero: Vimeo video full-bleed; cover image inset with page padding. ─ */}
            {data.videoHtml ? (
                <section
                    data-header-surface="dark"
                    className="relative w-full bg-black"
                >
                    <div
                        className="relative w-full"
                        style={{ aspectRatio: heroAspect }}
                    >
                        <div
                            className="absolute inset-0 [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:w-full [&>iframe]:h-full"
                            dangerouslySetInnerHTML={{ __html: data.videoHtml }}
                        />
                    </div>
                </section>
            ) : data.coverImage ? (
                <section
                    data-header-surface="dark"
                    className={`relative w-full ${OUTER}`}
                >
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
                </section>
            ) : null}

            <div data-header-surface="white">
            {/* ── Title + Body content (padded; hero Vimeo is the only full-bleed) ─ */}
            <section className="pt-[100px] pb-[60px]">
                <GhostContent
                    html={
                        buildMetaHtml(data.title, data.subtitle) +
                        (data.html || "")
                    }
                    className="case-study-prose"
                />
            </section>

            {/* ── Credits ───────────────────────────────────────────── */}
            {data.credits.length > 0 && (
                <section className={`pt-[50px] pb-[50px] ${OUTER}`}>
                    <div className="grid grid-cols-6 gap-[5px]">
                        <div className="col-span-6 md:col-span-4 md:col-start-3 grid grid-cols-2 md:grid-cols-3 gap-x-[20px] gap-y-[24px]">
                            {data.credits.map((c) => (
                                <div key={c.label}>
                                    <p className="text-[11px] uppercase tracking-[0.08em] text-black/55 mb-[4px]">
                                        {c.label}
                                    </p>
                                    <p className="text-[14px] md:text-[15px] font-medium text-black leading-[1.3]">
                                        {c.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Prev / Next (same layout as work case study) ──────── */}
            {(prev || next) && (
                <section className={`pt-[50px] pb-[100px] ${OUTER}`}>
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
                                    <h2 className="text-[clamp(1.15rem,2.2vw,1.75rem)] font-black tracking-[-0.02em] text-accent group-hover:text-accent-hover transition-colors leading-tight">
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
                                        Next
                                    </p>
                                    <h2 className="text-[clamp(1.15rem,2.2vw,1.75rem)] font-black tracking-[-0.02em] text-accent group-hover:text-accent-hover transition-colors leading-tight">
                                        {next.title}
                                    </h2>
                                </Link>
                            </div>
                        ) : null}
                    </div>
                </section>
            )}
            </div>
        </article>
    );
}
