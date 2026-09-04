import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GhostContent from "@/components/GhostContent";
import { splitDirectorHtml } from "@/lib/directorHtml";
import { getDirectorBySlug } from "@/lib/directors";
import { splitDirectorNameLines } from "@/lib/directorsShared";
import { typeClass } from "@/lib/typographyStyles";

export const dynamic = "force-dynamic";

interface DirectorPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({
    params,
}: DirectorPageProps): Promise<Metadata> {
    const { slug } = await params;
    const director = await getDirectorBySlug(slug);

    if (!director) return {};

    const { post, name } = director;
    const description = post.custom_excerpt || post.excerpt || undefined;

    return {
        title: name,
        description,
        openGraph: {
            title: `${name} — Tiny Ark`,
            description,
            images: post.feature_image ? [post.feature_image] : [],
        },
    };
}

export default async function DirectorPage({ params }: DirectorPageProps) {
    const { slug } = await params;
    const director = await getDirectorBySlug(slug);

    if (!director) notFound();

    const { post, name } = director;
    const bodyHtml = [post.video_html, post.html].filter(Boolean).join("");
    const { introHtml, mediaHtml } = splitDirectorHtml(bodyHtml);
    const { first: nameFirst, last: nameLast } = splitDirectorNameLines(name);

    return (
        <article className="bg-white text-black" data-header-surface="white">
            {/* Figma @ 1920: name + intro top at 177px; floor clears the fixed header. */}
            <section
                data-header-surface="white"
                className="pt-[clamp(100px,9.22vw,177px)] pb-[clamp(48px,5.2vw,100px)]"
            >
                <div className="director-prose">
                    <h1
                        className={`director-meta-name ${typeClass("directors.pageName")}`}
                    >
                        {nameFirst}
                        {nameLast ? (
                            <>
                                <br />
                                {nameLast}
                            </>
                        ) : null}
                    </h1>

                    {introHtml ? (
                        <GhostContent html={introHtml} className="director-intro" />
                    ) : null}
                </div>

                {mediaHtml ? (
                    <div className="director-media">
                        <GhostContent html={mediaHtml} className="director-media-body" />
                    </div>
                ) : null}
            </section>
        </article>
    );
}
