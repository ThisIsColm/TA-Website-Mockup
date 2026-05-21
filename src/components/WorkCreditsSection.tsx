import type { CreditEntry } from "@/lib/credits";
import { typeClass } from "@/lib/typographyStyles";

interface WorkCreditsSectionProps {
    creditsCol3: CreditEntry[];
    creditsCol5: CreditEntry[];
    className?: string;
}

const CREDITS_COLOR = "text-[#959595]";

function CreditColumn({ entries }: { entries: CreditEntry[] }) {
    if (entries.length === 0) return null;

    return (
        <div className="flex flex-col gap-[20px] md:gap-[24px]">
            {entries.map((entry, i) => (
                <div key={`${entry.title}-${i}`}>
                    <p className={`${CREDITS_COLOR} ${typeClass("work.creditsRole")}`}>
                        {entry.title}
                    </p>
                    <p
                        className={`mt-[2px] ${CREDITS_COLOR} ${typeClass("work.creditsName")}`}
                    >
                        {entry.name}
                    </p>
                </div>
            ))}
        </div>
    );
}

export default function WorkCreditsSection({
    creditsCol3,
    creditsCol5,
    className = "",
}: WorkCreditsSectionProps) {
    if (creditsCol3.length === 0 && creditsCol5.length === 0) {
        return null;
    }

    return (
        <section className={className}>
            <div className="grid grid-cols-6 gap-[5px]">
                <div className="col-span-6 md:col-span-1 md:col-start-1">
                    <p className={`${CREDITS_COLOR} ${typeClass("work.creditsHeading")}`}>
                        Credits
                    </p>
                    <p
                        className={`mt-[6px] ${CREDITS_COLOR} ${typeClass("work.creditsBrand")}`}
                    >
                        Tiny Ark
                    </p>
                </div>

                <div className="col-span-6 md:col-span-1 md:col-start-3">
                    <CreditColumn entries={creditsCol3} />
                </div>

                <div className="col-span-6 md:col-span-1 md:col-start-5">
                    <CreditColumn entries={creditsCol5} />
                </div>
            </div>
        </section>
    );
}
