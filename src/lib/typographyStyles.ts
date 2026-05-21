import type { CSSProperties } from "react";
import {
    FIGMA_WIDTH,
    MOBILE_BREAKPOINT_PX,
    type FontFamily,
    type TypeSpec,
    typography,
} from "./typography";

const FONT_STACKS: Record<FontFamily, string> = {
    tenon: "Tenon, sans-serif",
    dmMono: '"DM Mono", ui-monospace, monospace',
};

/** Convert Figma px @ 1920 → vw for proportional desktop scaling */
export function figmaVw(px: number): string {
    return `${(px / FIGMA_WIDTH) * 100}vw`;
}

/** Convert Figma px @ 1920 → CSS length for spacing (margins, gaps) */
export function figmaSpace(px: number): string {
    return figmaVw(px);
}

function flattenSpecs(): Array<{ path: string; spec: TypeSpec }> {
    const out: Array<{ path: string; spec: TypeSpec }> = [];
    for (const [page, tokens] of Object.entries(typography)) {
        for (const [name, spec] of Object.entries(tokens)) {
            out.push({ path: `${page}.${name}`, spec: spec as TypeSpec });
        }
    }
    return out;
}

function cssPathToClass(path: string): string {
    return `type-${path.replace(/\./g, "-")}`;
}

function cssPathToVar(path: string, suffix: string): string {
    return `--type-${path.replace(/\./g, "-")}-${suffix}`;
}

function specToProperties(
    spec: TypeSpec,
    sizeValue: string,
    mobile = false
): string {
    const lines: string[] = [`font-size: ${sizeValue}`];
    const font = spec.font ?? "tenon";
    lines.push(`font-family: ${FONT_STACKS[font]}`);
    if (spec.weight !== undefined) lines.push(`font-weight: ${spec.weight}`);
    if (spec.lineHeightRatio !== undefined) {
        lines.push(`line-height: ${spec.lineHeightRatio}`);
    } else if (spec.lineHeight !== undefined) {
        if (mobile && spec.mobile) {
            lines.push(
                `line-height: ${Math.round(spec.lineHeight * (spec.mobile / spec.size))}px`
            );
        } else {
            lines.push(`line-height: ${figmaVw(spec.lineHeight)}`);
        }
    }
    if (spec.letterSpacing !== undefined) {
        lines.push(`letter-spacing: ${spec.letterSpacing}em`);
    }
    return lines.join("; ");
}

/** CSS class name for a typography token, e.g. typeClass("insights.listTitle") */
export function typeClass(path: string): string {
    return cssPathToClass(path);
}

/** Inline style object (useful when combining with animation/opacity) */
export function typeStyle(path: string): CSSProperties {
    const entry = flattenSpecs().find((e) => e.path === path);
    if (!entry) {
        console.warn(`[typography] Unknown token: ${path}`);
        return {};
    }
    const { spec } = entry;
    const font = spec.font ?? "tenon";
    const style: CSSProperties = {
        fontFamily: FONT_STACKS[font],
        fontSize: figmaVw(spec.size),
    };
    if (spec.weight !== undefined) style.fontWeight = spec.weight;
    if (spec.lineHeightRatio !== undefined) {
        style.lineHeight = spec.lineHeightRatio;
    } else if (spec.lineHeight !== undefined) {
        style.lineHeight = figmaVw(spec.lineHeight);
    }
    if (spec.letterSpacing !== undefined) {
        style.letterSpacing = `${spec.letterSpacing}em`;
    }
    return style;
}

