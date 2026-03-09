import type { Metadata } from "next";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import GhostContent from "@/components/GhostContent";
import ScrollReveal from "@/components/ScrollReveal";
import Image from "next/image";
import { fetchGhostPostBySlug } from "@/lib/ghost";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

// EDIT THIS SLUG TO CHANGE THE ARTICLE
const TARGET_POST_SLUG = "branded-stories";

export const metadata: Metadata = {
    title: "Branded Stories",
    description: "Tailored stories and insights from the Tiny Ark team.",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function BrandedStoriesPage() {
    // If the slug is still the placeholder, we can show a helper message or just fetch the first post
    // For now, let's try to fetch the target slug or the latest post if it fails
    let ghostPost = await fetchGhostPostBySlug(TARGET_POST_SLUG);

    if (!ghostPost) {
        // Fallback or helper for the user
        return (
            <section className="pt-[72px] py-16 lg:py-24">
                <Container>
                    <SectionHeading
                        title="Branded Stories"
                        className="mb-12 mt-10"
                        titleClassName="text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-tight text-white leading-none"
                    />
                    <div className="bg-bg-card p-8 border border-border">
                        <h2 className="text-xl font-medium mb-4">No Article Selected</h2>
                        <p className="text-text-secondary mb-6">
                            This page is ready to show a specific Ghost blog article.
                            To display an article, edit the <code>TARGET_POST_SLUG</code> constant in:
                        </p>
                        <code className="block bg-black p-3 mb-6 text-sm">
                            src/app/branded-stories/page.tsx
                        </code>
                        <p className="text-text-secondary">
                            Once you add a valid slug, the article content will appear here automatically.
                        </p>
                    </div>
                </Container>
            </section>
        );
    }

    const formattedDate = new Date(ghostPost.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <article className="pt-[72px]">
            {/* ── Hero ───────────────────────────────────────────────── */}
            <section className="py-16 lg:py-24">
                <Container>
                    <div className="max-w-4xl">
                        <ScrollReveal>
                            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
                                {ghostPost.title}
                            </h1>
                            {(ghostPost.custom_excerpt || ghostPost.excerpt) && (
                                <p className="text-lg md:text-xl text-text-secondary mt-6 max-w-2xl leading-relaxed">
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
                                {ghostPost.primary_tag?.name || "Branded Story"}
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
                        <ScrollReveal className="max-w-3xl mx-auto">
                            <GhostContent html={ghostPost.html} />
                        </ScrollReveal>
                    </Container>
                </section>
            )}
        </article>
    );
}
