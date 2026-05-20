import type { CreditEntry } from "@/lib/credits";

interface WorkCreditsSectionProps {
    creditsCol3: CreditEntry[];
    creditsCol5: CreditEntry[];
    className?: string;
}

function CreditColumn({ entries }: { entries: CreditEntry[] }) {
    if (entries.length === 0) return null;

    return (
        <div className="flex flex-col gap-[20px] md:gap-[24px]">
            {entries.map((entry, i) => (
                <div key={`${entry.title}-${i}`}>
                    <p
                        className="text-black/45 leading-[1.35]"
                        style={{
                            fontFamily: "Tenon, sans-serif",
                            fontSize: "clamp(0.8rem, 1vw, 15px)",
                            fontWeight: 400,
                        }}
                    >
                        {entry.title}
                    </p>
                    <p
                        className="mt-[2px] text-black leading-[1.35]"
                        style={{
                            fontFamily: "Tenon, sans-serif",
                            fontSize: "clamp(0.875rem, 1.05vw, 16px)",
                            fontWeight: 500,
                        }}
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
                    <p
                        className="text-black/45 leading-[1.35]"
                        style={{
                            fontFamily: "Tenon, sans-serif",
                            fontSize: "clamp(0.8rem, 1vw, 15px)",
                            fontWeight: 400,
                        }}
                    >
                        Credits
                    </p>
                    <p
                        className="mt-[6px] text-black leading-[1.2]"
                        style={{
                            fontFamily: "Tenon, sans-serif",
                            fontSize: "clamp(0.95rem, 1.15vw, 18px)",
                            fontWeight: 700,
                        }}
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
