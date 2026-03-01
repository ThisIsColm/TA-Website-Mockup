import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/Container";
import ScrollReveal from "@/components/ScrollReveal";
import GhostContent from "@/components/GhostContent";
import { getAllPosts, getPostBySlug } from "@/lib/data";
import { fetchGhostPostBySlug } from "@/lib/ghost";

// Make this page dynamic so it can fetch from Ghost on request
export const dynamic = "force-dynamic";

interface CaseStudyPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
    params,
}: CaseStudyPageProps): Promise<Metadata> {
    const { slug } = await params;

    const post = getPostBySlug(slug);
    if (post) {
        return {
            title: post.title,
            description: post.excerpt,
            openGraph: {
                title: `${post.title} — Tiny Ark Case Studies`,
                description: post.excerpt,
                images: [post.coverImage],
            },
        };
    }

    const ghostPost = await fetchGhostPostBySlug(slug);
    if (ghostPost) {
        return {
            title: ghostPost.title,
            description: ghostPost.custom_excerpt || ghostPost.excerpt,
            openGraph: {
                title: `${ghostPost.title} — Tiny Ark Case Studies`,
                description: ghostPost.custom_excerpt || ghostPost.excerpt,
                images: ghostPost.feature_image ? [ghostPost.feature_image] : [],
            },
        };
    }

    return {};
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
    const { slug } = await params;

    // ── Try hardcoded post first ─────────────────────────────────
    const post = getPostBySlug(slug);

    if (post) {
        const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        return (
            <article>
                {/* ── Header ─────────────────────────────────────────────── */}
                <section className="pt-[72px] py-16 lg:py-24">
                    <Container>
                        <ScrollReveal className="max-w-3xl mx-auto text-center">
                            <span className="text-xs font-medium px-3 py-1.5 rounded-[4px] bg-bg-elevated text-text-secondary border border-border">
                                {post.category}
                            </span>
                            <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] mt-6">
                                {post.title}
                            </h1>
                            <div className="flex items-center justify-center gap-3 mt-6 text-sm text-text-tertiary">
                                <span>{post.author}</span>
                                <span>·</span>
                                <time dateTime={post.date}>{formattedDate}</time>
                            </div>
                        </ScrollReveal>
                    </Container>
                </section>

                {/* ── Cover Image ────────────────────────────────────────── */}
                <section>
                    <Container>
                        <ScrollReveal>
                            <div className="relative aspect-[16/9] rounded-[4px] overflow-hidden bg-bg-card max-w-5xl mx-auto">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    sizes="100vw"
                                    priority
                                />
                            </div>
                        </ScrollReveal>
                    </Container>
                </section>

                {/* ── Content ────────────────────────────────────────────── */}
                <section className="py-16 lg:py-24">
                    <Container>
                        <ScrollReveal className="max-w-3xl mx-auto">
                            <div
                                className="space-y-6 text-text-secondary text-[17px] leading-[1.8]"
                                dangerouslySetInnerHTML={{
                                    __html: post.content
                                        .split("\n")
                                        .map((line) => {
                                            const trimmed = line.trim();
                                            if (trimmed.startsWith("## "))
                                                return `<h2 class="text-2xl font-semibold text-text-primary mt-12 mb-4 tracking-[-0.02em]">${trimmed.slice(3)}</h2>`;
                                            if (trimmed.startsWith("### "))
                                                return `<h3 class="text-xl font-medium text-text-primary mt-8 mb-3">${trimmed.slice(4)}</h3>`;
                                            if (trimmed.startsWith("- "))
                                                return `<li class="ml-4 list-disc">${trimmed.slice(2)}</li>`;
                                            if (trimmed.startsWith("1. ") || trimmed.startsWith("2. ") || trimmed.startsWith("3. "))
                                                return `<li class="ml-4 list-decimal"><strong>${trimmed.split("**")[1] || ""}</strong>${trimmed.split("**").slice(2).join("**")}</li>`;
                                            if (trimmed === "") return "";
                                            return `<p>${trimmed.replace(
                                                /\*\*(.*?)\*\*/g,
                                                "<strong class='text-text-primary'>$1</strong>"
                                            )}</p>`;
                                        })
                                        .join("\n"),
                                }}
                            />
                        </ScrollReveal>
                    </Container>
                </section>

                {/* ── Back to Case Studies ───────────────────────────────── */}
                <section className="border-t border-border py-12">
                    <Container>
                        <div className="text-center">
                            <Link
                                href="/case-studies"
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
                                Back to Case Studies
                            </Link>
                        </div>
                    </Container>
                </section>
            </article>
        );
    }

    // ── Try Ghost post ───────────────────────────────────────────
    const ghostPost = await fetchGhostPostBySlug(slug);

    if (!ghostPost) {
        notFound();
    }

    const formattedDate = new Date(ghostPost.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <article>
            {/* ── Header ─────────────────────────────────────────────── */}
            <section className="pt-[72px] py-16 lg:py-24">
                <Container>
                    <ScrollReveal className="max-w-3xl mx-auto text-center">
                        {ghostPost.primary_tag && (
                            <span className="text-xs font-medium px-3 py-1.5 rounded-[4px] bg-bg-elevated text-text-secondary border border-border">
                                {ghostPost.primary_tag.name}
                            </span>
                        )}
                        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em] mt-6">
                            {ghostPost.title}
                        </h1>
                        <div className="flex items-center justify-center gap-3 mt-6 text-sm text-text-tertiary">
                            <span>Tiny Ark</span>
                            <span>·</span>
                            <time dateTime={ghostPost.published_at}>{formattedDate}</time>
                        </div>
                    </ScrollReveal>
                </Container>
            </section>

            {/* ── Hero Video/Image ────────────────────────────────────── */}
            {(ghostPost.video_html || ghostPost.feature_image) && (
                <section>
                    <Container>
                        <ScrollReveal>
                            <div
                                className="relative rounded-[4px] overflow-hidden bg-black max-w-5xl mx-auto shadow-2xl"
                                style={{ aspectRatio: ghostPost.video_aspect_ratio || 16 / 9 }}
                            >
                                {ghostPost.video_html ? (
                                    <div
                                        className="absolute inset-0 w-full h-full [&>iframe]:absolute [&>iframe]:inset-0 [&>iframe]:w-full [&>iframe]:h-full"
                                        dangerouslySetInnerHTML={{ __html: ghostPost.video_html }}
                                    />
                                ) : (
                                    <Image
                                        src={ghostPost.feature_image!}
                                        alt={ghostPost.title}
                                        fill
                                        className="object-cover"
                                        sizes="100vw"
                                        priority
                                        unoptimized
                                    />
                                )}
                            </div>
                        </ScrollReveal>
                    </Container>
                </section>
            )}

            {/* ── Ghost HTML Content ─────────────────────────────────── */}
            {ghostPost.html && (
                <section className="py-16 lg:py-24">
                    <Container>
                        <ScrollReveal className="max-w-3xl mx-auto">
                            <GhostContent html={ghostPost.html} />
                        </ScrollReveal>
                    </Container>
                </section>
            )}

            {/* ── Back to Case Studies ───────────────────────────────── */}
            <section className="border-t border-border py-12">
                <Container>
                    <div className="text-center">
                        <Link
                            href="/case-studies"
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
                            Back to Case Studies
                        </Link>
                    </div>
                </Container>
            </section>
        </article>
    );
}
