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

/** Prepare Ghost body HTML for site prose layouts. */
export function normalizeGhostHtml(html: string): string {
    if (!html) return html;
    return removeSpacerParagraphs(splitParagraphsOnDoubleBreaks(html));
}
