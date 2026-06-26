"use client";

import { useState } from "react";
import Link from "next/link";
import InsightsListTitle from "@/components/InsightsListTitle";
import InsightsPostThumbnail from "@/components/InsightsPostThumbnail";
import { typeClass } from "@/lib/typographyStyles";

interface InsightsListArticleProps {
    slug: string;
    title: string;
    coverImage: string;
    dateLabel: string;
    readTime: number;
    authorName?: string;
}

export default function InsightsListArticle({
    slug,
    title,
    coverImage,
    dateLabel,
    readTime,
    authorName,
}: InsightsListArticleProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <article>
            <Link
                href={`/insights/${slug}`}
                className="group flex flex-col gap-4 md:grid md:grid-cols-6 md:gap-x-[5px] md:items-start"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onFocus={() => setHovered(true)}
                onBlur={() => setHovered(false)}
            >
                <div className="md:col-span-2 flex flex-col gap-[5px]">
                    <InsightsPostThumbnail
                        coverImage={coverImage}
                        title={title}
                        hovered={hovered}
                    />
                    <p
                        className={`text-black ${typeClass("insights.listDate")}`}
                    >
                        {dateLabel} &middot; {readTime} min read
                    </p>
                </div>

                <div className="min-w-0 md:col-span-4 md:col-start-3 md:pl-[2.396vw]">
                    <InsightsListTitle title={title} hovered={hovered} />
                    {authorName ? (
                        <p
                            className={`mt-4 max-w-full text-black md:mt-[2.604vw] md:max-w-[43.021vw] ${typeClass("insights.listAuthor")}`}
                        >
                            By {authorName}
                        </p>
                    ) : null}
                </div>
            </Link>
        </article>
    );
}
