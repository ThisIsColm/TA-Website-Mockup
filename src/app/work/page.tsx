import type { Metadata } from "next";
import Container from "@/components/Container";
import ProjectGrid from "@/components/ProjectGrid";
import SectionHeading from "@/components/SectionHeading";
import { getAllProjects } from "@/lib/data";

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

export default function WorkPage() {
    const projects = getAllProjects();

    return (
        <section className="pt-[72px] py-16 lg:py-24">
            <Container>
                {/* Page Header */}
                <div className="mb-16 lg:mb-24 max-w-3xl">
                    <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
                        Our Work
                    </h1>
                    <p className="text-text-secondary text-lg mt-4 leading-relaxed">
                        A curated selection of projects spanning branding, web design,
                        UI/UX, and motion — each crafted with intention and precision.
                    </p>
                </div>

                <SectionHeading title="Projects" count={projects.length} />
                <ProjectGrid projects={projects} />
            </Container>
        </section>
    );
}
