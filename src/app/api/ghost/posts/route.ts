/**
 * Ghost posts API — admin-only proxy to Ghost Content API.
 * Supports search & pagination without exposing the Ghost API key.
 */

import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { fetchGhostPosts, searchGhostPosts } from "@/lib/ghost";
import { getPostMetadata } from "@/lib/db";

export async function GET(request: NextRequest) {
    // Auth check
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    try {
        if (search) {
            // Search locally after fetching all posts
            const posts = await searchGhostPosts(search);
            const postsWithMeta = posts.map(p => {
                const meta = getPostMetadata(p.id);
                return { ...p, director: meta?.director, client: meta?.client };
            });

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

        // Standard paginated fetch
        const data = await fetchGhostPosts(page, limit);
        const postsWithMeta = data.posts.map((p: any) => {
            const meta = getPostMetadata(p.id);
            return { ...p, director: meta?.director, client: meta?.client };
        });

        return NextResponse.json({ ...data, posts: postsWithMeta });
    } catch (err) {
        console.error("[api/ghost/posts] Error:", err);
        return NextResponse.json(
            { error: "Failed to fetch Ghost posts", posts: [] },
            { status: 502 }
        );
    }
}
