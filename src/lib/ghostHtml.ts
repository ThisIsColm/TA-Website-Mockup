/**
 * Normalize Ghost HTML so paragraph breaks render as block spacing, not soft line breaks.
 */

/** True when a paragraph is only whitespace, &nbsp;, or a single <br>. */
function isSpacerParagraph(inner: string): boolean {
    const stripped = inner
        .replace(/&nbsp;/gi, " ")
        .replace(/<br\s*\/?>/gi, "")
        .replace(/<[^>]+>/g, "")
        .trim();
    return stripped.length === 0;
}

/**
 * Split single <p> blocks that use consecutive <br> tags into separate paragraphs.
 * Ghost sometimes exports hard paragraph breaks this way instead of </p><p>.
 */
function splitParagraphsOnDoubleBreaks(html: string): string {
    return html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (match, attrs, inner) => {
        if (!/<br\s*\/?>/i.test(inner)) return match;

        const parts = inner
            .split(/(?:<br\s*\/?>\s*){2,}/i)
            .map((part: string) => part.trim())
            .filter((part: string) => part.length > 0);

        if (parts.length <= 1) return match;
        return parts.map((part: string) => `<p${attrs}>${part}</p>`).join("");
    });
}

/** Remove blank spacer paragraphs Ghost inserts between blocks. */
function removeSpacerParagraphs(html: string): string {
    return html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (match, _attrs, inner) => {
        return isSpacerParagraph(inner) ? "" : match;
    });
}

function appendClass(attrs: string, className: string): string {
    const trimmed = attrs.trim();
    const classMatch = trimmed.match(/\bclass=(["'])(.*?)\1/i);
    if (classMatch) {
        const quote = classMatch[1];
        const existing = classMatch[2];
        if (existing.split(/\s+/).includes(className)) {
            return trimmed;
        }
        return trimmed.replace(
            classMatch[0],
            `class=${quote}${existing} ${className}${quote}`
        );
    }
    return `${trimmed} class="${className}"`;
}

/**
 * Join `<p><strong>Brief</strong></p><p>Body…</p>` into one paragraph so the
 * label can sit on its own line (via CSS) without a full paragraph gap below it.
 */
function joinSectionLabelParagraphs(html: string): string {
    return html.replace(
        /<p([^>]*)>\s*<strong>([^<]+)<\/strong>\s*<\/p>\s*<p([^>]*)>/gi,
        (_match, _labelAttrs, labelText, bodyAttrs) => {
            const attrs = appendClass(bodyAttrs, "case-section-lead").trim();
            return `<p ${attrs}><strong>${labelText}</strong>`;
        }
    );
}

/** Tag `<p><strong>Brief</strong> Body…</p>` when Ghost keeps label and copy inline. */
function tagInlineSectionLeadParagraphs(html: string): string {
    return html.replace(/<p([^>]*)>([\s\S]*?)<\/p>/gi, (match, attrs, inner) => {
        const labelMatch = inner.match(/^\s*<strong>([^<]+)<\/strong>([\s\S]*)$/i);
        if (!labelMatch) return match;

        const rest = labelMatch[2].replace(/^(\s|&nbsp;)+/i, "");
        if (!rest) return match;

        const newAttrs = appendClass(attrs, "case-section-lead").trim();
        return `<p ${newAttrs}>${inner}</p>`;
    });
}

/** Prepare Ghost body HTML for site prose layouts. */
export function normalizeGhostHtml(html: string): string {
    if (!html) return html;
    const split = splitParagraphsOnDoubleBreaks(html);
    const cleaned = removeSpacerParagraphs(split);
    const joined = joinSectionLabelParagraphs(cleaned);
    return tagInlineSectionLeadParagraphs(joined);
}
