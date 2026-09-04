/**
 * Ghost posts API — admin-only proxy to Ghost Content API.
 * Supports search, tag filter & pagination without exposing the Ghost API key.
 */

import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getPostMetadata } from "@/lib/db";
import {
    clearGhostCache,
    fetchGhostPosts,
    fetchPostsByTag,
    searchGhostPosts,
    type GhostPost,
} from "@/lib/ghost";
import { extractPostImages } from "@/lib/postImages";

function enrichGhostPostForAdmin(post: GhostPost) {
    const meta = getPostMetadata(post.id);

    return {
        ...post,
        director: meta?.director,
        agency: meta?.agency,
        client: meta?.client,
        creditsCol3: meta?.creditsCol3,
        creditsCol5: meta?.creditsCol5,
        insightAuthorId: meta?.insightAuthorId,
        insightTitle: meta?.insightTitle,
        workTitle: meta?.workTitle,
        directorName: meta?.directorName,
        directorStills: meta?.directorStills,
        previewStartTime: meta?.previewStartTime,
        imageOptions: extractPostImages(post.html, post.feature_image).slice(0, 40),
    };
}

export async function GET(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const refresh =
        searchParams.get("refresh") === "1" ||
        searchParams.get("refresh") === "true";

    try {
        if (refresh) {
            clearGhostCache();
        }

        if (tag) {
            const posts = await fetchPostsByTag(tag, { refresh });
            const enriched = posts.map(enrichGhostPostForAdmin);

            return NextResponse.json({
                posts: enriched,
                meta: {
                    pagination: {
                        page: 1,
                        limit: enriched.length,
                        pages: 1,
                        total: enriched.length,
                    },
                },
            });
        }

        if (search) {
            const posts = await searchGhostPosts(search, { refresh });
            const postsWithMeta = posts.map(enrichGhostPostForAdmin);

            return NextResponse.json({
                posts: postsWithMeta,
                meta: {
                    pagination: {
                        page: 1,
                        limit: postsWithMeta.length,
                        pages: 1,
                        total: postsWithMeta.length,
                    },
                },
            });
        }

        const data = await fetchGhostPosts(page, limit, undefined, { refresh });
        const postsWithMeta = data.posts.map(enrichGhostPostForAdmin);

        return NextResponse.json({ ...data, posts: postsWithMeta });
    } catch (err) {
        console.error("[api/ghost/posts] Error:", err);
        return NextResponse.json(
            { error: "Failed to fetch Ghost posts", posts: [] },
            { status: 502 }
        );
    }
}
