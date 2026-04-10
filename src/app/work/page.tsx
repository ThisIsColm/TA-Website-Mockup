import type { Metadata } from "next";
import Container from "@/components/Container";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import { getAllProjects } from "@/lib/data";
import { fetchGhostPosts, fetchPostsByIds, GhostPost } from "@/lib/ghost";
import { getSelections } from "@/lib/db";
import { Project } from "@/types";

export const dynamic = "force-dynamic";

function ghostToProject(post: GhostPost): Project {
    // Extract vimeoId from post HTML for hover previews
    let vimeoId: string | undefined;
    if (post.html) {
        const m = post.html.match(/(?:vimeo\.com\/video\/|vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
        if (m) vimeoId = m[1];
    }

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
        galleryImages: [],
        vimeoId,
    };
}

export const metadata: Metadata = {
    title: "Work",
    description:
        "Explore our portfolio of branding, web design, and digital experience projects.",
    openGraph: {
        title: "Work — Tiny Ark",
        description:
            "Explore our portfolio of branding, web design, and digital experience projects.",
    },
};

export default async function WorkPage() {
    let projects: Project[] = [];

    try {
        const selection = getSelections("work");
        const curatedPosts = await fetchPostsByIds(selection.ghostPostIds);

        if (curatedPosts && curatedPosts.length > 0) {
            projects = curatedPosts.map(ghostToProject).slice(0, 18);
        } else {
            const ghostPostsResponse = await fetchGhostPosts(1, 18);
            if (ghostPostsResponse.posts && ghostPostsResponse.posts.length > 0) {
                projects = ghostPostsResponse.posts.map(ghostToProject).slice(0, 18);
            } else {
                projects = getAllProjects().slice(0, 18);
            }
        }
    } catch (err) {
        console.error("[work page] Failed to fetch Ghost posts:", err);
        projects = getAllProjects().slice(0, 18);
    }

    return (
        <section className="pt-[72px] py-16 lg:py-24">
            <Container>
                <SectionHeading
                    title="Work."
                    className="mt-10"
                    titleClassName="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tight text-white leading-none"
                />

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                    {projects.map((project, index) => (
                        <ProjectCard
                            key={project.slug}
                            project={project}
                            index={index}
                            aspectRatio="aspect-[16/9]"
                            enablePreview={true}
                            overlayTitleOnThumbnail={true}
                        />
                    ))}
                </div>
            </Container>
        </section>
    );
}
