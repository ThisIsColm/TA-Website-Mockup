import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Container from "@/components/Container";
import ContactPerson from "@/components/ContactPerson";
import ContactPhotoCarousel from "@/components/ContactPhotoCarousel";
import { getContactCarouselImages } from "@/lib/contactCarouselImages";
import { figmaSpace, typeClass } from "@/lib/typographyStyles";

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
    const carouselImages = getContactCarouselImages();

    return (
        <section
            data-header-surface="neutral"
            className="w-full pt-[100px] md:pt-[120px] pb-[24px]"
        >
            <Container>
                <div className="grid grid-cols-6 md:grid-cols-12 gap-x-[5px] gap-y-[40px] md:gap-y-0 items-start">
                    <div className="col-span-6 md:col-span-7">
                        <div className="relative w-full aspect-[5524/3107] overflow-hidden bg-[#D7CFC2]">
                            <ContactPhotoCarousel images={carouselImages} />
                        </div>
                    </div>

                    <div className="col-span-6 md:col-span-4 md:col-start-9 min-w-0">
                        <h1
                            className={`contact-page-heading text-black md:whitespace-nowrap ${typeClass("contact.pageHeading")}`}
                        >
                            Let&rsquo;s work together.
                        </h1>

                        <div
                            className="mt-[32px] max-w-[345px] space-y-[30px] md:mt-[var(--contact-heading-gap)]"
                            style={
                                {
                                    "--contact-heading-gap": figmaSpace(63),
                                } as CSSProperties
                            }
                        >
                            <ContactPerson
                                name="Nathan Reilly"
                                title="CEO"
                                email="nathan@tinyark.com"
                                phone="+353 87 993 2195"
                            />
                            <ContactPerson
                                name="Gabi Chrobak"
                                title="Head of Production"
                                email="gabi@tinyark.com"
                            />
                            <address
                                className={`not-italic text-[#8C8C8C] ${typeClass("contact.address")}`}
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
