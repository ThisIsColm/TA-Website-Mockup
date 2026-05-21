const OUTER = "px-[5.625vw]";

export default function WorkTogetherCta() {
    return (
        <section
            data-header-surface="white"
            className={`pt-[50px] pb-[100px] ${OUTER}`}
        >
            <h2
                className="text-[clamp(1.75rem,3.021vw,58px)] font-extrabold tracking-[-0.02em] text-black leading-[0.82]"
                style={{ fontFamily: "Tenon, sans-serif" }}
            >
                Let&rsquo;s work together.
            </h2>
            <ul className="mt-[20px] md:mt-[24px] space-y-[2px]">
                <li>
                    <a
                        href="mailto:nathan@tinyark.com"
                        className="text-[clamp(1rem,1.875vw,36px)] font-normal leading-none tracking-[-0.02em] text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                        style={{ fontFamily: "Tenon, sans-serif" }}
                    >
                        nathan@tinyark.com
                    </a>
                </li>
                <li>
                    <a
                        href="mailto:gabi@tinyark.com"
                        className="text-[clamp(1rem,1.875vw,36px)] font-normal leading-none tracking-[-0.02em] text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                        style={{ fontFamily: "Tenon, sans-serif" }}
                    >
                        gabi@tinyark.com
                    </a>
                </li>
            </ul>
        </section>
    );
}
