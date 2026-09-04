import { getSelections } from "@/lib/db";
import { fetchPostsByIds } from "@/lib/ghost";
import { getWorkDisplayTitle } from "@/lib/workTitle";

export type WorkNavItem = { slug: string; title: string };

const SECTION = "home.selectedWork";
const HOME_GRID_LIMIT = 18;

/** Same ordered list as the homepage grid: curated Ghost IDs only. */
export async function getHomeWorkGridOrder(): Promise<WorkNavItem[]> {
    const { ghostPostIds } = getSelections(SECTION);
    if (ghostPostIds.length === 0) return [];

    const posts = await fetchPostsByIds(ghostPostIds);
    return posts.slice(0, HOME_GRID_LIMIT).map((p) => ({
        slug: p.slug,
        title: getWorkDisplayTitle(p.id, p.title),
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

/** Prev/next for a work slug, following home grid order (wrapping). */
export async function getWorkPageNeighbors(
    slug: string
): Promise<{ prev: WorkNavItem | null; next: WorkNavItem | null }> {
    const gridOrder = await getHomeWorkGridOrder();
    return neighborsFromList(gridOrder, slug);
}
