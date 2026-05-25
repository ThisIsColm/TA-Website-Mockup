/**
 * ═══════════════════════════════════════════════════════════════════════════
 * TYPOGRAPHY CONFIG — edit all font sizes here
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * HOW TO USE
 * ──────────
 * 1. Find the page section below (home, about, insights, work, etc.)
 * 2. Change `size` (px at 1920px wide) — everything scales automatically
 * 3. Optionally set `mobile` for a fixed px size below 768px
 * 4. In components: className={typeClass("insights.listTitle")}
 *
 * SCALING
 * ───────
 * Desktop: font-size = (size / 1920) × 100vw  →  e.g. 76px → 3.958vw
 * Mobile:  uses `mobile` px if set, otherwise same vw formula
 *
 * OTHER FIELDS
 * ────────────
 * weight (400 = Regular, 700 = Bold, 800 = X-Bold via Typekit), lineHeight (px @ 1920)
 * ligatures (true = common-ligatures + liga/clig features)
 * font: "tenon" | "dmMono"
 *
 * PROSE (Ghost HTML): edit tokens under `prose` — applied via globals.css vars
 *
 * NOT YET IN THIS FILE (still use cqw in component): none — all pages use tokens below
 * ADMIN UI: uses Tailwind defaults in src/app/admin/page.tsx
 */

export const FIGMA_WIDTH = 1920;
export const MOBILE_BREAKPOINT_PX = 768;

export type FontFamily = "tenon" | "dmMono";

export interface TypeSpec {
    /** Font size in px @ 1920px */
    size: number;
    /** Mobile font size in px (<768px). Omit to scale same as desktop. */
    mobile?: number;
    weight?: number;
    /** Line height in px @ 1920px */
    lineHeight?: number;
    /** Unitless line-height (overrides lineHeight when set) */
    lineHeightRatio?: number;
    /** Letter-spacing in em (e.g. -0.02 = -2%) */
    letterSpacing?: number;
    /** OpenType common ligatures (ff, fi, etc.) — use with letter-spacing via font-feature-settings */
    ligatures?: boolean;
    font?: FontFamily;
    /** Use exact px on desktop instead of vw scaling (e.g. credits metadata) */
    fixedSize?: boolean;
}

// ── Shared (Header, Footer, CTA used on multiple pages) ───────────────────

const shared = {
    headerNavLink: {
        size: 30,
        mobile: 22,
        weight: 800,
        letterSpacing: -0.02,
        font: "tenon",
    },
    headerMobileMenuLink: {
        size: 58,
        mobile: 52,
        weight: 800,
        lineHeightRatio: 1.05,
        letterSpacing: -0.02,
        font: "tenon",
    },
    footerCopyright: {
        size: 16,
        mobile: 11,
        weight: 400,
        lineHeight: 13,
        letterSpacing: -0.02,
        font: "tenon",
    },
    workTogetherHeading: {
        size: 58,
        mobile: 32,
        weight: 800,
        lineHeight: 48,
        letterSpacing: -0.02,
        font: "tenon",
    },
    workTogetherEmail: {
        size: 36,
        mobile: 18,
        weight: 400,
        lineHeightRatio: 1,
        letterSpacing: -0.02,
        font: "tenon",
    },
    relatedCardTitle: {
        size: 28,
        mobile: 18,
        weight: 900,
        letterSpacing: -0.02,
        lineHeightRatio: 1.1,
        font: "tenon",
    },
    listingPageTitle: {
        size: 72,
        mobile: 40,
        weight: 700,
        lineHeightRatio: 1,
        letterSpacing: -0.02,
        font: "tenon",
    },
} as const satisfies Record<string, TypeSpec>;

// ── Home ────────────────────────────────────────────────────────────────────

const home = {
    typewriterLine: {
        size: 84,
        mobile: 29,
        weight: 800,
        lineHeight: 82,
        letterSpacing: -0.02,
        font: "tenon",
    },
    moreAboutLink: {
        size: 36,
        mobile: 18,
        weight: 400,
        lineHeight: 43,
        letterSpacing: -0.02,
        font: "tenon",
    },
} as const satisfies Record<string, TypeSpec>;

