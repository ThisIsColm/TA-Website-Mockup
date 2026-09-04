import { typeClass } from "@/lib/typographyStyles";

const OUTER = "px-[5.625vw]";

type WorkTogetherCtaProps = {
    className?: string;
    /** Tighter bottom padding when the slim footer sits directly below. */
    compact?: boolean;
};

export default function WorkTogetherCta({
    className = "",
    compact = false,
}: WorkTogetherCtaProps) {
    const bottomPadding = compact ? "pb-10 md:pb-12" : "pb-16 md:pb-[100px]";

    return (
        <section
            data-header-surface="white"
            className={`pt-10 md:pt-[50px] ${bottomPadding} ${OUTER} ${className}`}
        >
            <h2
                className={`font-sans font-extrabold text-[#353535] ${typeClass("shared.workTogetherHeading")}`}
            >
                Let&rsquo;s work together.
            </h2>
            <ul className="mt-[20px] md:mt-[24px] space-y-[2px]">
                <li>
                    <a
                        href="mailto:nathan@tinyark.com"
                        className={`text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors ${typeClass("shared.workTogetherEmail")}`}
                    >
                        nathan@tinyark.com
                    </a>
                </li>
                <li>
                    <a
                        href="mailto:gabi@tinyark.com"
                        className={`text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors ${typeClass("shared.workTogetherEmail")}`}
                    >
                        gabi@tinyark.com
                    </a>
                </li>
            </ul>
        </section>
    );
}
