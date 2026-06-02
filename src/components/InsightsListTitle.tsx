"use client";

import { typeClass } from "@/lib/typographyStyles";

interface InsightsListTitleProps {
    title: string;
    hovered?: boolean;
}

export default function InsightsListTitle({
    title,
    hovered = false,
}: InsightsListTitleProps) {
    return (
        <h2
            className={`max-w-full transition-colors duration-200 md:max-w-[43.021vw] ${
                hovered ? "text-accent" : "text-black"
            } ${typeClass("insights.listTitle")}`}
        >
            {title}
        </h2>
    );
}
