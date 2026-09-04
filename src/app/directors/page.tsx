import type { Metadata } from "next";
import Container from "@/components/Container";
import WorkTogetherCta from "@/components/WorkTogetherCta";
import { getDirectors } from "@/lib/directors";
import DirectorsList from "./DirectorsList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Directors",
    description:
        "The directors Tiny Ark works with across commercials, music videos, and branded stories.",
    openGraph: {
        title: "Directors — Tiny Ark",
        description:
            "The directors Tiny Ark works with across commercials, music videos, and branded stories.",
    },
};

export default async function DirectorsPage() {
    const directors = await getDirectors();

    return (
        <div
            className="flex min-h-0 flex-1 flex-col bg-white text-black"
            data-header-surface="white"
        >
            {/* Top padding lands the first name at 176px on the 1920 reference,
                with a floor so the list always clears the fixed header. */}
            <section
                data-header-surface="white"
                className="flex min-h-0 flex-1 flex-col pt-[90px] pb-[20px] md:pt-[clamp(100px,8.02vw,154px)]"
            >
                <Container>
                    <DirectorsList directors={directors} />
                </Container>
            </section>

            <WorkTogetherCta compact className="shrink-0" />
        </div>
    );
}
