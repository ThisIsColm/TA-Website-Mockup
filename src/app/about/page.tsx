import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn about Tiny Ark — a creative design studio crafting digital experiences with intention and precision.",
    openGraph: {
        title: "About — Tiny Ark",
        description:
            "A creative design studio crafting digital experiences with intention and precision.",
    },
};

const services = [
    {
        title: "Brand Strategy",
        description:
            "We define the strategic foundation — positioning, voice, and visual direction — that gives your brand clarity and purpose.",
    },
    {
        title: "Visual Identity",
        description:
            "From logos to comprehensive brand systems, we create visual identities that are distinctive, cohesive, and enduring.",
    },
    {
        title: "Web Design & Development",
        description:
            "We design and build websites that perform beautifully — fast, accessible, and optimized for conversion.",
    },
    {
        title: "UI/UX Design",
        description:
            "Human-centered design for digital products. We craft interfaces that are intuitive, delightful, and effective.",
    },
    {
        title: "Motion Design",
        description:
            "We bring interfaces and brands to life with purposeful motion — from micro-interactions to full brand animations.",
    },
    {
        title: "Design Systems",
        description:
            "Scalable, documented component libraries and token systems that accelerate your team and ensure consistency.",
    },
];

const values = [
    {
        number: "01",
        title: "Craft Over Convention",
        description:
            "We obsess over the details. Every pixel, every transition, every word is considered and intentional.",
    },
    {
        number: "02",
        title: "Strategy First",
        description:
            "Beautiful design without purpose is decoration. We ground every creative decision in strategic thinking.",
    },
    {
        number: "03",
        title: "Collaborative Process",
        description:
            "The best work happens together. We partner closely with our clients, sharing insights and iterating as a team.",
    },
    {
        number: "04",
        title: "Accessible by Default",
        description:
            "Great design works for everyone. We build inclusively, ensuring our work reaches the widest possible audience.",
    },
];

export default function AboutPage() {
    return (
        <>
            {/* ── Hero ───────────────────────────────────────────────── */}
            <section className="pt-[72px] py-16 lg:py-24 mt-12">
                <Container>
                    <ScrollReveal className="max-w-4xl">
                        <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.05] tracking-[-0.04em]">
                            We are a creative
                            <br />
                            studio built on
                            <br />
                            <span className="text-accent">craft and purpose.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-text-secondary mt-8 max-w-2xl leading-relaxed">
                            Tiny Ark is an independent creative video agency based in Dublin, working globally with brands and cultural institutions.

                        </p>
                    </ScrollReveal>
                </Container>
            </section>

            {/* ── Studio Image ───────────────────────────────────────── */}
            <section>
                <Container>
                    <ScrollReveal>
                        <div className="relative aspect-[21/9] rounded-[4px] overflow-hidden bg-bg-card">
                            <Image
                                src="/images/about/studio.jpg"
                                alt="Tiny Ark studio workspace"
                                fill
                                className="object-cover"
                                sizes="100vw"
                                priority
                            />
                        </div>
                    </ScrollReveal>
                </Container>
            </section>

            {/* ── Philosophy ─────────────────────────────────────────── */}
            <section className="py-section-sm lg:py-section">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0">
                        <ScrollReveal>
                            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-tight text-white mb-4 leading-none">
                                About
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal delay={0.15}>
                            <div className="space-y-6 text-[18px] leading-relaxed">
                                <p>
                                    Tiny Ark began with a simple ambition: to create work that feels timeless in a world obsessed with speed.
                                </p>
                                <p>
                                    Founded as an independent creative studio, Tiny Ark was built on craft — a small, focused team united by a belief that precision, story, and design should never be compromised. What started as a boutique production partnership quickly evolved into a trusted creative collaborator for ambitious brands seeking depth over decoration.
                                </p>
                                <p>
                                    Over the years, Tiny Ark has grown deliberately. Our work expanded from digital content into a multidisciplinary practice that blends strategy, narrative, and execution at the highest level.
                                </p>
                                <p>
                                    Today, we partner with forward-thinking companies to shape ideas into enduring brand experiences. Every engagement begins with clarity. Every output is held to exacting standards.
                                </p>
                                <p>
                                    Because we believe the most powerful brands are not built on noise. They are built on conviction, craft, and restraint.
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>
                </Container>
            </section>

            {/* ── Principles ─────────────────────────────────────────── */}
            <section className="py-section-sm lg:py-section border-t border-border">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0">
                        <ScrollReveal>
                            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-tight text-white mb-4 leading-none">
                                Principles
                            </h2>
                        </ScrollReveal>

                        <div className="space-y-12">
                            {[
                                {
                                    title: "Craft Over Convention",
                                    description: "We obsess over the details. Every pixel, every transition, every word is considered and intentional."
                                },
                                {
                                    title: "Strategy First",
                                    description: "Beautiful design without purpose is decoration. We ground every creative decision in strategic thinking."
                                },
                                {
                                    title: "Collaborative Process",
                                    description: "The best work happens together. We partner closely with our clients, sharing insights and iterating as a team."
                                },
                                {
                                    title: "Accessible by Default",
                                    description: "Great design works for everyone. We build inclusively, ensuring our work reaches the widest possible audience."
                                }
                            ].map((principle, i) => (
                                <ScrollReveal key={principle.title} delay={i * 0.1}>
                                    <h3 className="text-xl font-semibold text-white mb-2">{principle.title}</h3>
                                    <p className="text-text-secondary text-[17px] leading-relaxed">
                                        {principle.description}
                                    </p>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>



            {/* ── Awards ───────────────────────────────────────────── */}
            <section className="py-section-sm lg:py-section border-t border-border">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0">
                        <ScrollReveal>
                            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-medium tracking-tight text-white mb-4 leading-none">
                                Awards
                            </h2>
                        </ScrollReveal>

                        <div className="flex flex-col">
                            {[
                                "Forma Awards",
                                "Linea Prize",
                                "Aperture Design Award",
                                "Novum Awards",
                                "Graphis Honor",
                                "Clarity Design Prize",
                                "Structure Awards",
                                "Archetype Prize",
                                "Lumen Design Award",
                                "Frame Awards",
                                "Axis Design Award",
                                "Vista Awards",
                                "Forma Prize",
                                "Spectrum Awards",
                                "Modus Design Prize",
                            ].map((award, i) => (
                                <ScrollReveal key={award} delay={i * 0.05}>
                                    <div className="py-3 border-b border-white/10 flex justify-between items-center group">
                                        <span className="text-[17px] text-white/90 group-hover:text-white transition-colors">
                                            {award}
                                        </span>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* ── CTA Section ───────────────────────────────────────────── */}
            <section className="pb-section-sm lg:pb-section border-t border-border">
                <Container>
                    <div className="pt-section-sm lg:pt-section">
                        <ScrollReveal className="text-center max-w-5xl mx-auto">
                            <Link href="/about#contact" className="group block py-10 cursor-pointer">
                                <h2 className="text-[clamp(3rem,7vw,6rem)] text-white/85 font-medium group-hover:text-accent group-hover:font-medium leading-[1.05] tracking-[-0.03em] transition-all duration-250 transform translate-y-4 group-hover:-translate-y-2">
                                    Let&apos;s work together.
                                </h2>
                                <p className="text-text-secondary text-[18px] mt-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-100 -mb-350">
                                    Have a project in mind? We&apos;d love to hear about it.
                                </p>
                            </Link>
                        </ScrollReveal>
                    </div>
                </Container>
            </section>
        </>
    );
}
