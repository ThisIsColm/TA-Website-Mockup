import type { Metadata } from "next";
import Container from "@/components/Container";
import PostList from "@/components/PostList";
import SectionHeading from "@/components/SectionHeading";
import { getAllPosts } from "@/lib/data";
import { fetchAllGhostPosts, GhostPost } from "@/lib/ghost";
import { Post } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Case Studies",
    description:
        "Insights on design, branding, motion, and the creative process from the Tiny Ark team.",
    openGraph: {
        title: "Case Studies — Tiny Ark",
        description:
            "Insights on design, branding, motion, and the creative process.",
    },
};

function ghostToPost(post: GhostPost): Post {
    return {
        slug: post.slug,
        title: post.title,
        excerpt: post.custom_excerpt || post.excerpt || "",
        date: post.published_at,
        author: "Tiny Ark",
        coverImage: post.feature_image || "",
        category: post.primary_tag?.name || post.tags[0]?.name || "Case Study",
        content: "",
    };
}

export default async function CaseStudiesPage() {
    let posts: Post[] = [];

    try {
        const ghostPosts = await fetchAllGhostPosts();
        if (ghostPosts && ghostPosts.length > 0) {
            posts = ghostPosts.map(ghostToPost);
        } else {
            posts = getAllPosts();
        }
    } catch (err) {
        console.error("[case-studies error] Failed to fetch Ghost posts:", err);
        posts = getAllPosts();
    }

    return (
        <section className="pt-[72px] py-16 lg:py-24">
            <Container>
                <SectionHeading
                    title="Case Studies"
                    className="-mb-10 mt-10"
                    titleClassName="text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-tight text-white leading-none"
                />
                <PostList posts={posts} columns={2} />
            </Container>
        </section>
    );
}
