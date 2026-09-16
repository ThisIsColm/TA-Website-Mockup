/** Canonical site origin for sitemaps, Open Graph, etc. */
export function getSiteUrl(): string {
    const raw =
        process.env.SITE_URL ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://www.tinyark.com";
    return raw.replace(/\/$/, "");
}

export function absoluteUrl(path: string): string {
    const base = getSiteUrl();
    const normalized = path.startsWith("/") ? path : `/${path}`;
    return `${base}${normalized}`;
}
