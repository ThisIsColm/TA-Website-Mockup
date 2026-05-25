import Image from "next/image";
import Container from "@/components/Container";
import { getAuthorPortraitSrc, getTeamAuthor } from "@/lib/team";
import { typeClass } from "@/lib/typographyStyles";

interface InsightArticleHeaderProps {
    title: string;
    subtitle?: string;
    authorId?: string;
}

export default function InsightArticleHeader({
    title,
    subtitle,
    authorId,
}: InsightArticleHeaderProps) {
    const author = getTeamAuthor(authorId);
    const portraitSrc = author ? getAuthorPortraitSrc(author) : null;

    return (
        <section className="pt-[80px] md:pt-[120px] pb-[40px] md:pb-[64px]">
            <Container>
                <div className="grid grid-cols-6 gap-x-[5px] gap-y-[28px] md:gap-y-0 items-start">
                    <aside className="col-span-6 md:col-span-2">
                        <div className="relative w-1/2 aspect-[280/320] overflow-hidden bg-[#D7CFC2]">
                            {portraitSrc && author ? (
                                <Image
                                    src={portraitSrc}
                                    alt={`Portrait of ${author.name}`}
                                    fill
                                    className="object-cover object-top"
                                    sizes="(max-width: 768px) 45vw, 17vw"
                                    priority
                                />
                            ) : null}
                        </div>
                        {author ? (
                            <p
                                className={`mt-[12px] w-1/2 text-[#353535] ${typeClass("insights.articleHeaderByline")}`}
                            >
                                By {author.name}
                            </p>
                        ) : null}
                    </aside>

                    <div className="col-span-6 md:col-span-4 md:col-start-3">
                        <h1
                            className={`text-black capitalize ${typeClass("insights.articleHeaderTitle")}`}
                        >
                            {title}
                        </h1>
                        {subtitle ? (
                            <p
                                className={`mt-[24px] md:mt-[28px] text-black max-w-[52ch] ${typeClass("insights.articleHeaderSubtitle")}`}
                            >
                                {subtitle}
                            </p>
                        ) : null}
                    </div>
                </div>
            </Container>
        </section>
    );
}
