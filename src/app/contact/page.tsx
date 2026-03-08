import type { Metadata } from "next";
import Container from "@/components/Container";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
    title: "Contact",
    description: "Get in touch with Tiny Ark — let's discuss your next film project.",
};

export default function ContactPage() {
    return (
        <section className="pt-[140px] md:pt-[180px] pb-24 md:pb-32">
            <Container>
                {/* ── Intro Paragraph ────────────────────────────────────── */}
                <ScrollReveal>
                    <div className="max-w-[1400px]">
                        <h1 className="text-[clamp(1.8rem,4vw,3.2rem)] font-bold leading-[1.2] tracking-[-0.02em] text-white">
                            You've seen the work. You know what we're capable of. If you've got a brief, a budget, and the ambition to make something worth remembering, we want to hear from you.
                        </h1>
                    </div>
                </ScrollReveal>

                {/* ── Form Section ───────────────────────────────────────── */}
                <div className="mt-32 md:mt-48 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-0">
                    {/* Left: Section Header */}
                    <div>
                        <ScrollReveal>
                            <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-bold tracking-tight text-white leading-none">
                                Let's Talk
                            </h2>
                        </ScrollReveal>
                    </div>

                    {/* Right: Minimalist Form */}
                    <div>
                        <ScrollReveal delay={0.2}>
                            <form action="#" className="space-y-12" data-lenis-prevent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
                                    {/* Name */}
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-bold text-white">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Jane Smith"
                                            required
                                            className="w-full bg-transparent border-b border-white/30 py-3 text-lg text-white placeholder:text-text-tertiary focus:outline-none focus:border-white transition-colors"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-bold text-white">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="jane@framer.com"
                                            required
                                            className="w-full bg-transparent border-b border-white/30 py-3 text-lg text-white placeholder:text-text-tertiary focus:outline-none focus:border-white transition-colors"
                                        />
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-bold text-white">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        placeholder="Message"
                                        required
                                        rows={6}
                                        className="w-full bg-transparent border-b border-white/30 py-3 text-lg text-white placeholder:text-text-tertiary focus:outline-none focus:border-white transition-colors"
                                    />
                                </div>

                                <div className="pt-8">
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-white text-black font-bold text-sm hover:bg-accent hover:text-white transition-all duration-300"
                                    >
                                        Send it.
                                    </button>
                                </div>
                            </form>
                        </ScrollReveal>
                    </div>
                </div>
            </Container>
        </section>
    );
}
