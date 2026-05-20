import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/Container";
import ContactPerson from "@/components/ContactPerson";

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Get in touch with Tiny Ark — Dublin-based creative production for film, broadcast, and branded content.",
    openGraph: {
        title: "Contact — Tiny Ark",
        description:
            "Contact Tiny Ark in Dublin to discuss your next film or creative production project.",
    },
};

export default function ContactPage() {
    return (
        <section
            data-header-surface="white"
            className="w-full pt-[100px] md:pt-[120px] pb-[24px]"
        >
            <Container>
                <div className="grid grid-cols-6 md:grid-cols-12 gap-[5px] items-center">
                    <div className="col-span-6 md:col-span-7">
                        <div className="relative w-full aspect-[5524/3107] overflow-hidden bg-[#D7CFC2]">
                            <Image
                                src="/images/contact/fontaines.jpg"
                                alt="Tiny Ark production still"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 58vw"
                                priority
                            />
                        </div>
                    </div>

                    <div className="col-span-6 md:col-span-4 md:col-start-9 pt-[40px] md:pt-0">
                        <h1
                            className="text-black"
                            style={{
                                fontFamily: "Tenon, sans-serif",
                                fontSize: "clamp(2.5rem, 2.5vw, 4rem)",
                                letterSpacing: "-0.02em",
                                lineHeight: 1.1,
                                fontWeight: 900,
                            }}
                        >
                            Let&rsquo;s work together.
                        </h1>

                        <div className="mt-[32px] md:mt-[40px] space-y-[28px]">
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
                            <address
                                className="not-italic text-black"
                                style={{
                                    fontFamily: "Tenon, sans-serif",
                                    fontSize: "clamp(1rem, 1.1vw, 18px)",
                                    lineHeight: 1.55,
                                }}
                            >
                                43 Talbot St
                                <br />
                                Mountjoy
                                <br />
                                Dublin 1
                                <br />
                                D01 KOE8
                            </address>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
