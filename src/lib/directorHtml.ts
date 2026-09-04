import { normalizeGhostHtml } from "@/lib/ghostHtml";

/** First top-level Ghost media block — intro copy stays above this. */
const FIRST_MEDIA = /<(figure|img|video|iframe)\b/i;

/**
 * Split Ghost body HTML into the hero intro (text before the first image/video)
 * and the media stack below. Director pages render these as separate layout
 * sections so full-bleed images never share a row with the name.
 */
export function splitDirectorHtml(html: string): {
    introHtml: string;
    mediaHtml: string;
} {
    if (!html.trim()) {
        return { introHtml: "", mediaHtml: "" };
    }

    const normalized = normalizeGhostHtml(html);
    const match = FIRST_MEDIA.exec(normalized);

    if (!match || match.index === undefined) {
        return { introHtml: normalized, mediaHtml: "" };
    }

    return {
        introHtml: normalized.slice(0, match.index).trim(),
        mediaHtml: normalized.slice(match.index).trim(),
    };
}
