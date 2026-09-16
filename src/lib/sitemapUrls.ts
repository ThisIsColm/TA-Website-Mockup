import type { MetadataRoute } from "next";
import { getDirectors } from "@/lib/directors";
import { getSelections } from "@/lib/db";
import { fetchPostsByIds, type GhostPost } from "@/lib/ghost";
import { absoluteUrl } from "@/lib/siteUrl";

type SitemapEntry = MetadataRoute.Sitemap[number];

const WORK_SECTIONS = ["home.selectedWork", "work"] as const;
const INSIGHTS_SECTION = "case-studies";

function entry(
    path: string,
    options: Omit<SitemapEntry, "url"> = {}
): SitemapEntry {
    return { url: absoluteUrl(path), ...options };
}

function postsToEntries(
    posts: GhostPost[],
    pathPrefix: string
): SitemapEntry[] {
    const seen = new Set<string>();
    const entries: SitemapEntry[] = [];

    for (const post of posts) {
        if (!post.slug || seen.has(post.slug)) continue;
        seen.add(post.slug);
        entries.push(
            entry(`/${pathPrefix}/${post.slug}`, {
                lastModified: post.published_at
                    ? new Date(post.published_at)
                    : undefined,
                changeFrequency: "monthly",
                priority: 0.6,
            })
        );
    }

    return entries;
}

async function curatedPosts(sectionKeys: readonly string[]): Promise<GhostPost[]> {
    const ids = new Set<string>();
    for (const key of sectionKeys) {
        for (const id of getSelections(key).ghostPostIds) {
            ids.add(id);
        }
    }
    if (ids.size === 0) return [];
    return fetchPostsByIds([...ids]);
}

/** All public indexable URLs for sitemap.xml. */
export async function getSitemapEntries(): Promise<MetadataRoute.Sitemap> {
    const [workPosts, insightPosts, directors] = await Promise.all([
        curatedPosts(WORK_SECTIONS),
        curatedPosts([INSIGHTS_SECTION]),
        getDirectors(),
    ]);

    const staticPages: SitemapEntry[] = [
        entry("/", { changeFrequency: "weekly", priority: 1 }),
        entry("/work", { changeFrequency: "weekly", priority: 0.8 }),
        entry("/insights", { changeFrequency: "weekly", priority: 0.8 }),
        entry("/directors", { changeFrequency: "monthly", priority: 0.7 }),
        entry("/about", { changeFrequency: "monthly", priority: 0.7 }),
        entry("/contact", { changeFrequency: "yearly", priority: 0.5 }),
    ];

    const directorPages = directors
        .filter((d) => d.slug && !d.isPlaceholder)
        .map((d) =>
            entry(`/directors/${d.slug}`, {
                changeFrequency: "monthly",
                priority: 0.6,
            })
        );

    return [
        ...staticPages,
        ...postsToEntries(workPosts, "work"),
        ...postsToEntries(insightPosts, "insights"),
        ...directorPages,
    ];
}
