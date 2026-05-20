import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import GhostContent from "@/components/GhostContent";
import WorkCreditsSection from "@/components/WorkCreditsSection";
import type { CreditEntry } from "@/lib/credits";
import { getAllProjects, getProjectBySlug } from "@/lib/data";
import { fetchGhostPostBySlug, GhostPost } from "@/lib/ghost";
import { getWorkPageNeighbors } from "@/lib/homeWorkGrid";

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

function buildMetaHtml(title: string, director?: string): string {
    const directorHtml = director
        ? `<p>Director: ${escapeHtml(director)}</p>`
        : "";
    return `<div class="case-meta"><h1>${escapeHtml(title)}</h1>${directorHtml}</div>`;
}

interface ProjectPageProps {
    params: Promise<{ slug: string }>;
}

// ──────────────────────────────────────────────────────────────────
// Static params + Metadata
// ──────────────────────────────────────────────────────────────────

export async function generateStaticParams() {
    const projects = getAllProjects();
    return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
    params,
}: ProjectPageProps): Promise<Metadata> {
    const { slug } = await params;

    const project = getProjectBySlug(slug);
    if (project) {
        return {
            title: project.title,
            description: project.excerpt,
            openGraph: {
                title: `${project.title} — Tiny Ark`,
                description: project.excerpt,
                images: project.coverImage ? [project.coverImage] : [],
            },
        };
    }

    const ghostPost = await fetchGhostPostBySlug(slug);
    if (ghostPost) {
        return {
            title: ghostPost.title,
            description: ghostPost.custom_excerpt || ghostPost.excerpt,
            openGraph: {
                title: `${ghostPost.title} — Tiny Ark`,
                description: ghostPost.custom_excerpt || ghostPost.excerpt,
                images: ghostPost.feature_image ? [ghostPost.feature_image] : [],
            },
        };
    }

    return {};
}

// ──────────────────────────────────────────────────────────────────
// Unified case-study shape
// ──────────────────────────────────────────────────────────────────

interface CaseStudy {
    title: string;
    videoHtml: string | null;
    videoAspectRatio: number | null;
    coverImage: string | null;
    html: string | null;
    director?: string;
    creditsCol3: CreditEntry[];
    creditsCol5: CreditEntry[];
}

async function loadCaseStudy(slug: string): Promise<CaseStudy | null> {
    // Prefer Ghost when available so editorial content stays fresh.
    const ghostPost = await fetchGhostPostBySlug(slug);
    if (ghostPost) {
        const { getPostMetadata } = await import("@/lib/db");
        const meta = getPostMetadata(ghostPost.id);
        return ghostToCaseStudy(ghostPost, meta);
    }

    const project = getProjectBySlug(slug);
    if (project) {
        return {
            title: project.title,
            videoHtml: project.vimeoId ? buildVimeoIframe(project.vimeoId) : null,
            videoAspectRatio: 16 / 9,
            coverImage: project.coverImage || null,
            html: markdownToHtml(project.content),
            creditsCol3: [],
            creditsCol5: [],
        };
    }

    return null;
}

function ghostToCaseStudy(
    post: GhostPost,
    meta?: {
        director?: string;
        client?: string;
        creditsCol3?: CreditEntry[];
        creditsCol5?: CreditEntry[];
    } | null
): CaseStudy {
    return {
        title: post.title,
        videoHtml: post.video_html || null,
        videoAspectRatio: post.video_aspect_ratio ?? null,
        coverImage: post.feature_image,
        html: post.html || null,
        director: meta?.director,
        creditsCol3: meta?.creditsCol3 ?? [],
        creditsCol5: meta?.creditsCol5 ?? [],
    };
}

function buildVimeoIframe(vimeoId: string): string {
    const src = `https://player.vimeo.com/video/${vimeoId}?color=D86001&title=0&byline=0&portrait=0`;
    return `<iframe src="${src}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
}

function markdownToHtml(markdown: string): string {
    return markdown
        .split("\n")
        .map((line) => {
            const t = line.trim();
            if (t.startsWith("## ")) return `<h2>${t.slice(3)}</h2>`;
            if (t.startsWith("### ")) return `<h3>${t.slice(4)}</h3>`;
            if (t === "") return "";
            return `<p>${t}</p>`;
        })
        .join("\n");
}

// ──────────────────────────────────────────────────────────────────
// Page
// ──────────────────────────────────────────────────────────────────

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;
    const data = await loadCaseStudy(slug);
    if (!data) notFound();

    const { prev, next } = await getWorkPageNeighbors(slug);
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
            <section className="pt-[100px] pb-[15px]">
                <GhostContent
                    html={
                        buildMetaHtml(data.title, data.director) +
                        (data.html || "")
                    }
                    className="case-study-prose"
                />
            </section>

            <WorkCreditsSection
                creditsCol3={data.creditsCol3}
                creditsCol5={data.creditsCol5}
                className={`pt-[13px] pb-[50px] ${OUTER}`}
            />

            {/* ── Prev / Next (same order as home page grid) ────────── */}
            {(prev || next) && (
                <section className={`pt-[50px] pb-[100px] ${OUTER}`}>
                    <div className="grid grid-cols-6 gap-x-[5px] gap-y-[40px] md:gap-y-0 md:items-end">
                        {prev ? (
                            <div className="col-span-6 md:col-span-1 md:col-start-1">
                                <Link
                                    href={`/work/${prev.slug}`}
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
                                    href={`/work/${next.slug}`}
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
