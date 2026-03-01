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
            <section className="pt-[72px] py-16 lg:py-24">
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
                            Tiny Ark is a design studio helping ambitious brands create meaningful
                            digital experiences. We combine strategic thinking with meticulous
                            craft to deliver work that makes a difference.
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
                                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&q=80"
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
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                        <ScrollReveal>
                            <h2 className="text-[clamp(1.75rem,4vw,3rem)] font-semibold leading-[1.1] tracking-[-0.03em]">
                                Design with intention.
                                <br />
                                Build with precision.
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal delay={0.15}>
                            <div className="space-y-6 text-text-secondary text-[17px] leading-relaxed">
                                <p>
                                    Founded in 2015, Tiny Ark has grown from a two-person operation
                                    into a full-service creative studio working with brands across
                                    the globe. Our team brings together expertise in design,
                                    technology, and strategy.
                                </p>
                                <p>
                                    We believe the best digital experiences emerge from a deep
                                    understanding of both the brand and its audience. That&apos;s
                                    why every engagement starts with research and strategy before
                                    a single pixel is placed.
                                </p>
                                <p>
                                    Our process is iterative and collaborative. We share early, we
                                    listen deeply, and we refine relentlessly until the work
                                    exceeds expectations.
                                </p>
                            </div>
                        </ScrollReveal>
                    </div>
                </Container>
            </section>

            {/* ── Values ─────────────────────────────────────────────── */}
            <section className="py-section-sm lg:py-section border-t border-border">
                <Container>
                    <ScrollReveal>
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] mb-14">
                            Our Values
                        </h2>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
                        {values.map((value, i) => (
                            <ScrollReveal key={value.number} delay={i * 0.1}>
                                <div className="border-t border-border pt-8">
                                    <span className="text-sm font-medium text-accent">
                                        {value.number}
                                    </span>
                                    <h3 className="text-xl font-semibold mt-3 mb-3">
                                        {value.title}
                                    </h3>
                                    <p className="text-text-secondary text-[15px] leading-relaxed">
                                        {value.description}
                                    </p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── Services ───────────────────────────────────────────── */}
            <section className="py-section-sm lg:py-section border-t border-border">
                <Container>
                    <ScrollReveal>
                        <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] mb-14">
                            Services
                        </h2>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                        {services.map((service, i) => (
                            <ScrollReveal key={service.title} delay={i * 0.08}>
                                <div className="p-6 rounded-[4px] bg-bg-card border border-border hover:border-border/80 transition-colors">
                                    <h3 className="text-lg font-semibold mb-3">
                                        {service.title}
                                    </h3>
                                    <p className="text-sm text-text-secondary leading-relaxed">
                                        {service.description}
                                    </p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── Process ────────────────────────────────────────────── */}
            <section className="py-section-sm lg:py-section border-t border-border">
                <Container>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
                        <ScrollReveal>
                            <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.03em] mb-6">
                                Our Process
                            </h2>
                            <p className="text-text-secondary text-[17px] leading-relaxed">
                                Every project follows a proven yet flexible methodology that
                                ensures clarity, creativity, and quality.
                            </p>
                        </ScrollReveal>

                        <div className="space-y-8">
                            {[
                                {
                                    step: "01",
                                    title: "Discovery & Strategy",
                                    desc: "We immerse ourselves in your brand, audience, and goals to build a strategic foundation.",
                                },
                                {
                                    step: "02",
                                    title: "Concept & Design",
                                    desc: "We explore creative directions and develop refined concepts aligned with the strategy.",
                                },
                                {
                                    step: "03",
                                    title: "Build & Refine",
                                    desc: "We bring designs to life with meticulous production, iterating until every detail is right.",
                                },
                                {
                                    step: "04",
                                    title: "Launch & Support",
                                    desc: "We ensure a smooth launch and provide ongoing support to maximize impact.",
                                },
                            ].map((item, i) => (
                                <ScrollReveal key={item.step} delay={i * 0.1}>
                                    <div className="flex gap-6 items-start">
                                        <span className="text-sm font-medium text-accent mt-1 shrink-0">
                                            {item.step}
                                        </span>
                                        <div>
                                            <h3 className="text-lg font-semibold mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-sm text-text-secondary leading-relaxed">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* ── Contact CTA ────────────────────────────────────────── */}
            <section
                id="contact"
                className="py-section-sm lg:py-section border-t border-border"
            >
                <Container>
                    <ScrollReveal className="text-center max-w-3xl mx-auto">
                        <h2 className="text-[clamp(2rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
                            Let&apos;s create
                            <br />
                            something great.
                        </h2>
                        <p className="text-text-secondary text-lg mt-6 leading-relaxed">
                            Whether you have a clear brief or just a spark of an idea, we&apos;d
                            love to hear from you. Let&apos;s start a conversation.
                        </p>
                        <Link
                            href="mailto:hello@tinyark.com"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-medium rounded-[4px] text-base hover:bg-accent-hover transition-colors duration-300 mt-10"
                        >
                            hello@tinyark.com
                        </Link>
                    </ScrollReveal>
                </Container>
            </section>
        </>
    );
}
