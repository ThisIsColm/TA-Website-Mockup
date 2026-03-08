"use client";

import Container from "./Container";
import ScrollReveal from "./ScrollReveal";

const CLIENTS = [
    "Aer Lingus", "Airbnb", "Amazon Music", "Anthropic",
    "Canon", "Guinness", "Intercom", "Jameson",
    "Powers", "Shopify", "Stripe", "Warner Records"
];

export default function ClientLogos() {
    return (
        <section className="py-24 lg:py-32 bg-bg">
            <Container>
                <ScrollReveal>
                    <div className="mb-16 lg:mb-20 max-w-5xl">
                        <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tight text-white mb-4 uppercase leading-none">
                            Great Work Starts With Great Partners
                        </h2>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-12 lg:gap-y-20">
                    {CLIENTS.map((client, i) => (
                        <ScrollReveal key={client} delay={i * 0.05}>
                            <div className="group">
                                <span className="text-xl md:text-2xl lg:text-3xl font-bold text-white/40 group-hover:text-white transition-colors duration-300 uppercase tracking-tight">
                                    {client}
                                </span>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </Container>
        </section>
    );
}
