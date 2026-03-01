/**
 * Ghost posts API — admin-only proxy to Ghost Content API.
 * Supports search & pagination without exposing the Ghost API key.
 */

import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { fetchGhostPosts, searchGhostPosts } from "@/lib/ghost";

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
            return NextResponse.json({
                posts,
                meta: {
                    pagination: {
                        page: 1,
                        limit: posts.length,
                        pages: 1,
                        total: posts.length,
                    },
                },
            });
        }

        // Standard paginated fetch
        const data = await fetchGhostPosts(page, limit);
        return NextResponse.json(data);
    } catch (err) {
        console.error("[api/ghost/posts] Error:", err);
        return NextResponse.json(
            { error: "Failed to fetch Ghost posts", posts: [] },
            { status: 502 }
        );
    }
}
