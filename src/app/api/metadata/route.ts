import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import type { CreditEntry } from "@/lib/credits";
import { savePostMetadata } from "@/lib/db";

export async function POST(request: NextRequest) {
    if (!isAuthenticated(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();

        const { postId, data } = body;

        if (!postId || !data) {
            return NextResponse.json(
                { error: "Invalid payload format. Expected { postId, data: { director, client, creditsCol3, creditsCol5 } }" },
                { status: 400 }
            );
        }

        savePostMetadata(postId, {
            director: data.director,
            agency: data.agency,
            client: data.client,
            creditsCol3: data.creditsCol3 as CreditEntry[] | undefined,
            creditsCol5: data.creditsCol5 as CreditEntry[] | undefined,
            insightAuthorId: data.insightAuthorId as string | null | undefined,
        });

        return NextResponse.json({
            success: true,
            message: `Metadata saved successfully for post ${postId}`,
        });
    } catch (err) {
        console.error("[api/metadata] POST error:", err);
        return NextResponse.json(
            { error: "Failed to save metadata" },
            { status: 500 }
        );
    }
}