// ── About ───────────────────────────────────────────────────────────────────

const about = {
    heroHeading: {
        size: 58,
        mobile: 32,
        weight: 800,
        lineHeight: 70,
        letterSpacing: -0.02,
        font: "tenon",
    },
    heroBody: {
        size: 36,
        mobile: 16,
        weight: 400,
        lineHeight: 46,
        letterSpacing: -0.02,
        font: "tenon",
    },
    sectionHeading: {
        size: 36,
        mobile: 24,
        weight: 400,
        lineHeight: 46,
        letterSpacing: -0.02,
        font: "tenon",
    },
    serviceCardBody: {
        size: 26,
        mobile: 14,
        weight: 400,
        lineHeight: 30,
        letterSpacing: -0.02,
        font: "tenon",
    },
    servicePill: {
        size: 20,
        mobile: 12,
        weight: 400,
        lineHeight: 30,
        letterSpacing: -0.02,
        font: "tenon",
    },
    rotatingTaglineLead: {
        size: 36,
        mobile: 22,
        weight: 400,
        lineHeight: 46,
        letterSpacing: -0.02,
        font: "tenon",
    },
    rotatingTaglineAccent: {
        size: 36,
        mobile: 22,
        weight: 800,
        lineHeight: 46,
        letterSpacing: -0.02,
        font: "tenon",
    },
    teamRole: {
        size: 22,
        mobile: 14,
        weight: 400,
        lineHeight: 30,
        letterSpacing: -0.02,
        font: "tenon",
    },
} as const satisfies Record<string, TypeSpec>;

// ── Contact ─────────────────────────────────────────────────────────────────

const contact = {
    pageHeading: {
        size: 58,
        mobile: 40,
        weight: 800,
        lineHeight: 70,
        letterSpacing: -0.02,
        font: "tenon",
    },
    personName: {
        size: 26,
        mobile: 18,
        weight: 400,
        lineHeight: 30,
        letterSpacing: -0.02,
        font: "tenon",
    },
    personTitle: {
        size: 26,
        mobile: 18,
        weight: 400,
        lineHeight: 30,
        letterSpacing: -0.02,
        font: "tenon",
    },
    personLink: {
        size: 26,
        mobile: 18,
        weight: 400,
        lineHeight: 30,
        letterSpacing: -0.02,
        font: "tenon",
    },
    address: {
        size: 26,
        mobile: 18,
        weight: 400,
        lineHeight: 30,
        letterSpacing: -0.02,
        font: "tenon",
    },
} as const satisfies Record<string, TypeSpec>;

// ── Insights ────────────────────────────────────────────────────────────────

const insights = {
    introTagline: {
        size: 30,
        mobile: 14,
        weight: 300,
        lineHeight: 39,
        font: "dmMono",
    },
    listTitle: {
        size: 76,
        mobile: 24,
        weight: 800,
        lineHeightRatio: 1,
        letterSpacing: -0.02,
        font: "tenon",
    },
    listAuthor: {
        size: 30,
        mobile: 14,
        weight: 400,
        lineHeight: 39,
        letterSpacing: -0.02,
        font: "dmMono",
    },
    listDate: {
        size: 18,
        mobile: 11,
        weight: 400,
        lineHeight: 23,
        letterSpacing: -0.02,
        font: "dmMono",
    },
    articleHeaderTitle: {
        size: 96,
        mobile: 32,
        weight: 800,
        lineHeight: 106,
        letterSpacing: -0.02,
        font: "tenon",
    },
    articleHeaderByline: {
        size: 26,
        mobile: 14,
        weight: 400,
        lineHeight: 46,
        letterSpacing: -0.02,
        font: "tenon",
    },
    articleHeaderSubtitle: {
        size: 46,
        mobile: 16,
        weight: 400,
        lineHeight: 56,
        letterSpacing: -0.02,
        font: "tenon",
    },
    nextArticleTitle: {
        size: 36,
        mobile: 18,
        weight: 800,
        lineHeight: 46,
        letterSpacing: -0.02,
        font: "tenon",
    },
    relatedLabel: {
        size: 11,
        weight: 600,
        letterSpacing: 0.15,
        font: "tenon",
    },
} as const satisfies Record<string, TypeSpec>;

