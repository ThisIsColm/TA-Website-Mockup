"use client";

import ScrollReveal from "./ScrollReveal";

interface SectionHeadingProps {
    title: string;
    count?: number;
    className?: string;
    titleClassName?: string;
}

export default function SectionHeading({
    title,
    count,
    className = "",
    titleClassName = "text-3xl md:text-4xl font-semibold tracking-[-0.03em] text-text-primary",
}: SectionHeadingProps) {
    return (
        <ScrollReveal className={className}>
            <div className="flex items-baseline gap-3 mb-10 lg:mb-14">
                <h2 className={titleClassName}>
                    {title}
                </h2>
                {count !== undefined && (
                    <span className="text-lg text-text-tertiary font-medium">
                        ({count})
                    </span>
                )}
            </div>
        </ScrollReveal>
    );
}
