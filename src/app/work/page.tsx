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
                <SectionHeading
                    title="Our Work"
                    className="-mb-10 mt-10"
                    titleClassName="text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-tight text-white leading-none"
                />
                <ProjectGrid projects={projects} />
            </Container>
        </section>
    );
}
