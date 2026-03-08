import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/Container";
import ScrollReveal from "@/components/ScrollReveal";
import GhostContent from "@/components/GhostContent";
import { getAllProjects, getProjectBySlug } from "@/lib/data";
import { fetchGhostPostBySlug } from "@/lib/ghost";

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
                <section className="pt-[72px] py-16 lg:py-24">
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
                <section className="py-16 lg:py-24">
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

    const formattedDate = new Date(ghostPost.published_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <article>
            {/* ── Hero ───────────────────────────────────────────────── */}
            <section className="pt-[72px] py-16 lg:py-24">
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
                        className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-14 pt-8 border-t border-border"
                    >
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                Published
                            </p>
                            <p className="text-sm text-text-primary">{formattedDate}</p>
                        </div>
                        {ghostPost.primary_tag && (
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
                                    Category
                                </p>
                                <p className="text-sm text-text-primary">{ghostPost.primary_tag.name}</p>
                            </div>
                        )}
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

            {/* ── Back to Work ──────────────────────────────────────── */}
            <section className="border-t border-border py-12">
                <Container>
                    <div className="text-center">
                        <Link
                            href="/work"
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
                            Back to Work
                        </Link>
                    </div>
                </Container>
            </section>
        </article>
    );
}
