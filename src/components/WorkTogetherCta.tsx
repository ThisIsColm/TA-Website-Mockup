import { typeClass } from "@/lib/typographyStyles";

const OUTER = "px-[5.625vw]";

export default function WorkTogetherCta() {
    return (
        <section
            data-header-surface="white"
            className={`pt-[50px] pb-[100px] ${OUTER}`}
        >
            <h2 className={`text-[#353535] ${typeClass("shared.workTogetherHeading")}`}>
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