// ── Work ────────────────────────────────────────────────────────────────────

const work = {
    listingRowTitle: {
        size: 32,
        mobile: 28,
        weight: 700,
        font: "tenon",
    },
    cardTitle: {
        size: 34,
        mobile: 22,
        weight: 700,
        lineHeightRatio: 1.05,
        letterSpacing: -0.02,
        font: "tenon",
    },
    projectHoverTitle: {
        size: 58,
        mobile: 18,
        weight: 800,
        lineHeight: 70,
        letterSpacing: -0.02,
        font: "tenon",
    },
    projectOverlayTitle: {
        size: 30,
        mobile: 15,
        weight: 900,
        lineHeightRatio: 0.98,
        letterSpacing: -0.02,
        font: "tenon",
    },
    projectOverlayTitleCompact: {
        size: 22,
        mobile: 13,
        weight: 900,
        lineHeightRatio: 0.98,
        letterSpacing: -0.02,
        font: "tenon",
    },
    creditsHeading: {
        size: 26,
        mobile: 14,
        weight: 400,
        lineHeight: 30,
        letterSpacing: -0.02,
        font: "tenon",
        fixedSize: true,
    },
    creditsBrand: {
        size: 26,
        mobile: 14,
        weight: 400,
        lineHeight: 30,
        letterSpacing: -0.02,
        font: "tenon",
        fixedSize: true,
    },
    creditsRole: {
        size: 26,
        mobile: 14,
        weight: 400,
        lineHeight: 30,
        letterSpacing: -0.02,
        font: "tenon",
        fixedSize: true,
    },
    creditsName: {
        size: 26,
        mobile: 14,
        weight: 400,
        lineHeight: 30,
        letterSpacing: -0.02,
        font: "tenon",
        fixedSize: true,
    },
    nextProjectLabel: {
        size: 36,
        mobile: 18,
        weight: 800,
        lineHeight: 46,
        letterSpacing: -0.02,
        font: "tenon",
    },
    nextProjectLink: {
        size: 36,
        mobile: 18,
        weight: 400,
        lineHeight: 46,
        letterSpacing: -0.02,
        font: "tenon",
    },
} as const satisfies Record<string, TypeSpec>;

// ── Prose (Ghost HTML — CSS in globals.css references these vars) ───────────

const prose = {
    insightArticleBody: {
        size: 36,
        mobile: 16,
        weight: 400,
        lineHeight: 46,
        letterSpacing: -0.02,
        font: "tenon",
    },
    insightArticleH2: {
        size: 36,
        mobile: 22,
        weight: 800,
        lineHeight: 46,
        letterSpacing: -0.02,
        font: "tenon",
    },
    insightArticleH3: {
        size: 36,
        mobile: 22,
        weight: 700,
        lineHeight: 46,
        letterSpacing: -0.02,
        font: "tenon",
    },
    caseStudyBody: {
        size: 36,
        mobile: 18,
        weight: 400,
        lineHeight: 46,
        letterSpacing: -0.02,
        font: "tenon",
    },
    caseStudyH2: {
        size: 36,
        mobile: 22,
        weight: 800,
        lineHeight: 46,
        letterSpacing: -0.02,
        font: "tenon",
    },
    caseStudyH3: {
        size: 36,
        mobile: 20,
        weight: 800,
        lineHeight: 46,
        letterSpacing: -0.02,
        font: "tenon",
    },
    caseStudyMeta: {
        size: 36,
        mobile: 22,
        weight: 800,
        lineHeight: 46,
        letterSpacing: -0.02,
        font: "tenon",
    },
    caseStudyCaption: {
        size: 12,
        mobile: 11,
        weight: 400,
        letterSpacing: 0.04,
        font: "tenon",
    },
} as const satisfies Record<string, TypeSpec>;

/** All typography tokens, grouped by page/area */
export const typography = {
    shared,
    home,
    about,
    contact,
    insights,
    work,
    prose,
} as const;

export type TypographyPage = keyof typeof typography;
export type TypographyToken<P extends TypographyPage> =
    keyof (typeof typography)[P];
