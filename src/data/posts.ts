import { Post } from "@/types";

export const posts: Post[] = [
    {
        slug: "the-art-of-visual-storytelling",
        title: "The Art of Visual Storytelling",
        excerpt:
            "How great design goes beyond aesthetics to craft narratives that resonate with audiences on a deeper level.",
        date: "2025-11-20",
        author: "Tiny Ark Studio",
        coverImage:
            "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=1200&q=80",
        category: "Design",
        content: `
Visual storytelling is the cornerstone of effective design. It's not enough for something to look good — it needs to communicate, evoke emotion, and guide the viewer through an intentional journey.

## Why Storytelling Matters in Design

Every project we undertake begins with a story. Who is the audience? What do they need to feel? What action should they take? These questions shape every design decision, from color palette to typography to micro-interactions.

## The Framework

We follow a simple framework: **Context → Tension → Resolution**. First, we establish the context (the brand, the problem, the market). Then we introduce tension (the challenge, the gap, the opportunity). Finally, we deliver resolution (the design solution, the transformation).

## Practical Applications

This framework applies to everything from a single landing page to a comprehensive brand identity. The key is intentionality — every element should serve the narrative.

## Looking Forward

As design tools become more powerful and audiences become more sophisticated, storytelling will only become more important. The designers who thrive will be those who can weave compelling narratives through their work.
    `,
    },
    {
        slug: "designing-for-dark-mode",
        title: "Designing for Dark Mode",
        excerpt:
            "Best practices and lessons learned from designing interfaces that feel native in both light and dark contexts.",
        date: "2025-09-15",
        author: "Tiny Ark Studio",
        coverImage:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80",
        category: "UI/UX",
        content: `
Dark mode is no longer optional. Users expect it, and platforms prioritize it. But designing for dark mode is more than inverting colors — it requires a fundamental rethinking of your design system.

## Common Pitfalls

The most common mistake is simply inverting your light theme. Pure white text on pure black backgrounds creates harsh contrast that causes eye strain. True dark mode design uses off-whites on near-black backgrounds for comfortable reading.

## Our Approach

We design dark-first. Starting with dark backgrounds forces you to think more carefully about contrast ratios, color relationships, and visual hierarchy. Once the dark theme works beautifully, adapting for light mode becomes easier.

## Technical Considerations

CSS custom properties make theme switching seamless. Design your token system with both themes in mind from the start, and you'll avoid painful migration later.

## The Future of Adaptive Design

We're moving toward interfaces that adapt not just to user preference, but to ambient lighting conditions and time of day. The future is contextually aware design.
    `,
    },
    {
        slug: "motion-design-principles",
        title: "Motion Design Principles for the Web",
        excerpt:
            "A practical guide to adding meaningful motion to web interfaces without sacrificing performance.",
        date: "2025-07-08",
        author: "Tiny Ark Studio",
        coverImage:
            "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80",
        category: "Motion",
        content: `
Motion is the secret ingredient that transforms good interfaces into great ones. But motion must be purposeful — gratuitous animation harms more than it helps.

## The Three Rules

1. **Motion should inform.** Every animation should communicate something: a state change, a spatial relationship, or a feedback signal.
2. **Motion should feel natural.** Use easing curves that mirror real-world physics. Linear animations feel robotic.
3. **Motion should be fast.** Most UI animations should be 200-400ms. Anything longer feels sluggish.

## Performance First

We use Framer Motion for orchestrated animations and CSS transitions for simple state changes. The key is knowing when to reach for each tool.

## Accessibility

Always respect prefers-reduced-motion. Some users experience motion sickness or have vestibular disorders. Provide a graceful fallback that still communicates the information without the movement.

## Tools We Love

- Framer Motion for React-based animation
- CSS transitions for lightweight interactions
- Lottie for complex illustrative animations
    `,
    },
    {
        slug: "building-design-systems",
        title: "Building Design Systems That Scale",
        excerpt:
            "How we approach design systems: from initial token architecture to cross-team adoption and governance.",
        date: "2025-05-20",
        author: "Tiny Ark Studio",
        coverImage:
            "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80",
        category: "Design Systems",
        content: `
A design system is only as good as its adoption. We've built systems for startups and enterprises alike, and the principles remain the same.

## Start With Tokens

Design tokens are the atoms of your system. Colors, spacing, typography, shadows — define these first, and everything else follows. We use a tiered token system: primitive → semantic → component.

## Component Architecture

Build components in isolation, test them in context. Each component should have clearly defined props, states, and behaviors. Documentation is not optional.

## Governance

Without governance, design systems decay. Establish a contribution model, review process, and regular audits. The system should evolve with the product, not lag behind it.

## Measuring Success

Track adoption metrics: component coverage, design-to-development ratio, and time-to-ship for new features. A successful design system accelerates the entire product team.
    `,
    },
    {
        slug: "creative-process-behind-the-scenes",
        title: "Creative Process: Behind the Scenes",
        excerpt:
            "A transparent look at how we approach new projects, from initial brief to final delivery.",
        date: "2025-03-12",
        author: "Tiny Ark Studio",
        coverImage:
            "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&q=80",
        category: "Process",
        content: `
People often ask about our creative process. The truth is, it's both structured and chaotic — and that's by design.

## Phase 1: Discovery

Every project begins with listening. We conduct stakeholder interviews, audience research, and competitive analysis. This phase typically takes 1-2 weeks.

## Phase 2: Ideation

Armed with research, we explore broadly. Mood boards, sketches, and rapid prototypes. We generate dozens of directions before narrowing down. This is where creativity thrives.

## Phase 3: Refinement

The best ideas from ideation are developed into polished concepts. We present 2-3 directions to the client, each fully realized enough to evaluate.

## Phase 4: Production

Once a direction is chosen, we move into production. This is where craft matters most — pixel-perfect execution, smooth animations, and attention to every detail.

## Phase 5: Delivery

We don't just hand off files. We deliver documentation, guidelines, and support to ensure the work lives on well beyond our engagement.
    `,
    },
    {
        slug: "typography-in-digital-design",
        title: "Typography in Digital Design",
        excerpt:
            "Why typography is the most important design decision you'll make, and how to get it right.",
        date: "2025-01-18",
        author: "Tiny Ark Studio",
        coverImage:
            "https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=1200&q=80",
        category: "Typography",
        content: `
Typography carries your message. It sets the tone before a single word is read. In digital design, getting typography right is both an art and a science.

## Choosing a Typeface

Start with the message. Is it serious? Playful? Technical? Elegant? The typeface should amplify the intent. We often start with just 2 families — a sans-serif for UI and a contrasting face for editorial content.

## Scale and Rhythm

Use a modular type scale (we prefer a 1.25 ratio) to create natural hierarchy. Consistent line-heights and spacing create rhythm that guides the eye.

## Responsive Typography

Fixed font sizes are a relic. Use fluid typography with clamp() to create smooth scaling across breakpoints. This eliminates awkward jumps and creates a polished experience.

## Performance

Web fonts have a cost. Subset your fonts, use font-display: swap, and preload critical weights. A beautiful typeface that causes layout shift is a net negative.
    `,
    },
];
