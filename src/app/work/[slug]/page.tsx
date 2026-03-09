import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/Container";
import ScrollReveal from "@/components/ScrollReveal";
import GhostContent from "@/components/GhostContent";
import ProjectCard from "@/components/ProjectCard";
import { getAllProjects, getProjectBySlug } from "@/lib/data";
import { fetchGhostPostBySlug, fetchAllGhostPosts, GhostPost } from "@/lib/ghost";
import { Project } from "@/types";

// Make this page dynamic so it can fetch from Ghost on request
export const dynamic = "force-dynamic";

interface ProjectPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    const projects = getAllProjects();
    return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
    params,
}: ProjectPageProps): Promise<Metadata> {
    const { slug } = await params;

    // Try hardcoded first
    const project = getProjectBySlug(slug);
    if (project) {
        return {
            title: project.title,
            description: project.excerpt,
            openGraph: {
                title: `${project.title} — Tiny Ark`,
                description: project.excerpt,
                images: [project.coverImage],
            },
        };
    }

    // Try Ghost
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

function ghostToProject(post: GhostPost): Project {
    return {
        slug: post.slug,
        title: post.title,
        excerpt: post.custom_excerpt || post.excerpt || "",
        coverImage: post.feature_image || "",
        tags: post.tags.map(t => t.name),
        date: post.published_at,
        year: new Date(post.published_at).getFullYear().toString(),
        role: "Production",
        services: post.tags.map(t => t.name),
        tools: [],
        content: post.html || "",
        galleryImages: []
    };
}

async function RelatedPosts({ currentSlug }: { currentSlug: string }) {
    const allGhostPosts = await fetchAllGhostPosts();
    const relatedPosts = allGhostPosts
        .filter((p) => p.slug !== currentSlug)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map(ghostToProject);

    if (relatedPosts.length === 0) return null;

    return (
        <section className="border-t border-border pt-16 lg:pt-24 pb-0">
            <Container>
                <ScrollReveal>
                    <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-[-0.03em] mb-12">
                        Explore more of our work.
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedPosts.map((rp, i) => (
                            <ProjectCard key={rp.slug} project={rp} index={i} aspectRatio="aspect-video" />
                        ))}
                    </div>
                </ScrollReveal>
            </Container>
        </section>
    );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;

    // ── Try hardcoded project first ──────────────────────────────
    const project = getProjectBySlug(slug);

    if (project) {
        // Find next project for "Next Project" link
        const allProjects = getAllProjects();
        const currentIndex = allProjects.findIndex((p) => p.slug === slug);
        const nextProject = allProjects[(currentIndex + 1) % allProjects.length];

        return (
            <article>
                {/* ── Hero ───────────────────────────────────────────────── */}
                <section className="pt-[72px] pt-24 lg:pt-32 pb-8 lg:pb-12">
                    <Container>
                        <div className="max-w-4xl">
                            <ScrollReveal>
                                <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.05] tracking-[-0.04em]">
                                    {project.title}
                                </h1>
                                <p className="text-lg md:text-xl text-text-secondary mt-6 max-w-2xl leading-relaxed">
                                    {project.excerpt}
                                </p>
                            </ScrollReveal>
                        </div>

                        {/* Project Meta */}
                        <ScrollReveal
                            delay={0.15}
                            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-14 pt-8 border-t border-border"
                        >
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                    Role
                                </p>
                                <p className="text-sm text-text-primary">{project.role}</p>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                    Services
                                </p>
                                <p className="text-sm text-text-primary">
                                    {project.services.join(", ")}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                    Tools
                                </p>
                                <p className="text-sm text-text-primary">
                                    {project.tools.join(", ")}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                    Year
                                </p>
                                <p className="text-sm text-text-primary">{project.year}</p>
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
                                    src={project.coverImage}
                                    alt={project.title}
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
                <section className="pt-8 lg:pt-12 pb-16 lg:pb-24">
                    <Container>
                        <ScrollReveal className="max-w-3xl mx-auto prose-custom">
                            <div
                                className="space-y-6 text-text-secondary text-[17px] leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: project.content
                                        .split("\n")
                                        .map((line) => {
                                            const trimmed = line.trim();
                                            if (trimmed.startsWith("## "))
                                                return `<h2 class="text-2xl font-semibold text-text-primary mt-12 mb-4 tracking-[-0.02em]">${trimmed.slice(3)}</h2>`;
                                            if (trimmed.startsWith("### "))
                                                return `<h3 class="text-xl font-medium text-text-primary mt-8 mb-3">${trimmed.slice(4)}</h3>`;
                                            if (trimmed === "") return "";
                                            return `<p>${trimmed}</p>`;
                                        })
                                        .join("\n"),
                                }}
                            />
                        </ScrollReveal>
                    </Container>
                </section>

                {/* ── Gallery ────────────────────────────────────────────── */}
                <section className="pb-16 lg:pb-24">
                    <Container>
                        <div className="space-y-6">
                            {project.galleryImages.map((img, i) => (
                                <ScrollReveal key={i} delay={i * 0.1}>
                                    <div className="relative aspect-[16/10] overflow-hidden bg-bg-card">
                                        <Image
                                            src={img}
                                            alt={`${project.title} gallery image ${i + 1}`}
                                            fill
                                            className="object-cover"
                                            sizes="100vw"
                                        />
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </Container>
                </section>

                <RelatedPosts currentSlug={slug} />

                {/* ── Next Project ───────────────────────────────────────── */}
                {nextProject && (
                    <section className="border-t border-border py-16 lg:py-24">
                        <Container>
                            <ScrollReveal className="text-center">
                                <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-4">
                                    Next Project
                                </p>
                                <Link
                                    href={`/work/${nextProject.slug}`}
                                    className="group inline-block"
                                >
                                    <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-[-0.03em] group-hover:text-accent transition-colors duration-300">
                                        {nextProject.title}
                                    </h2>
                                </Link>
                            </ScrollReveal>
                        </Container>
                    </section>
                )}
            </article>
        );
    }

    // ── Try Ghost post ───────────────────────────────────────────
    const ghostPost = await fetchGhostPostBySlug(slug);

    if (!ghostPost) {
        notFound();
    }

    const { getPostMetadata } = await import("@/lib/db");
    const customMeta = getPostMetadata(ghostPost.id);

    return (
        <article>
            {/* ── Hero ───────────────────────────────────────────────── */}
            <section className="pt-[72px] pt-24 lg:pt-32 pb-8 lg:pb-12">
                <Container>
                    <div className="max-w-4xl">
                        <ScrollReveal>
                            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[1.05] tracking-[-0.04em]">
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
                        className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-14 pt-8 border-t border-border"
                    >
                        {customMeta?.director && (
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                    Director
                                </p>
                                <p className="text-sm text-text-primary">{customMeta.director}</p>
                            </div>
                        )}
                        {customMeta?.client && (
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                    Client
                                </p>
                                <p className="text-sm text-text-primary">{customMeta.client}</p>
                            </div>
                        )}
                        {ghostPost.primary_tag && (
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                    Category
                                </p>
                                <p className="text-sm text-text-primary capitalize">{ghostPost.primary_tag.name}</p>
                            </div>
                        )}
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
                                )}
                            </div>
                        </ScrollReveal>
                    </Container>
                </section>
            )}

            {/* ── Ghost HTML Content ─────────────────────────────────── */}
            {ghostPost.html && (
                <section className="pt-8 lg:pt-12 pb-16 lg:pb-24">
                    <Container>
                        <ScrollReveal className="max-w-3xl mx-auto">
                            <GhostContent html={ghostPost.html} />
                        </ScrollReveal>
                    </Container>
                </section>
            )}

            <RelatedPosts currentSlug={slug} />
        </article>
    );
}
