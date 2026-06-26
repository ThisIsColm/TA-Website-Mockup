import { getSelections } from "@/lib/db";
import { fetchPostsByIds } from "@/lib/ghost";
import { getInsightDisplayTitle } from "@/lib/insightTitle";

export type InsightsNavItem = { slug: string; title: string };

const SECTION = "case-studies";

/**
 * Ordered list of curated insights posts, matching the order shown on
 * `/insights` (curated via the same admin selection key).
 */
export async function getInsightsOrder(): Promise<InsightsNavItem[]> {
    const { ghostPostIds } = getSelections(SECTION);
    if (ghostPostIds.length === 0) return [];
    const posts = await fetchPostsByIds(ghostPostIds);
    return posts.map((p) => ({
        slug: p.slug,
        title: getInsightDisplayTitle(p.id, p.title),
    }));
}

function neighborsFromList(
    items: InsightsNavItem[],
    slug: string
): { prev: InsightsNavItem | null; next: InsightsNavItem | null } {
    if (items.length <= 1) return { prev: null, next: null };
    const idx = items.findIndex((p) => p.slug === slug);
    if (idx === -1) return { prev: null, next: null };
    const n = items.length;
    return {
        prev: items[(idx - 1 + n) % n],
        next: items[(idx + 1) % n],
    };
}

/** Prev/next insight, wrapping at the ends of the curated list. */
export async function getInsightsPageNeighbors(
    slug: string
): Promise<{ prev: InsightsNavItem | null; next: InsightsNavItem | null }> {
    const order = await getInsightsOrder();
    return neighborsFromList(order, slug);
}
