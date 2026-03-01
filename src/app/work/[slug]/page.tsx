import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Container from "@/components/Container";
import ScrollReveal from "@/components/ScrollReveal";
import { getAllProjects, getProjectBySlug } from "@/lib/data";

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
    const project = getProjectBySlug(slug);
    if (!project) return {};

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

export default async function ProjectPage({ params }: ProjectPageProps) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) {
        notFound();
    }

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
                            <div className="flex flex-wrap gap-2 mb-6">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs font-medium px-3 py-1.5 rounded-[2px] bg-bg-elevated text-text-secondary border border-border"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
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
                            <p className="text-xs font-medium uppercase tracking-[0.15em] text-text-tertiary mb-2">
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
                        <div className="relative aspect-[16/9] rounded-[4px] overflow-hidden bg-bg-card">
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
                    <div className="space-y-8">
                        {project.galleryImages.map((img, i) => (
                            <ScrollReveal key={i} delay={i * 0.1}>
                                <div className="relative aspect-[16/10] rounded-[4px] overflow-hidden bg-bg-card">
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
