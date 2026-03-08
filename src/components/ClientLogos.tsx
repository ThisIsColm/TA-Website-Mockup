"use client";

import Link from "next/link";
import Container from "./Container";
import ScrollReveal from "./ScrollReveal";

const CLIENTS = [
    "Aer Lingus", "Airbnb", "Amazon Music", "Anthropic",
    "Canon", "Dunnes Stores", "Guinness", "Intercom",
    "Jameson", "Other Voices", "Powers", "Shopify",
    "Stripe", "The R&A", "Tourism Ireland", "Warner Records"
];

export default function ClientLogos() {
    return (
        <section className="py-24 lg:py-32 bg-white selection:bg-accent selection:text-white">
            <Container>
                <ScrollReveal>
                    <div className="mb-16 lg:mb-20 max-w-3xl">
                        <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tight text-black mb-4 leading-none">
                            Great work starts with great partners.
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 lg:gap-y-16 py-4">
                    {CLIENTS.map((client, i) => (
                        <ScrollReveal key={client} delay={i * 0.05}>
                            <Link href="/work" className="group flex items-baseline gap-2 w-max">
                                <span className="text-xl md:text-2xl font-bold text-black group-hover:text-accent transition-colors duration-300 tracking-tight">
                                    {client}
                                </span>
                                <span className="whitespace-nowrap text-sm font-medium text-black/40 opacity-0 translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    See projects →
                                </span>
                            </Link>
                        </ScrollReveal>
                    ))}
                </div>
            </Container>
        </section>
    );
}
