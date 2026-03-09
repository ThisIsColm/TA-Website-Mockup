import type { Metadata } from "next";
import Container from "@/components/Container";
import PostList from "@/components/PostList";
import SectionHeading from "@/components/SectionHeading";
import { fetchPostsByIds, GhostPost } from "@/lib/ghost";
import { getSelections } from "@/lib/db";
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
        category: "Case Study",
        content: "",
    };
}

export default async function CaseStudiesPage() {
    let posts: Post[] = [];

    try {
        const selection = getSelections("case-studies");
        const ghostPosts = await fetchPostsByIds(selection.ghostPostIds);

        if (ghostPosts && ghostPosts.length > 0) {
            posts = ghostPosts.map(ghostToPost);
        } else {
            // No curated posts found or error pulling
        }
    } catch (err) {
        console.error("[case-studies error] Failed to fetch curated Ghost posts:", err);
    }

    return (
        <section className="pt-[72px] py-16 lg:py-24">
            <Container>
                <SectionHeading
                    title="Case Studies"
                    className="-mb-10 mt-10"
                    titleClassName="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tight text-white leading-none"
                />
                <PostList posts={posts} columns={2} />
            </Container>
        </section>
    );
}
