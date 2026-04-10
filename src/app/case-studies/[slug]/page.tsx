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
                title: `${post.title} — Tiny Ark Insights`,
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
                title: `${ghostPost.title} — Tiny Ark Insights`,
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
                {/* ── Hero ───────────────────────────────────────────────── */}
                <section className="pt-[72px] pt-32 lg:pt-48 pb-8 lg:pb-12">
                    <Container>
                        <div className="max-w-6xl">
                            <ScrollReveal>
                                <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.05] tracking-[-0.04em]">
                                    {post.title}
                                </h1>
                                <p className="text-lg md:text-xl text-text-secondary mt-6 max-w-4xl leading-relaxed">
                                    {post.excerpt}
                                </p>
                            </ScrollReveal>
                        </div>

                        {/* Post Meta */}
                        <ScrollReveal
                            delay={0.15}
                            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14 pt-8 border-t border-border"
                        >
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                    Date
                                </p>
                                <p className="text-sm text-text-primary">{formattedDate}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                    Author
                                </p>
                                <p className="text-sm text-text-primary">{post.author}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                    Category
                                </p>
                                <p className="text-sm text-text-primary">{post.category}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                    Studio
                                </p>
                                <p className="text-sm text-text-primary">Tiny Ark</p>
                            </div>
                        </ScrollReveal>
                    </Container>
                </section>

                {/* ── Cover Image ────────────────────────────────────────── */}
                <section>
                    <Container>
                        <ScrollReveal>
                            <div className="relative aspect-[16/9] overflow-hidden bg-bg-card">
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
                        <ScrollReveal>
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
            {/* ── Hero ───────────────────────────────────────────────── */}
            <section className="pt-[72px] pt-32 lg:pt-48 pb-8 lg:pb-12">
                <Container>
                    <div className="max-w-6xl">
                        <ScrollReveal>
                            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
                                {ghostPost.title}
                            </h1>
                            {(ghostPost.custom_excerpt || ghostPost.excerpt) && (
                                <p className="text-lg md:text-xl text-text-secondary mt-6 max-w-4xl leading-relaxed">
                                    {ghostPost.custom_excerpt || ghostPost.excerpt}
                                </p>
                            )}
                        </ScrollReveal>
                    </div>

                    {/* Post Meta */}
                    <ScrollReveal
                        delay={0.15}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14 pt-8 border-t border-border"
                    >
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                Published
                            </p>
                            <p className="text-sm text-text-primary">{formattedDate}</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                Author
                            </p>
                            <p className="text-sm text-text-primary">Tiny Ark</p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                Category
                            </p>
                            <p className="text-sm text-text-primary capitalize">
                                {ghostPost.primary_tag?.name || "Case Study"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                Studio
                            </p>
                            <p className="text-sm text-text-primary">Tiny Ark</p>
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
                                className="relative overflow-hidden bg-black shadow-2xl"
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
                                )}{" "}
                            </div>
                        </ScrollReveal>
                    </Container>
                </section>
            )}

            {/* ── Ghost HTML Content ─────────────────────────────────── */}
            {ghostPost.html && (
                <section className="py-16 lg:py-24">
                    <Container>
                        <ScrollReveal>
                            <GhostContent html={ghostPost.html} />
                        </ScrollReveal>
                    </Container>
                </section>
            )}

        </article>
    );
}
