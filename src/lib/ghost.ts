/**
 * Ghost Content API client with in-memory caching.
 *
 * - Fetches posts from Ghost Content API using raw fetch
 * - Caches results in memory with configurable TTL
 * - Falls back to stale cache if Ghost is unreachable
 */

import { config } from "./config";

// ── Types ────────────────────────────────────────────────────────

export interface GhostTag {
    id: string;
    name: string;
    slug: string;
}

export interface GhostPost {
    id: string;
    title: string;
    slug: string;
    url: string;
    html: string | null;
    video_html?: string | null;
    video_aspect_ratio?: number | null;
    feature_image: string | null;
    excerpt: string;
    custom_excerpt: string | null;
    published_at: string;
    codeinjection_head?: string | null;
    codeinjection_foot?: string | null;
    tags: GhostTag[];
    primary_tag: GhostTag | null;
}

interface GhostPostsResponse {
    posts: GhostPost[];
    meta: {
        pagination: {
            page: number;
            limit: number;
            pages: number;
            total: number;
        };
    };
}

// ── Cache ─────────────────────────────────────────────────────────

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) return null;

    const age = (Date.now() - entry.timestamp) / 1000;
    if (age < config.cache.ttlSeconds) {
        return entry.data as T;
    }
    return null; // expired, but we keep it for fallback
}

function getStaleCached<T>(key: string): T | null {
    const entry = cache.get(key);
    return entry ? (entry.data as T) : null;
}

function setCache<T>(key: string, data: T): void {
    cache.set(key, { data, timestamp: Date.now() });
}

// ── API helpers ───────────────────────────────────────────────────

function ghostApiUrl(endpoint: string, params: Record<string, string> = {}): string {
    const url = new URL(`${config.ghost.url}/ghost/api/content/${endpoint}/`);
    url.searchParams.set("key", config.ghost.contentApiKey);
    for (const [k, v] of Object.entries(params)) {
        url.searchParams.set(k, v);
    }
    return url.toString();
}

/**
 * Fetch posts from Ghost Content API.
 */
export async function fetchGhostPosts(
    page = 1,
    limit = 15,
    filter?: string
): Promise<GhostPostsResponse> {
    const cacheKey = `posts:${page}:${limit}:${filter || ""}`;

    // Check cache first
    const cached = getCached<GhostPostsResponse>(cacheKey);
    if (cached) return cached;

    const params: Record<string, string> = {
        page: String(page),
        limit: String(limit),
        include: "tags",
    };
    if (filter) params.filter = filter;

    try {
        const res = await fetch(ghostApiUrl("posts", params), {
            next: { revalidate: config.cache.ttlSeconds },
        });

        if (!res.ok) {
            throw new Error(`Ghost API error: ${res.status} ${res.statusText}`);
        }

        const data: GhostPostsResponse = await res.json();
        setCache(cacheKey, data);
        return data;
    } catch (err) {
        console.error("[ghost] Fetch failed:", err);

        // Return stale cache if available
        const stale = getStaleCached<GhostPostsResponse>(cacheKey);
        if (stale) {
            console.warn("[ghost] Returning stale cached data");
            return stale;
        }

        // Return empty response as last resort
        return {
            posts: [],
            meta: { pagination: { page: 1, limit, pages: 0, total: 0 } },
        };
    }
}

/**
 * Fetch ALL posts from Ghost (paginated internally) for search.
 */
export async function fetchAllGhostPosts(): Promise<GhostPost[]> {
    const cacheKey = "all-posts";
    const cached = getCached<GhostPost[]>(cacheKey);
    if (cached) return cached;

    const allPosts: GhostPost[] = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
        const res = await fetchGhostPosts(page, 100);
        allPosts.push(...res.posts);
        totalPages = res.meta.pagination.pages;
        page++;
    }

    setCache(cacheKey, allPosts);
    return allPosts;
}

/**
 * Search Ghost posts by title, slug, or tag name.
 */
export async function searchGhostPosts(query: string): Promise<GhostPost[]> {
    const all = await fetchAllGhostPosts();
    const q = query.toLowerCase();

    return all.filter(
        (post) =>
            post.title.toLowerCase().includes(q) ||
            post.slug.toLowerCase().includes(q) ||
            post.tags.some((tag) => tag.name.toLowerCase().includes(q))
    );
}

/**
 * Fetch specific posts by IDs. Returns them in the same order as the input IDs.
 * Missing posts (deleted/unpublished) are omitted with a console warning.
 */
export async function fetchPostsByIds(ids: string[]): Promise<GhostPost[]> {
    if (ids.length === 0) return [];

    const all = await fetchAllGhostPosts();
    const postMap = new Map(all.map((p) => [p.id, p]));

    const result: GhostPost[] = [];
    for (const id of ids) {
        const post = postMap.get(id);
        if (post) {
            result.push(post);
        } else {
            console.warn(`[ghost] Curated post ID "${id}" not found — may have been deleted/unpublished`);
        }
    }

    return result;
}

/**
 * Fetch a single Ghost post by slug. Returns full HTML content.
 * Returns null if not found.
 */
export async function fetchGhostPostBySlug(slug: string): Promise<GhostPost | null> {
    const cacheKey = `post-slug:${slug}`;
    const cached = getCached<GhostPost | null>(cacheKey);
    if (cached !== null) return cached;

    try {
        const params: Record<string, string> = {
            include: "tags",
        };
        const url = ghostApiUrl(`posts/slug/${slug}`, params);
        const res = await fetch(url, {
            next: { revalidate: config.cache.ttlSeconds },
        });

        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error(`Ghost API error: ${res.status}`);
        }

        const data = await res.json();
        const post: GhostPost = data.posts?.[0] || null;

        if (post && post.html) {
            // Extract the first vimeo iframe and strip it from html
            const vimeoRegex = /<iframe[^>]*src="[^"]*vimeo\.com[^"]*"[^>]*><\/iframe>/i;
            const match = post.html.match(vimeoRegex);
            if (match) {
                let iframe = match[0];

                // Inject brand color into Vimeo URL
                if (iframe.includes("vimeo.com")) {
                    const colorParam = "color=D86001";
                    if (iframe.includes("src=\"")) {
                        const srcRegex = /src="([^"]*)"/;
                        const srcMatch = iframe.match(srcRegex);
                        if (srcMatch) {
                            let src = srcMatch[1];
                            src += src.includes("?") ? `&${colorParam}` : `?${colorParam}`;
                            iframe = iframe.replace(srcMatch[0], `src="${src}"`);
                        }
                    }
                }

                post.video_html = iframe;
                post.html = post.html.replace(vimeoRegex, "");

                // Extract width and height to calculate aspect ratio
                const widthMatch = iframe.match(/width="(\d+)"/i);
                const heightMatch = iframe.match(/height="(\d+)"/i);
                if (widthMatch && heightMatch) {
                    const w = parseInt(widthMatch[1], 10);
                    const h = parseInt(heightMatch[1], 10);
                    if (w > 0 && h > 0) {
                        post.video_aspect_ratio = w / h;
                    }
                }

                // Also strip the surrounding kg-card/kg-embed-card if it exists
                post.html = post.html.replace(/<div class="kg-card kg-embed-card">[\s\n]*<\/div>/g, "");
            }
        }

        if (post) setCache(cacheKey, post);
        return post;
    } catch (err) {
        console.error(`[ghost] Failed to fetch post by slug "${slug}":`, err);

        const stale = getStaleCached<GhostPost | null>(cacheKey);
        if (stale) return stale;

        return null;
    }
}
