/**
 * Admin-only — fresh image list for a Ghost post (Directors stills picker).
 */

import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { fetchPostsByIds } from "@/lib/ghost";
import { extractPostImages } from "@/lib/postImages";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id) {
        return NextResponse.json({ error: "Missing post id" }, { status: 400 });
    }

    try {
        const refresh =
            request.nextUrl.searchParams.get("refresh") === "1" ||
            request.nextUrl.searchParams.get("refresh") === "true";

        const posts = await fetchPostsByIds([id], { refresh });
        const post = posts[0];

        if (!post) {
            return NextResponse.json({ error: "Post not found" }, { status: 404 });
        }

        const imageOptions = extractPostImages(post.html, post.feature_image).slice(
            0,
            40
        );

        return NextResponse.json({ imageOptions });
    } catch (err) {
        console.error("[api/ghost/posts/[id]/images] Error:", err);
        return NextResponse.json(
            { error: "Failed to load post images" },
            { status: 502 }
        );
    }
}
