/**
 * Curation API for all sections.
 *
 * GET  (public)  — returns curated lists for all sections with resolved Ghost data
 * POST (admin)   — saves selections for any provided section
 */

import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSelections, saveSelections, getPostMetadata } from "@/lib/db";
import { fetchPostsByIds, GhostPost } from "@/lib/ghost";

// ── Section keys ─────────────────────────────────────────────────

export const SECTIONS = [
    "home.selectedWork",
    "home.caseStudies",
    "work.commercial",
    "work.brand-stories",
    "work.music",
    "work.live",
    "case-studies",
    "home.clients"
] as const;

export type SectionKey = typeof SECTIONS[number];

// ── Helpers ──────────────────────────────────────────────────────

function formatPost(post: GhostPost) {
    const customMeta = getPostMetadata(post.id);

    return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        url: post.url,
        feature_image: post.feature_image,
        excerpt: post.custom_excerpt || post.excerpt,
        published_at: post.published_at,
        tags: post.tags.map((t) => t.name),
        director: customMeta?.director,
        client: customMeta?.client,
    };
}

// ── GET (public) ─────────────────────────────────────────────────

export async function GET() {
    try {
        const result: Record<string, ReturnType<typeof formatPost>[]> = {};
        const meta: Record<string, string> = {};

        // Fetch all sections concurrently
        await Promise.all(
            SECTIONS.map(async (sectionKey) => {
                const selection = getSelections(sectionKey);
                // fetchPostsByIds might return empty array if ids are empty, which is fast
                const posts = await fetchPostsByIds(selection.ghostPostIds);

                result[sectionKey] = posts.map(formatPost);
                meta[`${sectionKey}.updatedAt`] = selection.updatedAt;
            })
        );

        return NextResponse.json({
            ...result,
            _meta: meta,
        });
    } catch (err) {
        console.error("[api/curation/all] GET error:", err);

        // Safe empty fallback
        const emptyResult = Object.fromEntries(SECTIONS.map(s => [s, []]));
        return NextResponse.json({
            ...emptyResult,
            _meta: { error: "Failed to load curated content" },
        });
    }
}

// ── POST (admin-only) ────────────────────────────────────────────

export async function POST(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Body should be an object with section keys mapping to string arrays of IDs
        // e.g., { "home.selectedWork": ["id1", "id2"], "work.commercial": ["id3"] }

        if (!body || typeof body !== 'object') {
            return NextResponse.json(
                { error: "Invalid payload format" },
                { status: 400 }
            );
        }

        let savedCount = 0;

        for (const sectionKey of SECTIONS) {
            if (body[sectionKey] !== undefined) {
                if (!Array.isArray(body[sectionKey])) {
                    return NextResponse.json(
                        { error: `Section ${sectionKey} must be an array of post IDs` },
                        { status: 400 }
                    );
                }
                saveSelections(sectionKey, body[sectionKey]);
                savedCount++;
            }
        }

        return NextResponse.json({
            success: true,
            message: `Selections saved successfully for ${savedCount} sections`,
        });
    } catch (err) {
        console.error("[api/curation/all] POST error:", err);
        return NextResponse.json(
            { error: "Failed to save selections" },
            { status: 500 }
        );
    }
}
