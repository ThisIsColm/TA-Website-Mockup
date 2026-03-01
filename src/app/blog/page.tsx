import type { Metadata } from "next";
import Container from "@/components/Container";
import PostList from "@/components/PostList";
import SectionHeading from "@/components/SectionHeading";
import { getAllPosts } from "@/lib/data";

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Insights on design, branding, motion, and the creative process from the Tiny Ark team.",
    openGraph: {
        title: "Blog — Tiny Ark",
        description:
            "Insights on design, branding, motion, and the creative process.",
    },
};

export default function BlogPage() {
    const posts = getAllPosts();

    return (
        <section className="pt-[72px] py-16 lg:py-24">
            <Container>
                {/* Page Header */}
                <div className="mb-16 lg:mb-24 max-w-3xl">
                    <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
                        Blog
                    </h1>
                    <p className="text-text-secondary text-lg mt-4 leading-relaxed">
                        Thoughts on design, process, and the creative journey — from our
                        studio to yours.
                    </p>
                </div>

                <SectionHeading title="Articles" count={posts.length} />
                <PostList posts={posts} />
            </Container>
        </section>
    );
}
