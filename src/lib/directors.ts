import { getPostMetadata, getSelections } from "@/lib/db";
import {
    DIRECTOR_STILL_COUNT,
    DIRECTOR_TAG,
    PLACEHOLDER_DIRECTOR_NAMES,
    normalizeDirectorName,
    type Director,
} from "@/lib/directorsShared";
import {
    fetchGhostPostBySlug,
    fetchPostsByIds,
    type GhostPost,
} from "@/lib/ghost";
import { extractPostImages } from "@/lib/postImages";

export const DIRECTORS_SECTION = "directors";

/** Site-facing director name — admin override or the Ghost post title. */
export function getDirectorDisplayName(postId: string, ghostTitle: string): string {
    const custom = getPostMetadata(postId)?.directorName?.trim();
    return custom || ghostTitle;
}

/** Ghost-backed directors, in the order set in the admin dashboard. */
async function getCuratedDirectors(): Promise<Director[]> {
    const { ghostPostIds } = getSelections(DIRECTORS_SECTION);
    if (ghostPostIds.length === 0) return [];

    const posts = await fetchPostsByIds(ghostPostIds);

    return posts.map((post) => {
        const meta = getPostMetadata(post.id);
        const picked = meta?.directorStills ?? [];
        const stills =
            picked.length > 0
                ? picked
                : extractPostImages(post.html, post.feature_image).slice(
                      0,
                      DIRECTOR_STILL_COUNT
                  );

        return {
            id: post.id,
            slug: post.slug,
            name: meta?.directorName?.trim() || post.title,
            stills: stills.slice(0, DIRECTOR_STILL_COUNT),
        };
    });
}

/**
 * The roster shown on `/directors`: names follow the design order. Ghost posts
 * from the admin panel slot into matching roster positions; any name without a
 * post yet renders as a placeholder. Curated posts that don't match the roster
 * are appended at the end.
 */
export async function getDirectors(): Promise<Director[]> {
    const curated = await getCuratedDirectors();
    const curatedByName = new Map(
        curated.map((d) => [normalizeDirectorName(d.name), d])
    );

    const roster: Director[] = [];

    for (const name of PLACEHOLDER_DIRECTOR_NAMES) {
        const key = normalizeDirectorName(name);
        const match = curatedByName.get(key);
        if (match) {
            roster.push(match);
            curatedByName.delete(key);
        } else {
            roster.push({
                id: `placeholder-${key.replace(/\s+/g, "-")}`,
                slug: "",
                name,
                stills: [],
                isPlaceholder: true,
            });
        }
    }

    for (const director of curatedByName.values()) {
        roster.push(director);
    }

    return roster;
}

export interface DirectorPage {
    post: GhostPost;
    /** Admin name override, falling back to the Ghost post title. */
    name: string;
}

/**
 * A single director's Ghost post for `/directors/[slug]`. Returns `null` unless
 * the post is tagged `director` or has been curated into the Directors column,
 * so unrelated posts can't be reached through this route.
 */
export async function getDirectorBySlug(
    slug: string
): Promise<DirectorPage | null> {
    const post = await fetchGhostPostBySlug(slug);
    if (!post) return null;

    const isTagged = post.tags?.some((tag) => tag.slug === DIRECTOR_TAG) ?? false;
    const isCurated = getSelections(DIRECTORS_SECTION).ghostPostIds.includes(
        post.id
    );
    if (!isTagged && !isCurated) return null;

    return { post, name: getDirectorDisplayName(post.id, post.title) };
}
