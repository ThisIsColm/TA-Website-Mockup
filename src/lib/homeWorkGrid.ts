import { getSelections } from "@/lib/db";
import { fetchPostsByIds } from "@/lib/ghost";
import { getFeaturedProjects, getAllProjects } from "@/lib/data";

export type WorkNavItem = { slug: string; title: string };

const SECTION = "home.selectedWork";
const HOME_GRID_LIMIT = 16;

/**
 * Same ordered list as the homepage grid: curated Ghost IDs first (max 16),
 * then static fallback via getFeaturedProjects when curation is empty.
 */
export async function getHomeWorkGridOrder(): Promise<WorkNavItem[]> {
    const { ghostPostIds } = getSelections(SECTION);
    if (ghostPostIds.length > 0) {
        const posts = await fetchPostsByIds(ghostPostIds);
        return posts.slice(0, HOME_GRID_LIMIT).map((p) => ({
            slug: p.slug,
            title: p.title,
        }));
    }
    return getFeaturedProjects(HOME_GRID_LIMIT).map((p) => ({
        slug: p.slug,
        title: p.title,
    }));
}

function neighborsFromList(
    items: WorkNavItem[],
    slug: string
): { prev: WorkNavItem | null; next: WorkNavItem | null } {
    if (items.length <= 1) return { prev: null, next: null };
    const idx = items.findIndex((p) => p.slug === slug);
    if (idx === -1) return { prev: null, next: null };
    const n = items.length;
    return {
        prev: items[(idx - 1 + n) % n],
        next: items[(idx + 1) % n],
    };
}

/**
 * Prev/next for a work slug, following home grid order (wrapping).
 * If the slug is not on the home grid, falls back to date-sorted getAllProjects().
 */
export async function getWorkPageNeighbors(
    slug: string
): Promise<{ prev: WorkNavItem | null; next: WorkNavItem | null }> {
    const gridOrder = await getHomeWorkGridOrder();
    let result = neighborsFromList(gridOrder, slug);
    if (result.prev === null && gridOrder.length > 0 && !gridOrder.some((p) => p.slug === slug)) {
        const all = getAllProjects().map((p) => ({ slug: p.slug, title: p.title }));
        result = neighborsFromList(all, slug);
    }
    return result;
}
