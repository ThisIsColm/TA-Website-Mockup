import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Get in touch with Tiny Ark — Dublin studio for film, commercials, and creative production.",
    openGraph: {
        title: "Contact — Tiny Ark",
        description:
            "Let's work together. Reach Nathan, Gabi, or visit us on Talbot Street, Dublin.",
    },
};

const BEIGE = "#EAE4DD";
const TEXT_MUTED = "rgba(255, 255, 255, 0.55)";
const GRAY_BAND = "#1A1A1A";

export default function ContactPage() {
    return (
        <div className="min-h-screen">
            {/* ── Hero: 4-col image + 2-col copy (beige) ─────────────── */}
            <section className="pt-[120px] md:pt-[160px] pb-[80px] md:pb-[120px] text-black" style={{ backgroundColor: BEIGE }}>
                <Container>
                    <div className="grid grid-cols-6 gap-[5px] items-start">
                        <div className="col-span-6 md:col-span-4">
                            <div className="relative w-full aspect-[16/10] md:aspect-[4/3] overflow-hidden bg-[#D7CFC2]">
                                <Image
                                    src="/images/contact/fontaines.jpg"
                                    alt="Tiny Ark production still"
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, 66vw"
                                    priority
                                />
                            </div>
                        </div>

                        <div className="col-span-6 md:col-span-2 pt-[40px] md:pt-0 md:pl-[clamp(8px,1vw,20px)]">
                            <h1
                                style={{
                                    fontFamily: "Tenon, sans-serif",
                                    fontSize: "clamp(2.5rem, 2.5vw, 4rem)",
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1.1,
                                    fontWeight: 900,
                                    color: "#000",
                                }}
                            >
                                Let&rsquo;s work together.
                            </h1>

                            <div className="mt-[40px] md:mt-[48px] space-y-[36px]">
                                <ContactPerson
                                    name="Nathan Reilly"
                                    title="CEO"
                                    email="nathan@tinyark.com"
                                    phone="+353 (87) 993 2195"
                                />
                                <ContactPerson
                                    name="Gabi Chrobak"
                                    title="Head of Production"
                                    email="gabi@tinyark.com"
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ── Info band (near-black grey) ─────────────────────────── */}
            <section style={{ backgroundColor: GRAY_BAND }}>
                <Container>
                    <div
                        className="grid grid-cols-1 md:grid-cols-3 gap-[48px] md:gap-[5px] py-[60px] md:py-[80px] text-white"
                        style={{
                            fontFamily: "Tenon, sans-serif",
                        }}
                    >
                        {/* Address */}
                        <div>
                            <p
                                className="mb-[12px]"
                                style={{
                                    fontSize: "clamp(0.75rem, 0.8vw, 14px)",
                                    fontWeight: 700,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    color: TEXT_MUTED,
                                }}
                            >
                                Dublin
                            </p>
                            <p
                                style={{
                                    fontSize: "clamp(1rem, 1.1vw, 18px)",
                                    lineHeight: 1.55,
                                    color: "#fff",
                                }}
                            >
                                43 Talbot St
                                <br />
                                Mountjoy
                                <br />
                                Dublin 1
                                <br />
                                D01 KOE8
                            </p>
                        </div>

                        {/* Email */}
                        <div>
                            <p
                                className="mb-[12px]"
                                style={{
                                    fontSize: "clamp(0.75rem, 0.8vw, 14px)",
                                    fontWeight: 700,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    color: TEXT_MUTED,
                                }}
                            >
                                Email
                            </p>
                            <div className="space-y-[10px]">
                                <a
                                    href="mailto:nathan@tinyark.com"
                                    className="block text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                                    style={{ fontSize: "clamp(1rem, 1.1vw, 18px)", lineHeight: 1.4 }}
                                >
                                    nathan@tinyark.com
                                </a>
                                <a
                                    href="mailto:gabi@tinyark.com"
                                    className="block text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                                    style={{ fontSize: "clamp(1rem, 1.1vw, 18px)", lineHeight: 1.4 }}
                                >
                                    gabi@tinyark.com
                                </a>
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <p
                                className="mb-[12px]"
                                style={{
                                    fontSize: "clamp(0.75rem, 0.8vw, 14px)",
                                    fontWeight: 700,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    color: TEXT_MUTED,
                                }}
                            >
                                Phone
                            </p>
                            <div className="space-y-[10px]">
                                <a
                                    href="tel:+353879932195"
                                    className="block text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                                    style={{ fontSize: "clamp(1rem, 1.1vw, 18px)", lineHeight: 1.4 }}
                                >
                                    +353 (87) 993 2195
                                </a>
                                <a
                                    href="tel:+35319051082"
                                    className="block text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                                    style={{ fontSize: "clamp(1rem, 1.1vw, 18px)", lineHeight: 1.4 }}
                                >
                                    +353 (1) 905 1082
                                </a>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ── White spacer before beige footer (matches about / home) ─ */}
            <section className="bg-white pt-[40px] md:pt-[60px] pb-[100px] md:pb-[140px]" aria-hidden="true" />
        </div>
    );
}

function ContactPerson({
    name,
    title,
    email,
    phone,
}: {
    name: string;
    title: string;
    email: string;
    phone?: string;
}) {
    return (
        <div>
            <p
                style={{
                    fontFamily: "Tenon, sans-serif",
                    fontSize: "clamp(1.25rem, 1.4vw, 24px)",
                    fontWeight: 700,
                    color: "#000",
                    lineHeight: 1.15,
                }}
            >
                {name}
            </p>
            <p
                style={{
                    fontFamily: "Tenon, sans-serif",
                    fontSize: "clamp(0.85rem, 0.95vw, 15px)",
                    color: "rgba(0,0,0,0.55)",
                    marginTop: "4px",
                }}
            >
                {title}
            </p>
            <a
                href={`mailto:${email}`}
                className="block mt-[10px] text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                style={{
                    fontFamily: "Tenon, sans-serif",
                    fontSize: "clamp(1rem, 1.1vw, 18px)",
                }}
            >
                {email}
            </a>
            {phone ? (
                <a
                    href={`tel:${phone.replace(/\s|\(|\)|-/g, "")}`}
                    className="block mt-[6px] text-accent hover:text-accent-hover underline underline-offset-4 decoration-1 transition-colors"
                    style={{
                        fontFamily: "Tenon, sans-serif",
                        fontSize: "clamp(1rem, 1.1vw, 18px)",
                    }}
                >
                    {phone}
                </a>
            ) : null}
        </div>
    );
}