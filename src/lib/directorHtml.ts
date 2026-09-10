import { normalizeGhostHtml } from "@/lib/ghostHtml";

const VIMEO_URL =
    /https?:\/\/(?:www\.)?(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)(?:[/?#&][^<\s"']*)?/gi;

/**
 * Director bio pages are text + Vimeo only. Images still live in Ghost for the
 * admin still picker and `/directors` hover state, but they are not rendered on
 * the individual bio pages.
 */
export function prepareDirectorHtml(
    html: string,
    extractedVideoHtml?: string | null
): {
    introHtml: string;
    videoHtml: string;
} {
    if (!html.trim()) {
        return {
            introHtml: "",
            videoHtml: extractedVideoHtml?.trim() ?? "",
        };
    }

    const videos: string[] = [];
    if (extractedVideoHtml?.trim()) {
        videos.push(wrapVimeoEmbed(extractedVideoHtml.trim()));
    }

    let introHtml = normalizeGhostHtml(html);

    // Pull Vimeo embeds out of Ghost figures/cards so they can sit below the bio.
    introHtml = introHtml.replace(/<figure\b[\s\S]*?<\/figure>/gi, (block) => {
        if (isVimeoHtml(block)) {
            videos.push(wrapVimeoEmbed(block));
        }
        return "";
    });

    introHtml = introHtml.replace(/<iframe\b[\s\S]*?<\/iframe>/gi, (block) => {
        if (isVimeoHtml(block)) {
            videos.push(wrapVimeoEmbed(block));
        }
        return "";
    });

    // Convert Vimeo links in otherwise-text content into embeds.
    introHtml = introHtml.replace(
        /<a\b[^>]*href=(["'])([^"']*vimeo\.com[^"']*)\1[^>]*>[\s\S]*?<\/a>/gi,
        (_link, _quote, href: string) => {
            videos.push(buildVimeoIframe(href));
            return "";
        }
    );

    // Convert plain Vimeo URLs in otherwise-text content into embeds.
    introHtml = introHtml.replace(VIMEO_URL, (url) => {
        videos.push(buildVimeoIframe(url));
        return "";
    });

    // Remove image/gallery/native-video blocks from the bio page only.
    introHtml = introHtml
        .replace(/<img\b[^>]*>/gi, "")
        .replace(/<video\b[\s\S]*?<\/video>/gi, "")
        .replace(/<p\b[^>]*>\s*<\/p>/gi, "")
        .trim();

    return {
        introHtml,
        videoHtml: dedupe(videos).join(""),
    };
}

function isVimeoHtml(html: string): boolean {
    VIMEO_URL.lastIndex = 0;
    return VIMEO_URL.test(html);
}

function wrapVimeoEmbed(html: string): string {
    if (/^<iframe\b/i.test(html.trim())) {
        return `<figure class="kg-card kg-embed-card">${html}</figure>`;
    }
    return html;
}

function buildVimeoIframe(url: string): string {
    const parsed = parseVimeoUrl(url);
    if (!parsed) return "";

    const hash = parsed.hash ? `?h=${parsed.hash}` : "";
    return `<figure class="kg-card kg-embed-card"><iframe src="https://player.vimeo.com/video/${parsed.id}${hash}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></figure>`;
}

function parseVimeoUrl(url: string): { id: string; hash?: string } | null {
    const clean = url.replace(/&amp;/g, "&");
    const id = clean.match(/vimeo\.com\/(?:video\/)?(\d+)/i)?.[1];
    if (!id) return null;

    const hash =
        clean.match(/[?&]h=([a-z0-9]+)/i)?.[1] ??
        clean.match(/vimeo\.com\/\d+\/([a-z0-9]+)/i)?.[1];

    return { id, hash };
}

function dedupe(values: string[]): string[] {
    return [...new Set(values.filter(Boolean))];
}