/** Full stylesheet injected once in root layout */
export function buildTypographyStylesheet(): string {
    const rootVars: string[] = [];
    const desktopRules: string[] = [];
    const mobileRules: string[] = [];

    for (const { path, spec } of flattenSpecs()) {
        const className = cssPathToClass(path);
        const desktopSize = figmaVw(spec.size);
        const mobileSize = spec.mobile
            ? `${spec.mobile}px`
            : desktopSize;

        const sizeDesktopVar = cssPathToVar(path, "size-desktop");
        const sizeMobileVar = cssPathToVar(path, "size-mobile");
        rootVars.push(`  ${sizeDesktopVar}: ${desktopSize};`);
        rootVars.push(`  ${sizeMobileVar}: ${mobileSize};`);

        if (spec.lineHeight !== undefined) {
            rootVars.push(
                `  ${cssPathToVar(path, "line-height-desktop")}: ${figmaVw(spec.lineHeight)};`
            );
            rootVars.push(
                `  ${cssPathToVar(path, "line-height-mobile")}: ${spec.mobile ? `${Math.round(spec.lineHeight * (spec.mobile / spec.size))}px` : figmaVw(spec.lineHeight)};`
            );
        }

        desktopRules.push(
            `.${className} { ${specToProperties(spec, `var(${sizeDesktopVar})`, false)} }`
        );

        mobileRules.push(
            `.${className} { ${specToProperties(spec, `var(${sizeMobileVar})`, true)} }`
        );
    }

    return `/* Auto-generated from src/lib/typography.ts — do not edit manually */
:root {
${rootVars.join("\n")}
}

@media (min-width: ${MOBILE_BREAKPOINT_PX}px) {
${desktopRules.join("\n")}
}

@media (max-width: ${MOBILE_BREAKPOINT_PX - 1}px) {
${mobileRules.join("\n")}
}

/* ── Prose blocks (Ghost HTML) ─────────────────────────────────────────── */
@media (min-width: ${MOBILE_BREAKPOINT_PX}px) {
  .insight-article-prose > p,
  .insight-article-prose > ul,
  .insight-article-prose > ol {
    font-size: var(--type-prose-insightArticleBody-size-desktop);
    line-height: var(--type-prose-insightArticleBody-line-height-desktop);
    letter-spacing: -0.02em;
    font-weight: 400;
  }
  .insight-article-prose > blockquote {
    font-size: var(--type-prose-insightArticleH3-size-desktop);
    line-height: var(--type-prose-insightArticleH3-line-height-desktop);
    letter-spacing: -0.02em;
    font-weight: 700;
  }
  .insight-article-prose > h2 {
    font-size: var(--type-prose-insightArticleH2-size-desktop);
    line-height: var(--type-prose-insightArticleH2-line-height-desktop);
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .insight-article-prose > h3 {
    font-size: var(--type-prose-insightArticleH3-size-desktop);
    line-height: var(--type-prose-insightArticleH3-line-height-desktop);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .case-study-prose > p {
    font-size: var(--type-prose-caseStudyBody-size-desktop);
    line-height: var(--type-prose-caseStudyBody-line-height-desktop);
    font-weight: 400;
    letter-spacing: -0.02em;
  }
  .case-study-prose > .case-meta > h1,
  .case-study-prose > .case-meta > p {
    font-size: var(--type-prose-caseStudyMeta-size-desktop);
    line-height: var(--type-prose-caseStudyMeta-line-height-desktop);
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .case-study-prose > h2,
  .case-study-prose > h3 {
    font-size: var(--type-prose-caseStudyH2-size-desktop);
    line-height: var(--type-prose-caseStudyH2-line-height-desktop);
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .case-study-prose figcaption {
    font-size: var(--type-prose-caseStudyCaption-size-desktop);
    letter-spacing: 0.04em;
  }
}

@media (max-width: ${MOBILE_BREAKPOINT_PX - 1}px) {
  .insight-article-prose > p,
  .insight-article-prose > ul,
  .insight-article-prose > ol {
    font-size: var(--type-prose-insightArticleBody-size-mobile);
    line-height: var(--type-prose-insightArticleBody-line-height-mobile);
  }
  .insight-article-prose > blockquote {
    font-size: var(--type-prose-insightArticleH3-size-mobile);
    line-height: var(--type-prose-insightArticleH3-line-height-mobile);
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .insight-article-prose > h2 {
    font-size: var(--type-prose-insightArticleH2-size-mobile);
    line-height: var(--type-prose-insightArticleH2-line-height-mobile);
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .insight-article-prose > h3 {
    font-size: var(--type-prose-insightArticleH3-size-mobile);
    line-height: var(--type-prose-insightArticleH3-line-height-mobile);
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .case-study-prose > p {
    font-size: var(--type-prose-caseStudyBody-size-mobile);
    line-height: var(--type-prose-caseStudyBody-line-height-mobile);
    font-weight: 400;
    letter-spacing: -0.02em;
  }
  .case-study-prose > .case-meta > h1,
  .case-study-prose > .case-meta > p {
    font-size: var(--type-prose-caseStudyMeta-size-mobile);
    line-height: var(--type-prose-caseStudyMeta-line-height-mobile);
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .case-study-prose > h2,
  .case-study-prose > h3 {
    font-size: var(--type-prose-caseStudyH2-size-mobile);
    line-height: var(--type-prose-caseStudyH2-line-height-mobile);
    font-weight: 800;
    letter-spacing: -0.02em;
  }
}
`;
}
