/**
 * Extract the image URLs available inside a Ghost post.
 *
 * Used by the admin Directors picker: images are uploaded in Ghost (which
 * handles storage + CDN), then chosen here rather than re-uploaded.
 */

const IMG_SRC_RE = /<img[^>]+src=["']([^"']+)["']/gi;
const SRCSET_RE = /srcset=["']([^"']+)["']/gi;

/** Pick the largest-width URL from a Ghost srcset string. */
function bestFromSrcset(srcset: string): string | null {
    let bestUrl: string | null = null;
    let bestWidth = -1;

    for (const entry of srcset.split(",")) {
        const part = entry.trim();
        if (!part) continue;

        const [url, descriptor] = part.split(/\s+/);
        if (!url) continue;

        const widthMatch = descriptor?.match(/^(\d+)w$/);
        const width = widthMatch ? parseInt(widthMatch[1], 10) : 0;

        if (width >= bestWidth) {
            bestWidth = width;
            bestUrl = url;
        }
    }

    return bestUrl;
}

/** Drop Ghost's responsive size segment so variants of one upload dedupe. */
function canonicalKey(url: string): string {
    return url.replace(/\/content\/images\/size\/[^/]+\//, "/content/images/");
}

export function extractPostImages(
    html: string | null | undefined,
    featureImage?: string | null
): string[] {
    const seen = new Set<string>();
    const urls: string[] = [];

    const add = (url: string | null | undefined) => {
        if (!url) return;
        const trimmed = url.trim();
        if (!trimmed || trimmed.startsWith("data:")) return;

        const key = canonicalKey(trimmed);
        if (seen.has(key)) return;
        seen.add(key);
        urls.push(trimmed);
    };

    add(featureImage);

    if (html) {
        for (const match of html.matchAll(IMG_SRC_RE)) {
            add(match[1]);
        }

        for (const match of html.matchAll(SRCSET_RE)) {
            add(bestFromSrcset(match[1]));
        }
    }

    return urls;
}

/** Resolve the image pool for a post — uses cached options or extracts from HTML. */
export function resolvePostImageOptions(post: {
    html?: string | null;
    feature_image?: string | null;
    imageOptions?: string[];
}): string[] {
    if (post.imageOptions?.length) return post.imageOptions;
    return extractPostImages(post.html, post.feature_image).slice(0, 40);
}
