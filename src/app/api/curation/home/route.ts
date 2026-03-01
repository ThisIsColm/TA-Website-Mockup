/**
 * Curation API for the homepage.
 *
 * GET  (public)  — returns curated selectedWork + caseStudies with resolved Ghost data
 * POST (admin)   — saves selections for both sections
 */

import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSelections, saveSelections } from "@/lib/db";
import { fetchPostsByIds, GhostPost } from "@/lib/ghost";

// ── Section keys ─────────────────────────────────────────────────

const SECTION_SELECTED_WORK = "home.selectedWork";
const SECTION_CASE_STUDIES = "home.caseStudies";

// ── Helpers ──────────────────────────────────────────────────────

function formatPost(post: GhostPost) {
    return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        url: post.url,
        feature_image: post.feature_image,
        excerpt: post.custom_excerpt || post.excerpt,
        published_at: post.published_at,
        tags: post.tags.map((t) => t.name),
    };
}

// ── GET (public) ─────────────────────────────────────────────────

export async function GET() {
    try {
        const workSelection = getSelections(SECTION_SELECTED_WORK);
        const studiesSelection = getSelections(SECTION_CASE_STUDIES);

        const [workPosts, studiesPosts] = await Promise.all([
            fetchPostsByIds(workSelection.ghostPostIds),
            fetchPostsByIds(studiesSelection.ghostPostIds),
        ]);

        return NextResponse.json({
            selectedWork: workPosts.map(formatPost),
            caseStudies: studiesPosts.map(formatPost),
            _meta: {
                selectedWorkUpdatedAt: workSelection.updatedAt,
                caseStudiesUpdatedAt: studiesSelection.updatedAt,
            },
        });
    } catch (err) {
        console.error("[api/curation/home] GET error:", err);

        // Safe empty fallback
        return NextResponse.json({
            selectedWork: [],
            caseStudies: [],
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
        const { selectedWork, caseStudies } = body;

        if (!Array.isArray(selectedWork) || !Array.isArray(caseStudies)) {
            return NextResponse.json(
                { error: "selectedWork and caseStudies must be arrays of post IDs" },
                { status: 400 }
            );
        }

        saveSelections(SECTION_SELECTED_WORK, selectedWork);
        saveSelections(SECTION_CASE_STUDIES, caseStudies);

        return NextResponse.json({
            success: true,
            message: "Selections saved successfully",
        });
    } catch (err) {
        console.error("[api/curation/home] POST error:", err);
        return NextResponse.json(
            { error: "Failed to save selections" },
            { status: 500 }
        );
    }
}
