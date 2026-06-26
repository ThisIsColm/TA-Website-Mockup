import type { Metadata } from "next";
import Container from "@/components/Container";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import { getAllProjects } from "@/lib/data";
import { fetchGhostPosts, fetchPostsByIds, GhostPost } from "@/lib/ghost";
import { getPostMetadata, getSelections } from "@/lib/db";
import { getWorkDisplayTitle } from "@/lib/workTitle";
import { typeClass } from "@/lib/typographyStyles";
import { Project } from "@/types";

export const dynamic = "force-dynamic";

function ghostToProject(post: GhostPost): Project {
    // Extract vimeoId from post HTML for hover previews
    let vimeoId: string | undefined;
    if (post.html) {
        const m = post.html.match(/(?:vimeo\.com\/video\/|vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
        if (m) vimeoId = m[1];
    }

    const meta = getPostMetadata(post.id);

    return {
        slug: post.slug,
        title: getWorkDisplayTitle(post.id, post.title),
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
        previewStartTime: meta?.previewStartTime,
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
        const selection = getSelections("home.selectedWork");
        const curatedPosts = await fetchPostsByIds(selection.ghostPostIds);

        if (curatedPosts && curatedPosts.length > 0) {
            projects = curatedPosts.map(ghostToProject).slice(0, 16);
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
        <section className="pt-[88px] pb-16 md:pt-[72px] md:pb-16 lg:pb-24">
            <Container>
                <SectionHeading
                    title="Work."
                    className="mt-10"
                    titleClassName={`${typeClass("shared.listingPageTitle")} text-white leading-none`}
                />

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 md:mt-10 md:gap-y-8">
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
