import type { Metadata } from "next";
import Container from "@/components/Container";
import PostList from "@/components/PostList";
import SectionHeading from "@/components/SectionHeading";
import { getAllPosts } from "@/lib/data";

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

export default function CaseStudiesPage() {
    const posts = getAllPosts();

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
